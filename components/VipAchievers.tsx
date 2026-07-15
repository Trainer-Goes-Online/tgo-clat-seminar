"use client";

import { useEffect, useRef, useState } from "react";
import { VIP_ACHIEVERS, type VipAchiever } from "@/lib/vip-config";
import { useBrokenImage } from "./VipPerks";

/* Highlighted "achievers & NLU students" INFINITE auto-slider — the people a VIP
   gets a private discussion with. Auto-advances one card every 2s and loops
   seamlessly (the list is duplicated; scroll position is normalised into the
   first copy so it never hits an end). Desktop: gold nav arrows; mobile: dots.
   Photos fall back to an initials avatar. */

const GAP = 16;
const INTERVAL = 2000;

function AchieverPhoto({ a }: { a: VipAchiever }) {
  const [failed, setFailed] = useState(!a.photo);
  const ref = useRef<HTMLImageElement>(null);
  useBrokenImage(ref, setFailed);
  const initials = a.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  if (failed || !a.photo) return <div className="vip-ac-fallback" aria-hidden="true">{initials}</div>;
  const focus = a.focus || "center 26%";
  const zoom = a.zoom && a.zoom !== 1 ? a.zoom : undefined;
  return (
    <img
      ref={ref}
      src={a.photo}
      alt={a.name}
      loading="lazy"
      style={{ objectPosition: focus, transformOrigin: focus, transform: zoom ? `scale(${zoom})` : undefined }}
      onLoad={(e) => { if (e.currentTarget.naturalWidth === 0) setFailed(true); }}
      onError={() => setFailed(true)}
    />
  );
}

export default function VipAchievers() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [active, setActive] = useState(0);
  const N = VIP_ACHIEVERS.length;
  const loop = [...VIP_ACHIEVERS, ...VIP_ACHIEVERS]; // duplicated for seamless wrap

  const step = () => {
    const card = trackRef.current?.querySelector<HTMLElement>(".vip-ac-card");
    return card ? card.offsetWidth + GAP : 200;
  };

  // Keep scrollLeft inside the first copy [0, N*step) so the loop is endless.
  const normalize = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const span = step() * N;
    let left = el.scrollLeft;
    if (left >= span - 1) left -= span;
    else if (left < 0) left += span;
    if (left !== el.scrollLeft) el.scrollLeft = left; // instant (no smooth) jump
    return left;
  };

  const move = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const left = normalize();
    el.scrollTo({ left: left + dir * step(), behavior: "smooth" });
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    normalize();
    el.scrollTo({ left: i * step(), behavior: "smooth" });
  };

  // Auto-advance every 2s (skipped when the tab/user prefers reduced motion).
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => { if (!pausedRef.current) move(1); }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  // Track the active dot as the slider scrolls.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const s = step();
      if (s) setActive(((Math.round(el.scrollLeft / s) % N) + N) % N);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [N]);

  return (
    <section className="vip-achievers reveal">
      <div
        className="vip-ach-panel"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        onTouchStart={() => { pausedRef.current = true; }}
      >
        <div className="vip-ach-head">
          <span className="vip-kicker vip-on-dark">Who&rsquo;s in the room</span>
          <h2 className="vip-h2 vip-on-dark">Meet real CLAT achievers &amp; NLU students</h2>
          <p className="vip-ach-lead">Your VIP pass gets you a private discussion with people who&rsquo;ve actually done it &mdash; toppers and National Law University students. Ask them anything: strategy, mistakes, daily routine, college life.</p>
        </div>

        <div className="vip-ac-wrap">
          <button type="button" className="vip-ac-nav vip-ac-nav--prev" aria-label="Previous" onClick={() => move(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <div className="vip-ac-track" ref={trackRef}>
            {loop.map((a, i) => (
              <article className="vip-ac-card" key={`${a.name}-${i}`} aria-hidden={i >= N}>
                <div className="vip-ac-photo"><AchieverPhoto a={a} /></div>
                <p className="vip-ac-name">{a.name}</p>
                <p className="vip-ac-college">{a.college}</p>
                <p className="vip-ac-detail">{a.detail}</p>
              </article>
            ))}
          </div>
          <button type="button" className="vip-ac-nav vip-ac-nav--next" aria-label="Next" onClick={() => move(1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="vip-ac-dots" role="tablist" aria-label="Achievers">
          {VIP_ACHIEVERS.map((a, i) => (
            <button
              key={a.name}
              type="button"
              className={`vip-ac-dot${i === active ? " on" : ""}`}
              aria-label={`Show ${a.name}`}
              aria-selected={i === active}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <p className="vip-ach-note">A few of the achievers in the CLAT Possible network. The full VIP panel for 26th July is shared inside your WhatsApp group.</p>
      </div>
    </section>
  );
}
