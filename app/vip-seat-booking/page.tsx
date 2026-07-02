import type { Metadata } from "next";
import VipSeatClient from "./VipSeatClient";
import { getVipPriceRupees, getVipCompareRupees } from "@/lib/vip-config";

export const metadata: Metadata = {
  title: "Upgrade to a VIP Seat — CLAT Possible",
  description:
    "Turn your free CLAT seminar seat into a VIP Seat: a 1-on-1 with the founders, a private circle of CLAT achievers & NLU students, and a personalized roadmap to a top NLU.",
  robots: { index: false, follow: false },
};

/* VIP one-time-offer (OTO) page. Standalone — not linked from the funnel yet.
   Elaborates the three VIP perks with visuals + the founders, and its CTA sends
   the user to /vip-checkout (Razorpay). */
export default function VipSeatBookingPage() {
  return (
    <VipSeatClient
      priceRupees={getVipPriceRupees()}
      compareRupees={getVipCompareRupees()}
    />
  );
}
