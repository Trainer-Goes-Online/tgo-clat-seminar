"use client";

import { useEffect, useRef, useState } from "react";
import { capturePageParams, getStoredParams, paramsToQuery } from "@/lib/params";
import { VIP_FOUNDERS } from "@/lib/vip-config";
import VipPerks, { useBrokenImage } from "@/components/VipPerks";
import VipAchievers from "@/components/VipAchievers";
import { trackGa4EventOnce } from "@/lib/ga4";

/* VIP offer page — highly visual, interactive, on-brand. Founder photos fall
   back to an initials avatar if missing. CTAs carry attribution params to
   /vip-checkout; the decline links route to the normal /confirmation. */

function FounderPhoto({ photo, name, focus }: { photo: string; name: string; focus?: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useBrokenImage(ref, setFailed);
  const initials = name.replace(/^Dr\.?\s*/i, "").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  if (failed) return <div className="vip-founder-fallback" aria-hidden="true">{initials}</div>;
  return (
    <img
      ref={ref}
      src={photo}
      alt={name}
      style={focus ? { objectPosition: focus } : undefined}
      onLoad={(e) => { if (e.currentTarget.naturalWidth === 0) setFailed(true); }}
      onError={() => setFailed(true)}
    />
  );
}

export default function VipSeatClient({
  priceRupees,
  compareRupees,
}: {
  priceRupees: number;
  compareRupees: number;
}) {
  const [checkoutHref, setCheckoutHref] = useState("/vip-checkout");
  const [declineHref, setDeclineHref] = useState("/confirmation");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Merge any params arriving on the /vip URL into the cp_params cookie, then
    // carry them onward to both /vip-checkout (claim) and /confirmation (decline).
    capturePageParams();
    const qs = paramsToQuery(getStoredParams());
    setCheckoutHref(qs ? `/vip-checkout?${qs}` : "/vip-checkout");
    setDeclineHref(qs ? `/confirmation?${qs}` : "/confirmation");
  }, []);

  // Scroll-reveal for elements marked .reveal.
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll(".reveal");
    if (!els || !els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const priceLabel = `₹${priceRupees.toLocaleString("en-IN")}`;
  const compareLabel = compareRupees > 0 ? `₹${compareRupees.toLocaleString("en-IN")}` : "";

  return (
    <div className="page-stage page-light vip-stage" ref={rootRef}>
      {/* HERO */}
      <header className="vip-hero">
        <span className="vip-crown reveal" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4.5 3.5L12 4l4.5 7.5L21 8l-1.6 10.2a1 1 0 0 1-1 .8H5.6a1 1 0 0 1-1-.8z" /></svg>
        </span>
        <span className="eyebrow vip-hero-eyebrow"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z" /></svg> One decision before you go</span>
        <h1 className="vip-title">Your Seat Is Locked. Now Choose <span className="em em--gold">How You Show Up.</span></h1>
        <p className="vip-sub">On 26th July, you can walk in with the crowd &mdash; or walk in with direct founder access, the right people around you, and a plan built for <em>you</em>. Pick your path:</p>

        {/* Two-option decision box: go VIP, or keep the free seat only */}
        <div className="vip-choice reveal">
          <div className="vip-choice-opt vip-choice-opt--vip">
            <span className="vip-choice-badge">Recommended</span>
            <span className="vip-choice-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4.5 3.5L12 4l4.5 7.5L21 8l-1.6 10.2a1 1 0 0 1-1 .8H5.6a1 1 0 0 1-1-.8z" /></svg></span>
            <p className="vip-choice-t">Go VIP</p>
            <p className="vip-choice-d">A 1-on-1 with the founders, the private CLAT achievers &amp; NLU-students circle, and your personalized roadmap &mdash; on top of the seminar.</p>
            <p className="vip-choice-price">{compareLabel && <s>{compareLabel}</s>}<b>{priceLabel}</b><span>one-time</span></p>
            <a className="cta pay vip-cta vip-choice-cta" href={checkoutHref} onClick={() => trackGa4EventOnce("claim_vip")}><span>Claim My VIP Seat</span>
              <span className="cta-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5" /></svg></span></a>
          </div>

          <span className="vip-choice-or" aria-hidden="true">or</span>

          <div className="vip-choice-opt vip-choice-opt--free">
            <span className="vip-choice-badge vip-choice-badge--wa">Free &middot; Stay updated</span>
            <span className="vip-choice-ico vip-choice-ico--wa" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2z" /></svg></span>
            <p className="vip-choice-t">Just my free seat</p>
            <p className="vip-choice-d">Skip VIP and keep your free 26th July seat. Join the WhatsApp community so you don&rsquo;t miss the venue, timing, or reminders.</p>
            <a className="vip-choice-cta vip-choice-cta--wa" href={declineHref} onClick={() => trackGa4EventOnce("free_community")}><span>Join the free community</span>
              <span className="cta-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5" /></svg></span></a>
          </div>
        </div>
        <p className="vip-fine">Strictly limited VIP seats &middot; One-time payment &middot; Instant VIP WhatsApp Community access</p>
      </header>

      {/* PERKS (shared graphics section) */}
      <VipPerks reveal band kicker="The VIP difference" title="Three perks. One unfair advantage." />

      {/* FOUNDERS */}
      <section className="vip-section">
        <div className="vip-sec-head reveal">
          <span className="vip-kicker">Who you get access to</span>
          <h2 className="vip-h2">Guided personally by the <span className="em">founders</span></h2>
          <p className="vip-lead">Not a junior counsellor. The people who built CLAT Possible sit down with you, one on one.</p>
        </div>
        <div className="vip-founders">
          {VIP_FOUNDERS.map((f) => (
            <article className="vip-founder reveal" key={f.name}>
              <div className="vip-founder-photo"><FounderPhoto photo={f.photo} name={f.name} focus={f.focus} /></div>
              <div className="vip-founder-body">
                <p className="vip-founder-name">{f.name}</p>
                <p className="vip-founder-role">{f.role}</p>
                <p className="vip-founder-bio">{f.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ACHIEVERS / NLU STUDENTS — highlighted carousel */}
      <VipAchievers />

      {/* FAQ */}
      <section className="vip-section">
        <div className="vip-sec-head reveal">
          <span className="vip-kicker">Before you decide</span>
          <h2 className="vip-h2">Quick answers</h2>
        </div>
        <div className="vip-faq reveal">
          <details open><summary><span>Is this different from the free seminar?</span><span className="vip-faq-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5" /></svg></span></summary><p>Yes. You still attend the free 26th July seminar. VIP adds the 1-on-1 founder session, the private achievers &amp; NLU-students circle, and your personalized roadmap on top.</p></details>
          <details><summary><span>How do I get my VIP access?</span><span className="vip-faq-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5" /></svg></span></summary><p>Right after payment you land on your VIP confirmation page and join the WhatsApp community, where all VIP scheduling and event updates happen.</p></details>
          <details><summary><span>Is the payment secure?</span><span className="vip-faq-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5" /></svg></span></summary><p>Payments are processed over a secure, encrypted connection. We never see or store your card details.</p></details>
        </div>
      </section>

      {/* Sticky mobile CTA — one prominent golden pill */}
      <a className="vip-sticky" href={checkoutHref}>
        <span className="vip-sticky-txt">Click here to claim your VIP Seat for {priceLabel}</span>
        <span className="cta-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5" /></svg></span>
      </a>
    </div>
  );
}
