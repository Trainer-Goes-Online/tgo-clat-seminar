import ConfirmationClient from "./ConfirmationClient";

/* Post-registration confirmation (R12). Server component; the success seal is
   pure CSS. ConfirmationClient re-applies Meta Advanced Matching from the cp_mam
   cookie so this PageView ships with full identity. The CAPI + Pabbly fan-out
   already happened server-side in /api/free-register. Hierarchy mirrors the
   reference funnel: the WhatsApp join is the #1 action (enlarged, up top), then
   the show-up nudge, then the event details. The WhatsApp community link is
   env-driven (NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL). */

const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ||
  "https://chat.whatsapp.com/IuZeZmmJQvb0LEzyGLHl5K";

export default function ConfirmationPage() {
  return (
    <div className="page-stage page-light">
      <ConfirmationClient />
      <div className="wrap">
        <span className="eyebrow">Registration confirmed</span>
        <div className="seal" aria-hidden="true">
          <span className="seal-ring" /><span className="seal-ring b" />
          <span className="seal-disc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5 11-12" /></svg></span>
        </div>

        <h1>You&rsquo;re In. Your Seat Is <span className="em">Reserved.</span></h1>
        <p className="bridge">Your free seat at the 5th July CLAT seminar is locked. Here is exactly what happens next.</p>

        {/* PRIMARY action — join the WhatsApp community (enlarged + emphasised) */}
        <div className="wa wa--hero">
          <span className="wa-tag"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 3.2l2.5 5.1 5.6.8-4.05 4 .95 5.6L12 16.1l-5 2.6.95-5.6L3.9 9.1l5.6-.8z" /></svg> Your most important next step</span>
          <p className="wa-t">Join the seminar group on WhatsApp</p>
          <p className="wa-d">Your venue details, reminders, and prep notes all come through here. This is how we keep you posted before 5th July.</p>
          <a className="wa-btn" href={WHATSAPP_URL} target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.6 12.5l.3.5-.7 2.5-2.6-.7-.5.3A8 8 0 1 1 12 4z" /></svg> Join now</a>
        </div>

        {/* Show-up nudge directly under the button — high visibility */}
        <div className="motiv">
          <p className="motiv-quote">&ldquo;Be educated, be organised, be agitated.&rdquo;</p>
          <p className="motiv-by">&mdash; Dr. B.R. Ambedkar, architect of the Indian Constitution</p>
          <p className="motiv-note">Your seat is one of a limited few, and a real aspirant couldn&rsquo;t take it. The one thing we ask: show up on 5th July, and you walk out with your CLAT roadmap and a clear plan.<span className="motiv-host">&mdash; Dr. Surabhi Modi Sahai, CLAT Possible</span></p>
        </div>

        {/* Event details below the WhatsApp callout */}
        <div className="dates">
          <div className="dcell"><div className="d">Date</div><div className="n">5 Jul, Sun</div><div className="t">11 AM to 2 PM</div></div>
          <div className="dcell"><div className="d">Venue</div><div className="n">In person</div><div className="t">Constitution Club of India, New Delhi</div></div>
          <div className="dcell"><div className="d">Duration</div><div className="n">3 hrs</div><div className="t">Live Q&amp;A included</div></div>
        </div>
        <p className="dnote">A single in-person seminar &middot; 3 hours &middot; bring your questions for Dr. Surabhi</p>

        <div className="next">
          <div className="next-h">What happens next</div>
          <div className="nrow"><span className="nnum">01</span><p><b>Join the WhatsApp group.</b> Tap &ldquo;Join now&rdquo; above. Your venue details, reminders, and prep notes all come through there, not email.</p></div>
          <div className="nrow"><span className="nnum">02</span><p><b>Save 5th July.</b> Add the seminar to your calendar so it doesn&rsquo;t slip past. It is at Constitution Club of India, New Delhi, from 11 AM to 2 PM.</p></div>
          <div className="nrow"><span className="nnum">03</span><p><b>Show up ready on 5th July.</b> Bring your current level and your real questions, nothing else. You leave with your CLAT roadmap and a clear plan.</p></div>
        </div>

        <div className="colophon">
          Results vary by student effort and starting level. CLAT Possible.<br />
          <a href="/privacy">Privacy</a> &middot; <a href="/terms">Terms</a> &middot; <a href="/refund">Refund</a> &middot; <a href="/">Back to the seminar</a>
        </div>
      </div>
    </div>
  );
}
