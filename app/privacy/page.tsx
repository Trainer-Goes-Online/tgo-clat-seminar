import type { Metadata } from "next";
import LegalShell, { Sec } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy · CLAT Possible",
  description:
    "What information CLAT Possible collects, how we use it, and the choices you have.",
};

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      intro="Your trust matters. This page explains what information we collect, how we use it, and the choices you have."
      updated="27 June 2026"
    >
      <Sec n="01" title="Who we are">
        <p>
          This Privacy Policy explains how CLAT Possible (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects, uses, and safeguards your
          information when you visit this website, register for the CLAT Career
          Seminar, or otherwise interact with our services. By using this
          website or enrolling, you agree to the practices described here.
        </p>
      </Sec>

      <Sec n="02" title="Information we collect">
        <p>
          We collect information you provide directly, as well as information
          gathered automatically when you use the site:
        </p>
        <ul>
          <li>
            <strong>Contact and order details</strong> &mdash; your name, email
            address, phone number, city, and class/status, provided when you
            register.
          </li>
          <li>
            <strong>No payment information</strong> &mdash; the Program is free, so we
            do not collect or process any card or banking details.
          </li>
          <li>
            <strong>Usage and device data</strong> &mdash; pages viewed, clicks,
            approximate location, and browser/device type, collected through
            cookies and analytics tools.
          </li>
          <li>
            <strong>Marketing attribution</strong> &mdash; referral and advertising
            parameters (such as those from Meta, including click identifiers),
            used to measure and improve our campaigns.
          </li>
        </ul>
      </Sec>

      <Sec n="03" title="How we use your information">
        <p>We use your information to:</p>
        <ul>
          <li>Deliver the Program &mdash; send your seat confirmation, venue details, reminders, and prep notes.</li>
          <li>Provide customer support and answer your questions.</li>
          <li>Measure and improve our advertising and the experience we offer.</li>
          <li>Meet our legal, accounting, and regulatory obligations.</li>
        </ul>
      </Sec>

      <Sec n="04" title="Cookies and tracking technologies">
        <p>
          We use cookies and similar technologies, including the Meta Pixel and
          related identifiers (such as <code>_fbp</code> and <code>_fbc</code>),
          together with Meta&rsquo;s Conversions API, to understand how our ads
          perform and to improve targeting. You can control or clear cookies
          through your browser settings, though some features may not work as
          intended without them.
        </p>
      </Sec>

      <Sec n="05" title="How we share information">
        <p>
          We share data only with service providers that help us run the Program,
          and we do <strong>not</strong> sell your personal information. These
          include:
        </p>
        <ul>
          <li>Google Sheets and Pabbly Connect &mdash; our registration records (CRM).</li>
          <li>Meta &mdash; advertising measurement, including hashed identifiers shared via the Conversions API.</li>
          <li>WhatsApp &mdash; reminders and communication.</li>
        </ul>
      </Sec>

      <Sec n="06" title="Data retention">
        <p>
          We retain your information for as long as needed to deliver the Program,
          meet our legal and accounting obligations, and for legitimate business
          purposes. After that, it is deleted or anonymised.
        </p>
      </Sec>

      <Sec n="07" title="Data security">
        <p>
          We use reasonable technical and organisational measures to protect your
          information. Where personal identifiers are shared with advertising
          platforms for measurement, they are hashed (for example, using SHA-256)
          before transmission.
        </p>
      </Sec>

      <Sec n="08" title="Your rights">
        <p>
          You may request access to, correction of, or deletion of your personal
          information, and you may opt out of marketing communications at any
          time, by contacting us using the details below.
        </p>
      </Sec>

      <Sec n="09" title="Children's privacy">
        <p>
          Many CLAT aspirants are under 18. If you are a minor, you should
          register only with the consent and involvement of a parent or legal
          guardian, who is responsible for the information provided. We do not
          knowingly collect personal information from children without such
          consent; if you believe a child has provided data without it, please
          contact us and we will remove it.
        </p>
      </Sec>

      <Sec n="10" title="Changes to this policy">
        <p>
          We may update this policy from time to time. The latest version will
          always be posted on this page.
        </p>
      </Sec>

      <Sec n="11" title="Contact us">
        <p>
          For any privacy questions or grievances, contact our grievance officer
          at{" "}
          <a href="mailto:praveen.dwivedi@clatpossible.com">praveen.dwivedi@clatpossible.com</a>.
        </p>
      </Sec>
    </LegalShell>
  );
}
