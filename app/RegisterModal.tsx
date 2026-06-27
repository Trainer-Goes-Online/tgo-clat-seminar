"use client";

import { useEffect, useRef, useState } from "react";
import { capturePageParams } from "@/lib/params";
import { setMetaAdvancedMatching } from "@/lib/analytics";
import { submitFreeRegistration, isRegFormValid, type RegForm } from "@/lib/register";

/* Free-seminar registration as a CTA-triggered modal (replaces navigating to a
   checkout/register page). Every CTA on the landing page is an <a href="#register">;
   this island intercepts those clicks and opens the modal instead.

   On submit it fires Meta CAPI (CompleteRegistration + FreeWebinarRegistration)
   + the Pabbly webhook via /api/free-register, then redirects to /confirmation
   (carrying the captured landing-page params). Browser-side it fires MAM as soon
   as the form is valid so the confirmation PageView ships with full identity. */

const EMPTY: RegForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  grade: "",
  town: "",
};

export default function RegisterModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<RegForm>(EMPTY);
  const firstRef = useRef<HTMLInputElement>(null);
  const set =
    (k: keyof RegForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  // Capture landing-page URL params (utm_*, fbclid, ...) into the cp_params
  // cookie, and intercept every "#register" CTA → open the modal.
  useEffect(() => {
    capturePageParams();
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.('a[href="#register"]');
      if (!a) return;
      e.preventDefault();
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Body scroll lock + ESC to close + focus the first field when open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  // Fire MAM as soon as the form is valid + filled (debounced), independent of
  // submit — so any subsequent PageView ships with hashed identity (high EMQ).
  useEffect(() => {
    if (!isRegFormValid(form)) return;
    const t = setTimeout(() => {
      void setMetaAdvancedMatching({
        email: form.email,
        phone: `+91${form.phone}`,
        firstName: form.first_name,
        lastName: form.last_name,
        city: form.town,
        country: "IN",
      });
    }, 500);
    return () => clearTimeout(t);
  }, [form]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    setLoading(true);
    try {
      const r = await submitFreeRegistration(form);
      if (r.ok && r.redirect) window.location.href = r.redirect;
      else throw new Error(r.error || "Something went wrong.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong. Please retry.");
      setLoading(false);
    }
  }

  return (
    <div
      className={`rmodal${open ? " open" : ""}`}
      aria-hidden={!open}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="rmodal-panel" role="dialog" aria-modal="true" aria-label="Reserve your free seat">
        <button type="button" className="rmodal-x" aria-label="Close" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <div className="rmodal-head">
          <span className="eyebrow"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z" /></svg> Limited free seats</span>
          <h3>Reserve Your <span className="em">Free Seat</span></h3>
          <p>In person on 5th July &middot; 11 AM to 2 PM &middot; no payment, no card.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="row2">
            <div className="field"><label htmlFor="rfn">First Name</label><input ref={firstRef} id="rfn" required placeholder="Aarav" autoComplete="given-name" value={form.first_name} onChange={set("first_name")} /></div>
            <div className="field"><label htmlFor="rln">Last Name</label><input id="rln" required placeholder="Sharma" autoComplete="family-name" value={form.last_name} onChange={set("last_name")} /></div>
          </div>
          <div className="field"><label htmlFor="rem">Email</label><input id="rem" type="email" required placeholder="aarav@example.com" autoComplete="email" value={form.email} onChange={set("email")} /></div>
          <div className="field"><label htmlFor="rph">Phone</label>
            <div className="phone"><span className="dial">+91</span><input id="rph" type="tel" required placeholder="98765 43210" autoComplete="tel-national" value={form.phone} onChange={set("phone")} /></div></div>
          <div className="field"><label htmlFor="rgr">Class / Status</label><input id="rgr" required placeholder="Class 11 / 12 / Dropper / First-year" value={form.grade} onChange={set("grade")} /></div>
          <div className="field"><label htmlFor="rct">Town / City</label><input id="rct" required placeholder="Lucknow" value={form.town} onChange={set("town")} /></div>
          <button className="cta pay" type="submit" disabled={loading}><span>{loading ? "Reserving…" : "Book My Free Seat"}</span>
            <span className="cta-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5" /></svg></span></button>
          <p className="rmodal-fine">100% free &middot; No card needed &middot; Details on WhatsApp</p>
        </form>
      </div>
    </div>
  );
}
