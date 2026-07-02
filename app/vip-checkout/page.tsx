import type { Metadata } from "next";
import VipCheckoutClient from "./VipCheckoutClient";
import { getVipPriceRupees, getVipCompareRupees } from "@/lib/vip-config";

export const metadata: Metadata = {
  title: "VIP Seat Checkout — CLAT Possible",
  robots: { index: false, follow: false },
};

/* VIP checkout (Razorpay). Standalone — not linked from the funnel yet. Price is
   read server-side and passed down; the order amount is re-derived server-side in
   /api/razorpay/vip/create-order so the browser can never change what's charged. */
export default function VipCheckoutPage() {
  return (
    <VipCheckoutClient
      priceRupees={getVipPriceRupees()}
      compareRupees={getVipCompareRupees()}
    />
  );
}
