import { NextResponse } from "next/server";

/* Razorpay removed: the seminar is FREE, there is no payment to verify.
   Retired endpoint, returns 410 Gone. */
export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    { error: "Payments are disabled. This seminar is free; use /register." },
    { status: 410 }
  );
}
