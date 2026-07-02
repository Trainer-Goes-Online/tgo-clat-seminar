import { NextRequest, NextResponse } from "next/server";
import { getVipPriceRupees, VIP_CONFIG } from "@/lib/vip-config";

/* Creates a Razorpay order for the VIP upsell. Amount is SERVER-authoritative
   (from NEXT_PUBLIC_VIP_PRICE_RUPEES) — never trusts a client-sent amount. Uses
   the Razorpay REST API with Basic auth so no SDK/type dependency is needed.
   Returns the order id + public key_id for the browser checkout. */

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { ok: false, error: "Payments are not configured yet." },
        { status: 503 }
      );
    }

    // Optional notes for the Razorpay dashboard (helps reconcile leads).
    let notes: Record<string, string> = {};
    try {
      const body = (await req.json()) as { customer?: Record<string, string> };
      const c = body.customer || {};
      notes = {
        name: `${c.first_name || ""} ${c.last_name || ""}`.trim(),
        email: c.email || "",
        phone: c.phone || "",
      };
    } catch {
      /* body is optional */
    }

    const priceRupees = getVipPriceRupees();
    const amountPaise = Math.round(priceRupees * 100);

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: VIP_CONFIG.currency,
        receipt: `vip_${Date.now()}`,
        notes,
      }),
    });

    const order = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        (order && order.error && order.error.description) ||
        `Razorpay order failed (${res.status})`;
      return NextResponse.json({ ok: false, error: msg }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      priceRupees,
      productName: VIP_CONFIG.productName,
      brandName: VIP_CONFIG.brandName,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Order error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
