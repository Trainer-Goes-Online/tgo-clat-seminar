/* Post-registration confirmation (R12). Static server component; the success seal
   is pure CSS. The email / WhatsApp confirmation delivery is wired server-side at
   the registration endpoint.
   TODO: wire to real CRM/registration endpoint (confirmation email + WhatsApp). */
export default function ConfirmationPage() {
  return (
    <div className="page-stage page-light">
      <div className="wrap">
        <span className="eyebrow">Registration confirmed</span>
        <div className="seal" aria-hidden="true">
          <span className="seal-ring" /><span className="seal-ring b" />
          <span className="seal-disc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5 11-12" /></svg></span>
        </div>

        <h1>You&rsquo;re In. Your Seat Is <span className="em">Reserved.</span></h1>
        <p className="bridge">Your free seat at the 5th July CLAT seminar is locked. Here is exactly what happens next.</p>

        <div className="dates">
          <div className="dcell"><div className="d">Date</div><div className="n">5 Jul, Sun</div><div className="t">11 AM to 2 PM</div></div>
          <div className="dcell"><div className="d">Venue</div><div className="n">In person</div><div className="t">Constitution Club of India, New Delhi</div></div>
          <div className="dcell"><div className="d">Duration</div><div className="n">3 hrs</div><div className="t">Live Q&amp;A included</div></div>
        </div>
        <p className="dnote">A single in-person seminar &middot; 3 hours &middot; bring your questions for Dr. Surabhi</p>

        <div className="next">
          <div className="next-h">What happens next</div>
          <div className="nrow"><span className="nnum">01</span><p><b>Check your inbox and WhatsApp.</b> Your seat confirmation and the venue details are on their way now, with a reminder before the day.</p></div>
          <div className="nrow"><span className="nnum">02</span><p><b>Save 5th July.</b> Add the seminar to your calendar so it doesn&rsquo;t slip past. It is at Constitution Club of India, New Delhi, from 11 AM to 2 PM.</p></div>
          <div className="nrow"><span className="nnum">03</span><p><b>Show up ready on 5th July.</b> Bring your current level and your real questions, nothing else. You leave with your CLAT roadmap and a clear plan.</p></div>
        </div>

        <div className="wa">
          <div><p className="wa-t">Join the seminar group on WhatsApp</p><p className="wa-d">Reminders, venue details, and the prep notes, all in one place.</p></div>
          <a className="wa-btn" href="#" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.6 12.5l.3.5-.7 2.5-2.6-.7-.5.3A8 8 0 1 1 12 4z" /></svg> Join now</a>
        </div>

        <div className="colophon">
          Results vary by student effort and starting level. CLAT Possible.<br />
          <a href="#">Privacy</a> &middot; <a href="#">Terms</a> &middot; <a href="/">Back to the seminar</a>
        </div>
      </div>
    </div>
  );
}
