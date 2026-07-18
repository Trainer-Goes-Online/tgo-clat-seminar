"use client";

// GA4 event helper. The GA4 (gtag.js, G-597B9EZ7NK) + Microsoft Clarity base
// tags are hardcoded in app/layout.tsx. This fires a GA4 event AT MOST ONCE per
// browser, ever — these are reach/intent counts (how many people did X), not
// volume. Fully independent of the Meta stack (its own cp_ga4_* flag namespace),
// so a Meta outage never suppresses GA4 and vice versa.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackGa4EventOnce(event: string) {
  if (typeof window === "undefined") return;
  // If gtag isn't loaded yet (blocked by an ad-blocker / not ready), do NOT
  // stamp the flag — otherwise the event is permanently suppressed for this
  // browser and can never fire on a later, working session.
  if (typeof window.gtag !== "function") return;

  const key = `cp_ga4_${event}_fired`;
  try {
    if (localStorage.getItem(key) === "1") return; // already fired once
    localStorage.setItem(key, "1"); // stamp BEFORE firing (a click often navigates away)
  } catch {
    /* private mode / sandboxed iframe: best-effort dedup, fire anyway */
  }
  try {
    window.gtag("event", event);
  } catch {
    /* analytics must never throw into a click handler */
  }
}
