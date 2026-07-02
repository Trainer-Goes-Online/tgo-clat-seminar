import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { sendMetaPurchaseEvents } from "@/lib/meta-capi";
import { postToPabbly } from "@/lib/pabbly";

export const runtime = "nodejs";

// FREE seminar registration. No payment / no Razorpay. On submit we fire the Meta
// CAPI events (CompleteRegistration + a custom event, both env-driven) and POST
// the same 23-field enriched payload to the Pabbly webhook, then the client
// redirects to /confirmation. Both CAPI + Pabbly fail open (a missing env var or
// downstream error never blocks the user's confirmation).

type Customer = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  dial_code?: string;
  country_code?: string; // 2-letter ISO
  city?: string;
  state?: string;
  grade?: string;
};

type Body = {
  customer?: Customer;
  params?: Record<string, string>;
  event_source_url?: string;
};

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const c = body.customer || {};
    const params = body.params || {};

    const email = (c.email || "").trim();
    if (!email) {
      return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
    }

    const dial = (c.dial_code || "+91").trim();
    const phoneDigits = (c.phone || "").replace(/\D/g, "");
    const fullPhone = phoneDigits ? `${dial}${phoneDigits}` : "";
    const firstName = (c.first_name || "").trim();
    const lastName = (c.last_name || "").trim();
    const city = (c.city || "").trim();
    const countryIso = (c.country_code || "IN").trim();

    // No payment id exists for a free lead — mint a stable one for event_id + dedup.
    const leadId = "reg_" + crypto.randomUUID();
    const isTest = process.env.NODE_ENV !== "production" ? "true" : "false";

    let fbc = req.cookies.get("_fbc")?.value || "";
    const fbp = req.cookies.get("_fbp")?.value || "";
    const fbclidParam = (params.fbclid || "").trim();
    if (!fbc && fbclidParam) fbc = `fb.1.${Date.now()}.${fbclidParam}`;

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "";
    const clientUserAgent = req.headers.get("user-agent") || "";

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
    const eventSourceUrl = body.event_source_url || siteUrl || "";
    const externalId = sha256(email.toLowerCase());

    // Env-driven so each deployment can tune the event names without a redeploy.
    const standardEvent =
      process.env.FREE_STANDARD_EVENT === undefined
        ? "CompleteRegistration"
        : process.env.FREE_STANDARD_EVENT;
    const customEvent = process.env.FREE_CUSTOM_EVENT || "FreeWebinarRegistration";

    // ---- Meta CAPI: CompleteRegistration + custom (shared event_id = leadId) ----
    const capiTask = sendMetaPurchaseEvents({
      paymentId: leadId,
      email,
      phone: fullPhone,
      firstName,
      lastName,
      city,
      countryCode: countryIso,
      eventSourceUrl,
      fbc: fbc || undefined,
      fbp: fbp || undefined,
      clientIp: clientIp || undefined,
      clientUserAgent: clientUserAgent || undefined,
      valueRupees: 0, // free
      currency: "INR",
      standardEventName: standardEvent === "none" ? "" : standardEvent,
      customEventName: customEvent,
    });

    // ---- Pabbly: same 23-field schema as paid (amount 0), + grade + all_params ----
    const pabblyPayload = {
      lead_id: leadId,
      created_at: new Date().toISOString(),
      first_name: firstName,
      last_name: lastName,
      email,
      phone: fullPhone,
      city,
      country_code: countryIso,
      fbc,
      fbp,
      client_ip_address: clientIp,
      client_user_agent: clientUserAgent,
      external_id: externalId,
      event_source_url: eventSourceUrl,
      amount: 0,
      is_test: isTest,
      purchase_event_id: leadId,
      utm_source: params.utm_source || "",
      utm_medium: params.utm_medium || "",
      utm_campaign: params.utm_campaign || "",
      utm_content: params.utm_content || "",
      utm_term: params.utm_term || "",
      fbclid: params.fbclid || "",
      grade: (c.grade || "").trim(),
      state: (c.state || "").trim(),
      all_params: JSON.stringify(params),
    };
    const pabblyTask = postToPabbly(pabblyPayload);

    const [capiRes, pabblyRes] = await Promise.allSettled([capiTask, pabblyTask]);
    if (capiRes.status === "rejected")
      console.error("[free-register] Meta CAPI error:", capiRes.reason);
    if (pabblyRes.status === "rejected")
      console.error("[free-register] Pabbly error:", pabblyRes.reason);

    return NextResponse.json({ ok: true, leadId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
