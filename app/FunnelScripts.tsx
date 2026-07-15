"use client";

import { useEffect } from "react";

/* Client island for the seminar landing page: the "registration closes in"
   countdown, the stat count-up, reveal-on-scroll, and the sticky mobile CTA.
   (The 3-day journey spine was dropped: the seminar is a single 3-hour event.)
   All query the server-rendered markup by class/id, so they just work after
   hydration. Everything fails open (content visible if JS / motion is off). */
export default function FunnelScripts() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- "registration closes in" countdown ----
    // Seminar: Sunday, 26 July 2026, 11:00 AM IST at Wave Silver Tower, Sector 18, Noida.
    const cd = document.getElementById("countdown");
    let cdTimer: number | undefined;
    if (cd) {
      const end = new Date("2026-07-26T11:00:00+05:30").getTime();
      const d = cd.querySelector("[data-d]")!,
        h = cd.querySelector("[data-h]")!,
        m = cd.querySelector("[data-m]")!,
        s = cd.querySelector("[data-s]")!;
      const pad = (n: number) => String(n).padStart(2, "0");
      const tick = () => {
        const t = Math.max(0, end - Date.now()),
          sec = Math.floor(t / 1000);
        d.textContent = pad(Math.floor(sec / 86400));
        h.textContent = pad(Math.floor((sec % 86400) / 3600));
        m.textContent = pad(Math.floor((sec % 3600) / 60));
        s.textContent = pad(sec % 60);
      };
      tick();
      cdTimer = window.setInterval(tick, 1000);
    }

    // ---- stat count-up ----
    const fmt = (n: number) => n.toLocaleString("en-IN");
    const runCount = (el: HTMLElement) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const target = +(el.getAttribute("data-count") || 0),
        suf = el.getAttribute("data-suffix") || "";
      if (reduce) {
        el.textContent = fmt(target) + suf;
        return;
      }
      const dur = 1400;
      let t0 = 0;
      const tick = (now: number) => {
        if (!t0) t0 = now;
        const p = Math.min(1, (now - t0) / dur),
          e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * e)) + suf;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(target) + suf;
      };
      requestAnimationFrame(tick);
    };

    // ---- reveal-on-scroll + count-up triggers (shared IO) ----
    const nums = Array.from(document.querySelectorAll<HTMLElement>(".stat-num[data-count]"));
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    let io: IntersectionObserver | undefined;
    let io2: IntersectionObserver | undefined;
    if (!("IntersectionObserver" in window) || reduce) {
      reveals.forEach((e) => e.classList.add("in"));
      nums.forEach(runCount);
    } else {
      io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io!.unobserve(e.target);
            }
          }),
        { threshold: 0.12 }
      );
      reveals.forEach((e) => {
        if (e.getBoundingClientRect().top > innerHeight * 0.9) io!.observe(e);
        else e.classList.add("in");
      });
      io2 = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              runCount(e.target as HTMLElement);
              io2!.unobserve(e.target);
            }
          }),
        { threshold: 0.4 }
      );
      nums.forEach((n) => io2!.observe(n));
    }

    // ---- sticky mobile CTA: reveal after the hero, hide over the CTA sections ----
    const mcta = document.getElementById("mcta");
    let mio: IntersectionObserver | undefined;
    if (mcta) {
      const hero = document.querySelector(".hero");
      const ctaEls = Array.from(document.querySelectorAll(".midband, .finale"));
      const inView = new Set<Element>();
      let heroOut = false;
      mio = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.target === hero) {
              heroOut = !e.isIntersecting;
              return;
            }
            if (e.isIntersecting) inView.add(e.target);
            else inView.delete(e.target);
          });
          mcta.classList.toggle("show", heroOut && inView.size === 0);
        },
        { threshold: 0 }
      );
      if (hero) mio.observe(hero);
      ctaEls.forEach((el) => mio!.observe(el));
    }

    return () => {
      if (cdTimer) clearInterval(cdTimer);
      io?.disconnect();
      io2?.disconnect();
      mio?.disconnect();
    };
  }, []);

  return null;
}
