"use client";

import { useEffect, useRef, useState } from "react";
import { capturePageParams, getStoredParams, paramsToQuery } from "@/lib/params";
import { VIP_FOUNDERS } from "@/lib/vip-config";
import VipPerks, { useBrokenImage } from "@/components/VipPerks";
import VipAchievers from "@/components/VipAchievers";

/* VIP offer page — highly visual, interactive, on-brand. Founder photos fall
   back to an initials avatar if missing. CTAs carry attribution params to
   /vip-checkout; the decline links route to the normal /confirmation. */

function FounderPhoto({ photo, name }: { photo: string; name: string }) {
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
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    capturePageParams();
    const qs = paramsToQuery(getStoredParams());
    setCheckoutHref(qs ? `/vip-checkout?${qs}` : "/vip-checkout");
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
        <span className="eyebrow vip-hero-eyebrow"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z" /></svg> An invitation for serious aspirants</span>
        <h1 className="vip-title">Turn Your Free Seat Into a <span className="em em--gold">VIP Seat</span></h1>
        <p className="vip-sub">You&rsquo;ve locked your seat for 5th July. Now unlock the three things that actually decide who gets into a top NLU &mdash; direct founder access, the right people around you, and a plan built for <em>you</em>.</p>
        <div className="vip-hero-cta reveal">
          <span className="vip-hero-price">
            {compareLabel && <span className="vip-was">{compareLabel}</span>}
            <span className="vip-now">{priceLabel}</span>
            <span className="vip-now-tag">one-time</span>
          </span>
          <a className="cta pay vip-cta" href={checkoutHref}><span>Claim My VIP Seat</span>
            <span className="cta-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5" /></svg></span></a>
        </div>
        <a className="vip-decline" href="/confirmation">No thanks, I&rsquo;ll skip the VIP seat</a>
        <p className="vip-fine">Strictly limited VIP seats &middot; One-time payment &middot; Instant WhatsApp access</p>
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
              <div className="vip-founder-photo"><FounderPhoto photo={f.photo} name={f.name} /></div>
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
          <details open><summary><span>Is this different from the free seminar?</span><span className="vip-faq-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5" /></svg></span></summary><p>Yes. You still attend the free 5th July seminar. VIP adds the 1-on-1 founder session, the private achievers &amp; NLU-students circle, and your personalized roadmap on top.</p></details>
          <details><summary><span>How do I get my VIP access?</span><span className="vip-faq-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5" /></svg></span></summary><p>Right after payment you land on your VIP confirmation page and join the WhatsApp community, where all VIP scheduling and event updates happen.</p></details>
          <details><summary><span>Is the payment secure?</span><span className="vip-faq-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5" /></svg></span></summary><p>Payments are processed over a secure, encrypted connection. We never see or store your card details.</p></details>
        </div>
      </section>

      {/* FINAL CTA — highlighted panel */}
      <section className="vip-final reveal">
        <div className="vip-final-panel">
          <span className="vip-final-badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4.5 3.5L12 4l4.5 7.5L21 8l-1.6 10.2a1 1 0 0 1-1 .8H5.6a1 1 0 0 1-1-.8z" /></svg></span>
          <h2 className="vip-final-t">Your seat is booked. Now make it count.</h2>
          <p className="vip-final-d">VIP seats are limited on purpose &mdash; the sessions only work in a small room. If you&rsquo;re serious about a top NLU, claim yours now.</p>
          <a className="cta pay vip-cta" href={checkoutHref}><span>Claim My VIP Seat &middot; {priceLabel}</span>
            <span className="cta-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5" /></svg></span></a>
          <a className="vip-decline vip-decline--dark" href="/confirmation">No, I don&rsquo;t want to book my VIP seat</a>
          <p className="vip-fine vip-fine--dark">One-time payment &middot; Instant WhatsApp access &middot; Limited seats</p>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="vip-sticky">
        <div className="vip-sticky-p"><span className="vip-sticky-now">{priceLabel}</span><span className="vip-sticky-k">VIP seat</span></div>
        <a className="vip-sticky-cta" href={checkoutHref}>Claim now</a>
      </div>
    </div>
  );
}
