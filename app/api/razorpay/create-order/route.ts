import { NextResponse } from "next/server";

/* Razorpay removed: the seminar is FREE, there is no payment.
   This endpoint is retired and returns 410 Gone so nothing calls it by mistake.
   The free registration posts to the CRM/registration endpoint instead. */
export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    { error: "Payments are disabled. This seminar is free; use /register." },
    { status: 410 }
  );
}
