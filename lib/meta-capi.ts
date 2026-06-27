import crypto from "node:crypto";
import { CHECKOUT_CONFIG } from "./checkout-config";

// Server-side Meta Conversions API sender. Fires TWO events per registration in
// a single POST: the standard event (CompleteRegistration — mature global ML
// priors + automatic iOS AEM attribution) and a custom event (internal
// source-of-truth). Both share event_id + user_data -> natural dedup, EMQ 9.3+.

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || "v25.0";

export type MetaCapiInput = {
  paymentId: string; // event_id (= the minted lead id for a free registration)
  email: string;
  phone: string; // dial code + number, raw
  firstName: string;
  lastName: string;
  city: string;
  countryCode: string; // 2-letter ISO
  eventSourceUrl: string;
  fbc?: string;
  fbp?: string;
  clientIp?: string;
  clientUserAgent?: string;
  valueRupees: number; // major units (rupees), NOT paise. 0 omits value/currency.
  currency: string;
  standardEventName?: string; // default "Purchase"; pass "" to omit the standard event
  customEventName?: string; // default CHECKOUT_CONFIG.customEventName
};

export async function sendMetaPurchaseEvents(input: MetaCapiInput) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    console.warn("[meta-capi] META_PIXEL_ID / META_CAPI_ACCESS_TOKEN not set — skipping CAPI");
    return { skipped: true } as const;
  }

  const normEmail = input.email.trim().toLowerCase();
  const hashedEmail = sha256(normEmail);
  const externalId = sha256(normEmail); // user-stable; matches browser MAM + Pabbly
  const phoneDigits = input.phone.replace(/\D/g, "");
  const fn = input.firstName.trim().toLowerCase();
  const ln = input.lastName.trim().toLowerCase();
  const ct = input.city.trim().toLowerCase().replace(/[^a-z]/g, "");
  const country = input.countryCode.trim().toLowerCase();

  const userData: Record<string, unknown> = {
    em: [hashedEmail],
    external_id: [externalId],
    ...(phoneDigits && { ph: [sha256(phoneDigits)] }),
    ...(fn && { fn: [sha256(fn)] }),
    ...(ln && { ln: [sha256(ln)] }),
    ...(ct && { ct: [sha256(ct)] }),
    ...(country && { country: [sha256(country)] }),
    // Raw context signals — never hashed.
    ...(input.fbc && { fbc: input.fbc }),
    ...(input.fbp && { fbp: input.fbp }),
    ...(input.clientUserAgent && { client_user_agent: input.clientUserAgent }),
    ...(input.clientIp && { client_ip_address: input.clientIp }),
  };

  // value/currency only carry meaning for paid conversions; omit for free (0).
  const customData: Record<string, unknown> = { payment_id: input.paymentId };
  if (input.valueRupees > 0) {
    customData.currency = input.currency;
    customData.value = input.valueRupees;
  }

  const baseEvent = {
    event_time: Math.floor(Date.now() / 1000),
    event_id: input.paymentId,
    action_source: "website",
    event_source_url: input.eventSourceUrl,
    user_data: userData,
    custom_data: customData,
  };

  // Paid funnel: Purchase + sales. Free funnel: CompleteRegistration + custom.
  const stdName =
    input.standardEventName === undefined ? "Purchase" : input.standardEventName;
  const custName = input.customEventName || CHECKOUT_CONFIG.customEventName;
  const events: Array<Record<string, unknown>> = [];
  if (stdName) events.push({ ...baseEvent, event_name: stdName });
  events.push({ ...baseEvent, event_name: custName });

  const payload: Record<string, unknown> = { data: events };
  const testCode = (process.env.META_TEST_EVENT_CODE || "").trim();
  if (testCode) payload.test_event_code = testCode;

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(
      accessToken
    )}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Meta CAPI ${res.status}: ${JSON.stringify(body)}`);
  return body;
}
