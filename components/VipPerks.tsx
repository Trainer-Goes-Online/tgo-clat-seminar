"use client";

import { useEffect, useRef, useState } from "react";
import { VIP_PERKS } from "@/lib/vip-config";

/* The three VIP perks as premium visual cards. Shared across the offer page,
   the checkout, and the thank-you page so the "bonuses" always look identical.
   Each card shows a generated graphic if present (public/vip/perk-*.png), and
   falls back to an on-brand gold line-icon otherwise. */

const PERK_ICON: Record<string, JSX.Element> = {
  founders: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="17" cy="17" r="6" /><circle cx="33" cy="19" r="5" />
      <path d="M7 39c0-6 4.5-9 10-9s10 3 10 9M27 33c1.5-2.5 4-4 7-4 4.5 0 8 3 8 8" />
    </svg>
  ),
  circle: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="16" /><circle cx="24" cy="14" r="3.2" /><circle cx="34" cy="28" r="3.2" /><circle cx="14" cy="28" r="3.2" />
      <path d="M24 17v6m0 0l-7 4m7-4l7 4" />
    </svg>
  ),
  roadmap: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 40c0-6 8-6 8-12s-8-6-8-12" /><circle cx="10" cy="40" r="2.5" fill="currentColor" /><circle cx="18" cy="28" r="2.5" fill="currentColor" /><circle cx="10" cy="16" r="2.5" fill="currentColor" />
      <path d="M30 40V22l8-5 8 5v18" /><path d="M30 30h16M38 17v-6" />
    </svg>
  ),
};

// Detects an <img> that finished loading with no pixels (404 / decode error),
// even if the error fired before React hydration attached onError.
export function useBrokenImage(ref: React.RefObject<HTMLImageElement>, setFailed: (v: boolean) => void) {
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [ref, setFailed]);
}

function PerkVisual({ image, iconKey }: { image: string; iconKey: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useBrokenImage(ref, setFailed);
  return (
    <div className="vip-perk-visual">
      <span className="vip-perk-ico" aria-hidden="true">{PERK_ICON[iconKey]}</span>
      {!failed && (
        <img
          ref={ref}
          src={image}
          alt=""
          onLoad={(e) => { if (e.currentTarget.naturalWidth === 0) setFailed(true); }}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function VipPerks({
  kicker = "The VIP difference",
  title = "Three perks. One unfair advantage.",
  showHead = true,
  reveal = false,
  band = false,
}: {
  kicker?: string;
  title?: string;
  showHead?: boolean;
  reveal?: boolean; // add scroll-reveal classes (only useful inside .vip-stage)
  band?: boolean; // subtle highlighted background band
}) {
  const rc = reveal ? " reveal" : "";
  return (
    <section className={`vip-section vip-perks-sec${band ? " vip-perks-sec--band" : ""}`}>
      {showHead && (
        <div className={`vip-sec-head${rc}`}>
          <span className="vip-kicker">{kicker}</span>
          <h2 className="vip-h2">{title}</h2>
        </div>
      )}
      <div className="vip-perks">
        {VIP_PERKS.map((p, i) => (
          <article className={`vip-perk${rc}`} key={p.key}>
            <PerkVisual image={p.image} iconKey={p.key} />
            <div className="vip-perk-body">
              <span className="vip-perk-num">0{i + 1}</span>
              <h3 className="vip-perk-t">{p.title}</h3>
              <p className="vip-perk-d">{p.blurb}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
