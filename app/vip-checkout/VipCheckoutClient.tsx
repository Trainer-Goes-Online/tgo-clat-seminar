"use client";

import { useEffect, useState } from "react";
import { capturePageParams, getStoredParams, paramsToQuery } from "@/lib/params";
import { setMetaAdvancedMatching } from "@/lib/analytics";
import { VIP_PERKS } from "@/lib/vip-config";
import { INDIA_STATES, citiesForState } from "@/lib/india-locations";
import VipPerks from "@/components/VipPerks";

/* VIP checkout island. Collects buyer details (validated), creates a Razorpay
   order server-side, opens Razorpay Checkout, verifies the signature server-side
   (which fires the Pabbly VIP webhook + Meta CAPI Purchase), then redirects to
   /vip-thankyou carrying the captured attribution params. */

type Form = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  state: string;
  town: string;
};

const EMPTY: Form = { first_name: "", last_name: "", email: "", phone: "", state: "", town: "" };

// ---- Razorpay Checkout typings (script injected at pay time) ----
type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};
type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (r: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
};
interface RazorpayInstance {
  open(): void;
  on(event: string, cb: (e: unknown) => void): void;
}
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function VipCheckoutClient({
  priceRupees,
  compareRupees,
}: {
  priceRupees: number;
  compareRupees: number;
}) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const onlyLetters = (v: string) => v.replace(/[^A-Za-z .'-]/g, "");
  const onlyDigits10 = (v: string) => v.replace(/\D/g, "").slice(0, 10);
  const set =
    (k: keyof Form, sanitize?: (v: string) => string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.setCustomValidity("");
      const v = sanitize ? sanitize(e.currentTarget.value) : e.currentTarget.value;
      setForm((p) => ({ ...p, [k]: v }));
    };
  const invalidMsg =
    (msg: string) => (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) =>
      e.currentTarget.setCustomValidity(msg);

  // Changing the state resets the dependent city so a stale city can't persist.
  const onStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value; // read before setForm — React nulls currentTarget after the handler
    e.currentTarget.setCustomValidity("");
    setForm((p) => ({ ...p, state: value, town: "" }));
  };

  useEffect(() => {
    capturePageParams();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    setLoading(true);
    try {
      const customer = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        dial_code: "+91",
        country_code: "IN",
        city: form.town,
        state: form.state,
      };

      // Fire MAM so the thank-you PageView ships with hashed identity (high EMQ).
      void setMetaAdvancedMatching({
        email: form.email,
        phone: `+91${form.phone}`,
        firstName: form.first_name,
        lastName: form.last_name,
        city: form.town,
        country: "IN",
      });

      const orderRes = await fetch("/api/razorpay/vip/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer }),
      });
      const order = await orderRes.json();
      if (!order.ok) throw new Error(order.error || "Could not start the payment.");

      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) throw new Error("Could not load the payment window. Check your connection and retry.");

      const params = getStoredParams();
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: order.brandName || "CLAT Possible",
        description: order.productName || "VIP Seat Upgrade",
        order_id: order.orderId,
        prefill: {
          name: `${form.first_name} ${form.last_name}`.trim(),
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#087EFF" },
        modal: { ondismiss: () => setLoading(false) },
        handler: async (resp) => {
          try {
            const vRes = await fetch("/api/razorpay/vip/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                customer,
                params,
                event_source_url: window.location.href,
              }),
            });
            const data = await vRes.json();
            if (!data.ok) throw new Error(data.error || "Payment could not be verified.");
            const qs = paramsToQuery(params);
            window.location.href = qs ? `/vip-thankyou?${qs}` : "/vip-thankyou";
          } catch (err) {
            setError(err instanceof Error ? err.message : "Payment verification failed. If money was deducted, contact us on WhatsApp.");
            setLoading(false);
          }
        },
      });
      rzp.on("payment.failed", () => {
        setError("Payment failed or was cancelled. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please retry.");
      setLoading(false);
    }
  }

  const priceLabel = `₹${priceRupees.toLocaleString("en-IN")}`;
  const compareLabel = compareRupees > 0 ? `₹${compareRupees.toLocaleString("en-IN")}` : "";

  return (
    <div className="page-stage page-light">
      <div className="shell">
        <div className="co-head">
          <span className="eyebrow"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.9 5.9 21.4l1.4-6.8L2.2 9.1l6.9-.8z" /></svg> Secure VIP checkout</span>
          <h1>Confirm Your <span className="em">VIP Seat</span></h1>
          <p>One-time payment of <span className="price">{priceLabel}</span>. Your VIP perks and event updates are delivered on WhatsApp right after.</p>
        </div>

        <form className="grid" onSubmit={handleSubmit} noValidate>
          <section className="card">
            <div className="card-head">
              <span className="card-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" /></svg></span>
              <div><h2 className="card-title">Your Details</h2><p className="card-note">We&rsquo;ll send your VIP access to these.</p></div>
            </div>
            <div className="row2">
              <div className="field"><label htmlFor="vfn">First Name</label><input id="vfn" required pattern="[A-Za-z][A-Za-z .'-]*" title="Letters only" autoComplete="given-name" placeholder="Aarav" value={form.first_name} onChange={set("first_name", onlyLetters)} onInvalid={invalidMsg("Please enter your first name (letters only).")} /></div>
              <div className="field"><label htmlFor="vln">Last Name</label><input id="vln" required pattern="[A-Za-z][A-Za-z .'-]*" title="Letters only" autoComplete="family-name" placeholder="Sharma" value={form.last_name} onChange={set("last_name", onlyLetters)} onInvalid={invalidMsg("Please enter your last name (letters only).")} /></div>
            </div>
            <div className="field"><label htmlFor="vem">Email</label><input id="vem" type="email" required placeholder="aarav@example.com" autoComplete="email" inputMode="email" value={form.email} onChange={set("email")} onInvalid={invalidMsg("Please enter a valid email address.")} /></div>
            <div className="field"><label htmlFor="vph">Phone <span className="hint">For WhatsApp access</span></label>
              <div className="phone"><span className="dial">+91</span><input id="vph" type="tel" required pattern="\d{10}" maxLength={10} inputMode="numeric" title="10-digit mobile number" placeholder="98765 43210" autoComplete="tel-national" value={form.phone} onChange={set("phone", onlyDigits10)} onInvalid={invalidMsg("Please enter a 10-digit mobile number (digits only).")} /></div></div>
            <div className="field"><label htmlFor="vst">Current State</label>
              <div className="selectwrap">
                <select id="vst" required value={form.state} onChange={onStateChange} onInvalid={invalidMsg("Please select the state you live in.")}>
                  <option value="" disabled>Select your state</option>
                  {INDIA_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
                <span className="selectwrap-ico" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5" /></svg></span>
              </div>
            </div>
            <div className="field"><label htmlFor="vct">Town / City</label>
              <div className="selectwrap">
                <select id="vct" required value={form.town} onChange={set("town")} onInvalid={invalidMsg("Please select your town or city.")}>
                  <option value="" disabled>{form.state ? "Select your city" : "First Select The Current State You Live In"}</option>
                  {form.state && citiesForState(form.state).map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
                <span className="selectwrap-ico" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5" /></svg></span>
              </div>
            </div>
            {error && <p className="vip-err" role="alert">{error}</p>}
            <button className="cta pay" type="submit" disabled={loading}><span>{loading ? "Opening secure payment…" : `Pay ${priceLabel} & Unlock VIP`}</span>
              <span className="cta-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5" /></svg></span></button>
            <div className="badges">
              <span className="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" /></svg> 256-bit secure</span>
              <span className="badge"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z" /></svg> Instant access</span>
              <span className="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.6l8 3v5.4c0 4.4-3 7.6-8 8.8-5-1.2-8-4.4-8-8.8V5.6z" /><path d="M9 12l2 2 4-4.2" /></svg> Payment protected</span>
            </div>
          </section>

          <aside className="card">
            <div className="card-head">
              <span className="card-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.9 5.9 21.4l1.4-6.8L2.2 9.1l6.9-.8z" /></svg></span>
              <div><h2 className="card-title">Your VIP Upgrade</h2></div>
            </div>
            <div className="item"><span className="item-logo">VIP</span><div><p className="item-t">CLAT Possible VIP Seat</p><p className="item-d">Everything in the free seminar, plus the three founder-level perks below.</p></div></div>
            <ul className="vip-reclist">
              {VIP_PERKS.map((p) => (
                <li key={p.key}><span className="vip-reccheck"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.5l4 4 8-9" /></svg></span>{p.title}</li>
              ))}
            </ul>
            <div className="total"><span className="total-l">Total Today</span><span>{compareLabel && <span className="total-was">{compareLabel}</span>}<span className="total-now">{priceLabel}</span></span></div>
            <p className="refund"><span className="seal-i"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.5l4 4 8-9" /></svg></span>
              One-time payment. Your VIP access and all event updates arrive on WhatsApp immediately after payment.</p>
          </aside>
        </form>

        {/* The bonuses they're unlocking — same graphics as the offer page */}
        <VipPerks band kicker="What you're unlocking" title="Your three VIP bonuses" />
      </div>
    </div>
  );
}
