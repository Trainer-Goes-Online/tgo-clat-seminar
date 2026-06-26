"use client";

import { useState } from "react";

/* CLAT Possible, FREE seminar registration (mirrors the checkout architecture,
   but there is NO payment: no Razorpay, no price, no order. It is a simple lead
   form. The one required qualifier is the education selector. On submit we POST
   to a placeholder handler, then route to /confirmation. */

type Form = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  education: string;
};

const EDUCATION = [
  "Class 10th",
  "Class 11th",
  "Class 12th",
  "12th Passed",
  "CLAT Repeater",
];

export default function RegisterClient() {
  const [form, setForm] = useState<Form>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    education: "",
  });
  const [loading, setLoading] = useState(false);

  const set =
    (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    setLoading(true);
    try {
      // TODO: wire to real CRM/registration endpoint.
      // This is a free seminar reg, so there is no payment step. Post the lead
      // (name / phone / email / education) to the registration backend here,
      // then send confirmation by email + WhatsApp from the server.
      await new Promise((r) => setTimeout(r, 600));
      window.location.href = "/confirmation";
    } catch {
      alert("Something went wrong. Please retry.");
      setLoading(false);
    }
  }

  return (
    <div className="page-stage page-light">
      <div className="shell">
        <div className="co-head">
          <span className="eyebrow"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z" /></svg> You&rsquo;re one step from your seat</span>
          <h1>Reserve Your <span className="em">Free Seat</span></h1>
          <p>Add your details and lock your seat for the 5th July seminar. Your registration is <span className="price">&#8377;999 FREE</span>, with nothing to pay now or at the door.</p>
        </div>

        <form className="grid grid--reg" onSubmit={handleSubmit} noValidate>
          <section className="card">
            <div className="card-head"><span className="card-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" /></svg></span>
              <div><h2 className="card-title">Your Details</h2><p className="card-note">We&rsquo;ll send your seat confirmation to these.</p></div></div>
            <div className="row2">
              <div className="field"><label htmlFor="fn">First Name</label><input id="fn" required placeholder="Aarav" autoComplete="given-name" value={form.first_name} onChange={set("first_name")} /></div>
              <div className="field"><label htmlFor="ln">Last Name</label><input id="ln" required placeholder="Sharma" autoComplete="family-name" value={form.last_name} onChange={set("last_name")} /></div>
            </div>
            <div className="field"><label htmlFor="em">Email <span className="hint">Confirmation comes here</span></label><input id="em" type="email" required placeholder="aarav@example.com" autoComplete="email" value={form.email} onChange={set("email")} /></div>
            <div className="field"><label htmlFor="ph">Phone <span className="hint">For WhatsApp reminders</span></label>
              <div className="phone"><span className="dial">+91</span><input id="ph" type="tel" required placeholder="98765 43210" autoComplete="tel-national" value={form.phone} onChange={set("phone")} /></div></div>
            <div className="field"><label htmlFor="ed">Current Education <span className="hint">So we can place you right</span></label>
              <div className="selectwrap">
                <select id="ed" required value={form.education} onChange={set("education")}>
                  <option value="" disabled>Select one</option>
                  {EDUCATION.map((o) => (<option key={o} value={o}>{o}</option>))}
                </select>
                <span className="selectwrap-ico" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5"/></svg></span>
              </div>
            </div>
            <div className="badges">
              <span className="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" /></svg> SSL Secure</span>
              <span className="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.6l8 3v5.4c0 4.4-3 7.6-8 8.8-5-1.2-8-4.4-8-8.8V5.6z" /><path d="M9 12l2 2 4-4.2" /></svg> Verified</span>
              <span className="badge"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z" /></svg> Instant Confirmation</span>
            </div>
          </section>

          <aside className="card">
            <div className="card-head"><span className="card-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg></span>
              <div><h2 className="card-title">Your Seat</h2></div></div>
            <div className="item"><span className="item-logo">CP</span><div><p className="item-t">Free CLAT Career Seminar</p><p className="item-d">A single 3-hour, in-person seminar with Dr. Surabhi Modi Sahai. Your full CLAT roadmap, plus a live Q&amp;A.</p></div></div>
            <div className="rdetails">
              <div className="rdrow"><span className="rdrow-k">Date</span><span className="rdrow-v">5th July, Sunday</span></div>
              <div className="rdrow"><span className="rdrow-k">Time</span><span className="rdrow-v">11 AM to 2 PM</span></div>
              <div className="rdrow"><span className="rdrow-k">Venue</span><span className="rdrow-v">Constitution Club of India, New Delhi</span></div>
              <div className="rdrow"><span className="rdrow-k">Duration</span><span className="rdrow-v">3 hours, live and in person</span></div>
            </div>
            <div className="total"><span className="total-l">Total Today</span><span><span className="total-was">&#8377;999</span><span className="total-now total-free">FREE</span></span></div>
            <button className="cta pay" type="submit" disabled={loading}><span>{loading ? "Reserving your seat…" : (<>Register Now for <s className="cta-was">&#8377;999</s> FREE</>)}</span>
              <span className="cta-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5" /></svg></span></button>
            <p className="refund"><span className="seal-i"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.5l4 4 8-9" /></svg></span>
              100% free. Limited seats. 5th July, in person at Constitution Club of India, New Delhi.</p>
          </aside>
        </form>
      </div>
    </div>
  );
}
