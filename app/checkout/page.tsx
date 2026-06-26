import { redirect } from "next/navigation";

/* The seminar is FREE: there is no checkout. Razorpay has been removed.
   Any old /checkout link now lands on the free registration form. */
export default function CheckoutPage() {
  redirect("/register");
}
