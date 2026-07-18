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
      <ConfirmationClient whatsappUrl={WHATSAPP_URL} waEventName="joined_free_whatsapp" />
      <div className="wrap">
        <span className="eyebrow eyebrow--check"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 14.2L6.6 12l1.4-1.4 2.8 2.8 5.2-5.2L17.4 9.6z" /></svg> Registration confirmed</span>
        <div className="seal seal--urgent" aria-hidden="true">
          <span className="seal-ring" /><span className="seal-ring b" />
          <span className="seal-disc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9.2v4" /><path d="M12 17h.01" /></svg></span>
        </div>

        <h1><span className="hl">Your seat is <span className="em">Confirmed</span>,</span> <span className="hl">but <span className="em-urgent">one important step is left.</span></span></h1>
        <p className="bridge">Your free seat at the 26th July CLAT seminar is locked. To get the venue, timing and reminders, you must join the WhatsApp group below.</p>

        {/* PRIMARY action — join the WhatsApp community. Styled as the CRITICAL,
            unmissable step (WhatsApp-green + pulsing glow): all event updates
            flow only through this group, so skipping it means missing the event. */}
        <div className="wa wa--hero wa--critical">
          <span className="wa-tag"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7.2L4.8 6 12 3 19.2 6 12 9.2zM12 22a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z" /></svg> Required step &middot; Don&rsquo;t skip this</span>
          <p className="wa-t">First, join the seminar group on <span className="em-wa">WhatsApp</span></p>
          <p className="wa-d">Your venue details, reminders, and prep notes all come through here. This is how we keep you posted before <span className="wa-date">26th July</span>.</p>
          <a className="wa-btn" href={WHATSAPP_URL} target="_blank" rel="noopener" data-wa-join><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.6 12.5l.3.5-.7 2.5-2.6-.7-.5.3A8 8 0 1 1 12 4z" /></svg> Join now</a>
          <p className="wa-warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg> <span>All event updates are sent <b>only on WhatsApp</b> &mdash; not by email or SMS. Without joining, you will not get the venue or timing.</span></p>
        </div>

        {/* Show-up nudge directly under the button — high visibility */}
        <div className="motiv">
          <p className="motiv-quote">&ldquo;Be educated, be organised, be agitated.&rdquo;</p>
          <p className="motiv-by">&mdash; Dr. B.R. Ambedkar, architect of the Indian Constitution</p>
          <p className="motiv-note">Your seat is one of a limited few, and a real aspirant couldn&rsquo;t take it. The one thing we ask: show up on 26th July, and you walk out with your CLAT roadmap and a clear plan.<span className="motiv-host">&mdash; Dr. Surabhi Modi Sahai, CLAT Possible</span></p>
        </div>

        {/* Event details below the WhatsApp callout */}
        <div className="dates">
          <div className="dcell"><div className="d">Date</div><div className="n">26 Jul, Sun</div><div className="t">11 AM to 2 PM</div></div>
          <div className="dcell"><div className="d">Venue</div><div className="n">In person</div><div className="t">3rd Floor, Wave Silver Tower, 310, Sector 18, Noida, Uttar Pradesh 201301</div></div>
          <div className="dcell"><div className="d">Duration</div><div className="n">3 hrs</div><div className="t">Live Q&amp;A included</div></div>
        </div>
        <p className="dnote">A single in-person seminar &middot; 3 hours &middot; bring your questions for Dr. Surabhi</p>

        <div className="next">
          <div className="next-h">What happens next</div>
          <div className="nrow"><span className="nnum">01</span><p><b>Join the WhatsApp group.</b> Tap &ldquo;Join now&rdquo; above. Your venue details, reminders, and prep notes all come through there, not email.</p></div>
          <div className="nrow"><span className="nnum">02</span><p><b>Save 26th July.</b> Add the seminar to your calendar so it doesn&rsquo;t slip past. It is at 3rd Floor, Wave Silver Tower, 310, Sector 18, Noida, Uttar Pradesh 201301, from 11 AM to 2 PM IST.</p></div>
          <div className="nrow"><span className="nnum">03</span><p><b>Show up ready on 26th July.</b> Bring your current level and your real questions, nothing else. You leave with your CLAT roadmap and a clear plan.</p></div>
        </div>

        <div className="colophon">
          Results vary by student effort and starting level. CLAT Possible.<br />
          <a href="/privacy">Privacy</a> &middot; <a href="/terms">Terms</a> &middot; <a href="/refund">Refund</a> &middot; <a href="/">Back to the seminar</a>
        </div>
      </div>
    </div>
  );
}
