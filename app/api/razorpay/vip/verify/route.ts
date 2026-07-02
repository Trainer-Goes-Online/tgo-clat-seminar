import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { sendMetaPurchaseEvents } from "@/lib/meta-capi";
import { postToPabblyVip } from "@/lib/pabbly";
import { getVipPriceRupees, VIP_CONFIG } from "@/lib/vip-config";

/* Verifies a Razorpay VIP payment, then fans out server-side (fail-open):
   - Meta CAPI: ONE custom event ("vip_sale", env VIP_CUSTOM_EVENT) — NO standard
     event (no Purchase). Carries the ₹ value + full hashed identity.
   - Pabbly VIP webhook (PABBLY_VIP_WEBHOOK_URL) → separate CRM row for buyers.
   Signature check is mandatory: HMAC_SHA256(order_id|payment_id, key_secret).
   A missing env var or downstream error never blocks the buyer's thank-you page. */

export const runtime = "nodejs";

type Customer = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  dial_code?: string;
  country_code?: string;
  city?: string;
  state?: string;
  grade?: string;
};

type Body = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  customer?: Customer;
  params?: Record<string, string>;
  event_source_url?: string;
};

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
    if (!keySecret) {
      return NextResponse.json({ ok: false, error: "Payments are not configured." }, { status: 503 });
    }

    const body = (await req.json()) as Body;
    const orderId = body.razorpay_order_id || "";
    const paymentId = body.razorpay_payment_id || "";
    const signature = body.razorpay_signature || "";
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ ok: false, error: "Missing payment fields." }, { status: 400 });
    }

    // Verify the signature (constant-time compare).
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    const valid =
      expected.length === signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Payment verification failed." }, { status: 400 });
    }

    // ---- Payment is genuine from here on ----
    const c = body.customer || {};
    const params = body.params || {};
    const email = (c.email || "").trim();
    const dial = (c.dial_code || "+91").trim();
    const phoneDigits = (c.phone || "").replace(/\D/g, "");
    const fullPhone = phoneDigits ? `${dial}${phoneDigits}` : "";
    const firstName = (c.first_name || "").trim();
    const lastName = (c.last_name || "").trim();
    const city = (c.city || "").trim();
    const countryIso = (c.country_code || "IN").trim();
    const priceRupees = getVipPriceRupees();
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
    const externalId = email ? sha256(email.toLowerCase()) : "";

    // ---- Meta CAPI: ONE custom event only (vip_sale), NO standard event ----
    const capiTask = sendMetaPurchaseEvents({
      paymentId,
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
      valueRupees: priceRupees,
      currency: VIP_CONFIG.currency,
      standardEventName: "", // omit the standard event — custom only
      customEventName: process.env.VIP_CUSTOM_EVENT || "vip_sale",
    });

    // ---- Pabbly VIP webhook: one enriched row per buyer ----
    const pabblyPayload = {
      lead_id: paymentId,
      created_at: new Date().toISOString(),
      product: VIP_CONFIG.productName,
      first_name: firstName,
      last_name: lastName,
      email,
      phone: fullPhone,
      city,
      state: (c.state || "").trim(),
      country_code: countryIso,
      grade: (c.grade || "").trim(),
      amount: priceRupees,
      currency: VIP_CONFIG.currency,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      payment_status: "paid",
      is_test: isTest,
      fbc,
      fbp,
      client_ip_address: clientIp,
      client_user_agent: clientUserAgent,
      external_id: externalId,
      event_source_url: eventSourceUrl,
      purchase_event_id: paymentId,
      utm_source: params.utm_source || "",
      utm_medium: params.utm_medium || "",
      utm_campaign: params.utm_campaign || "",
      utm_content: params.utm_content || "",
      utm_term: params.utm_term || "",
      fbclid: params.fbclid || "",
      all_params: JSON.stringify(params),
    };
    const [capiRes, pabblyRes] = await Promise.allSettled([capiTask, postToPabblyVip(pabblyPayload)]);
    if (capiRes.status === "rejected") console.error("[vip-verify] Meta CAPI error:", capiRes.reason);
    if (pabblyRes.status === "rejected") console.error("[vip-verify] Pabbly error:", pabblyRes.reason);

    return NextResponse.json({ ok: true, paymentId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Verification error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
