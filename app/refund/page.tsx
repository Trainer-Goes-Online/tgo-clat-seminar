import type { Metadata } from "next";
import LegalShell, { Sec } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Refund Policy · CLAT Possible",
  description:
    "The CLAT Career Seminar is free, so here's how registration and cancellation work.",
};

export default function RefundPage() {
  return (
    <LegalShell
      title="Refund Policy"
      intro="The CLAT Career Seminar is free to attend, so there's nothing to pay and nothing to refund."
      updated="27 June 2026"
    >
      <Sec n="01" title="It's free, nothing to refund">
        <p>
          Registration for the CLAT Career Seminar is{" "}
          <strong>completely free</strong>. We do not collect any payment, card, or
          banking details to register or attend, so there is no fee to refund.
        </p>
      </Sec>

      <Sec n="02" title="Cancelling your spot">
        <p>
          Changed your mind? You can simply not attend, or leave the WhatsApp
          community at any time. To have your details removed from our records,
          email us using the address below.
        </p>
      </Sec>

      <Sec n="03" title="If pricing ever changes">
        <p>
          If we introduce a paid offering in the future, any applicable fees and a
          full refund policy will be shown clearly before you pay, and this page
          will be updated accordingly.
        </p>
      </Sec>

      <Sec n="04" title="Contact us">
        <p>
          Questions? Email us at{" "}
          <a href="mailto:praveen.dwivedi@clatpossible.com">praveen.dwivedi@clatpossible.com</a>.
        </p>
      </Sec>
    </LegalShell>
  );
}
