import type { Metadata } from "next";
import ConfirmationClient from "../confirmation/ConfirmationClient";
import VipPerks from "@/components/VipPerks";

/* VIP thank-you (post-payment). Standalone — reached only after a verified
   Razorpay payment on /vip-checkout. Reuses ConfirmationClient for the
   "have you joined?" guard + join tracking, and carries the SAME black WhatsApp
   community section (the one required step for VIP scheduling + event updates).
   The CAPI + Pabbly VIP fan-out already happened server-side in the verify route. */

// VIP-specific community (separate from the free /confirmation group).
const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_VIP_WHATSAPP_COMMUNITY_URL ||
  "https://chat.whatsapp.com/CcAHgXpYEC1A3um7OxFzE0";

export const metadata: Metadata = {
  title: "VIP Seat Confirmed — CLAT Possible",
  robots: { index: false, follow: false },
};

export default function ThankYouVipPage() {
  return (
    <div className="page-stage page-light">
      <ConfirmationClient whatsappUrl={WHATSAPP_URL} />
      <div className="wrap">
        <span className="eyebrow eyebrow--check"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 14.2L6.6 12l1.4-1.4 2.8 2.8 5.2-5.2L17.4 9.6z" /></svg> Payment successful &middot; VIP unlocked</span>
        <div className="seal seal--vip" aria-hidden="true">
          <span className="seal-ring" /><span className="seal-ring b" />
          <span className="seal-disc"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4.5 3.5L12 4l4.5 7.5L21 8l-1.6 10.2a1 1 0 0 1-1 .8H5.6a1 1 0 0 1-1-.8z" /></svg></span>
        </div>

        <h1><span className="hl">You&rsquo;re In. Your <span className="em em--gold">VIP Seat</span></span> <span className="hl">is Confirmed.</span></h1>
        <p className="bridge">Your VIP upgrade is active. <span className="bridge-em">One required step is left</span> to receive your 1-on-1 slot, the private circle invite, and every event update.</p>

        {/* PRIMARY action — the same critical black WhatsApp community box */}
        <div className="wa wa--hero wa--critical">
          <span className="wa-tag"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7.2L4.8 6 12 3 19.2 6 12 9.2zM12 22a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z" /></svg> Required step &middot; Your VIP access is here</span>
          <p className="wa-t">Join the VIP seminar group on <span className="em-wa">WhatsApp</span></p>
          <p className="wa-d">Your 1-on-1 scheduling, the private achievers circle invite, and all updates come through here before <span className="wa-date">12th July</span>.</p>
          <a className="wa-btn" href={WHATSAPP_URL} target="_blank" rel="noopener" data-wa-join><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.6 12.5l.3.5-.7 2.5-2.6-.7-.5.3A8 8 0 1 1 12 4z" /></svg> Join now</a>
          <p className="wa-warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg> <span>Everything VIP is coordinated <b>only on WhatsApp</b> &mdash; not email or SMS. Without joining, we can&rsquo;t schedule your session.</span></p>
        </div>

        {/* What happens next for VIP */}
        <div className="next">
          <div className="next-h">What happens next</div>
          <div className="nrow"><span className="nnum">01</span><p><b>Join the WhatsApp group.</b> Tap &ldquo;Join now&rdquo; above. This is where your entire VIP experience is coordinated.</p></div>
          <div className="nrow"><span className="nnum">02</span><p><b>Watch for your VIP invites.</b> Your 1-on-1 founder slot and the private achievers &amp; NLU-students circle invite are shared inside the group.</p></div>
          <div className="nrow"><span className="nnum">03</span><p><b>Show up ready on 12th July.</b> Bring your real questions. You leave with your personalized roadmap and a clear plan to a top NLU.</p></div>
        </div>

      </div>

      {/* Highlighted recap of the VIP bonuses they just unlocked */}
      <VipPerks band kicker="Your VIP bonuses" title="Everything you just unlocked" />

      <div className="wrap vip-ty-foot">
        <div className="colophon">
          Results vary by student effort and starting level. CLAT Possible.<br />
          <a href="/privacy">Privacy</a> &middot; <a href="/terms">Terms</a> &middot; <a href="/refund">Refund</a>
        </div>
      </div>
    </div>
  );
}
