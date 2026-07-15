import type { Metadata } from "next";
import LegalShell, { Sec } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Terms & Conditions · CLAT Possible",
  description:
    "The terms governing your use of this website and enrolment in the CLAT Career Seminar.",
};

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms & Conditions"
      intro="Please read these terms carefully before using this website or enrolling in the CLAT Career Seminar."
      updated="27 June 2026"
    >
      <Sec n="01" title="Acceptance of terms">
        <p>
          These Terms &amp; Conditions govern your use of this website and your
          enrolment in the CLAT Career Seminar (the &ldquo;Program&rdquo;)
          offered by CLAT Possible. By accessing this site or purchasing the
          Program, you agree to be bound by these terms. If you do not agree,
          please do not use the site or enrol.
        </p>
      </Sec>

      <Sec n="02" title="The Program">
        <p>
          The Program is a single live, in-person educational seminar held at
          3rd Floor, Wave Silver Tower, 310, Sector 18, Noida, Uttar Pradesh
          201301, on 26th July 2026 (Sunday) from 11 AM to 2 PM IST
          (approximately 3 hours), supported by a private WhatsApp
          community for confirmation, venue details, reminders, and instructions.
          It includes a full CLAT roadmap walkthrough and a live Q&amp;A with the
          host. The current date, timing, and venue are shown on the registration
          page and may be adjusted at our discretion to improve the experience.
        </p>
      </Sec>

      <Sec n="03" title="Eligibility">
        <p>
          The Program is intended for CLAT aspirants, including students in Class
          11 and 12, droppers, and reattempters. If you are under 18, you may
          enrol only with the involvement and consent of a parent or legal
          guardian, who accepts these terms on your behalf. By enrolling, you
          confirm that the information you provide is accurate and that you are
          permitted to enter into this agreement.
        </p>
      </Sec>

      <Sec n="04" title="Not legal or admissions advice">
        <p>
          All content, teaching, and tools are provided for educational and
          informational purposes only. Nothing in the Program constitutes legal
          advice, an admission guarantee, or a promise of any specific CLAT rank,
          score, or seat at any National Law University.
        </p>
      </Sec>

      <Sec n="05" title="Results disclaimer">
        <p>
          Actual CLAT results depend on many factors outside our control,
          including the student&rsquo;s own effort, consistency, and preparation.
          We make no guarantee of any particular rank, score, or seat, and
          individual results vary.
        </p>
      </Sec>

      <Sec n="06" title="Pricing">
        <p>
          The Program is currently offered <strong>free of charge</strong> &mdash;
          we do not collect any payment, card, or banking details to register or
          attend. If this ever changes, the price will be shown clearly before you
          register.
        </p>
      </Sec>

      <Sec n="07" title="Refunds">
        <p>
          Because the Program is free, there is nothing to pay and nothing to
          refund. See our <a href="/refund">Refund Policy</a> for details.
        </p>
      </Sec>

      <Sec n="08" title="Participant conduct">
        <p>
          Your access to the sessions and materials is personal to you. You agree
          not to record, reproduce, redistribute, or share access &mdash;
          including venue access, materials, and any session recordings &mdash;
          without our prior written permission.
        </p>
      </Sec>

      <Sec n="09" title="Intellectual property">
        <p>
          All content, teaching material, and branding are the intellectual
          property of CLAT Possible. Any duplication, reproduction, or
          distribution without written permission is strictly prohibited.
        </p>
      </Sec>

      <Sec n="10" title="Third-party services">
        <p>
          The Program relies on third-party services, including WhatsApp
          (communication), Meta (advertising and analytics), and our registration
          tools. Your use of those services is also subject to their respective
          terms and policies, and we are not responsible for their availability or
          conduct.
        </p>
      </Sec>

      <Sec n="11" title="Limitation of liability">
        <p>
          To the maximum extent permitted by law, CLAT Possible shall not be
          liable for any indirect, incidental, or consequential loss arising from
          your use of this website or the Program. Our total liability to you is
          limited to the fee you actually paid for the Program.
        </p>
      </Sec>

      <Sec n="12" title="Governing law">
        <p>
          These terms are governed by the laws of India. Any disputes arising out
          of or in connection with them are subject to the exclusive jurisdiction
          of the courts of Lucknow, Uttar Pradesh.
        </p>
      </Sec>

      <Sec n="13" title="Changes to these terms">
        <p>
          We may update these terms from time to time. The latest version will
          always be posted on this page, and your continued use of the website or
          the Program constitutes acceptance of the updated terms.
        </p>
      </Sec>

      <Sec n="14" title="Contact us">
        <p>
          Questions about these terms? Email us at{" "}
          <a href="mailto:praveen.dwivedi@clatpossible.com">praveen.dwivedi@clatpossible.com</a>.
        </p>
      </Sec>
    </LegalShell>
  );
}
