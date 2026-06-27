// Shared client-side free-registration submit, used by both the CTA modal and
// the /register fallback page. Fires browser MAM, POSTs to /api/free-register
// (which fires Meta CAPI + Pabbly), and returns where to redirect.

import { setMetaAdvancedMatching } from "./analytics";
import { getStoredParams, paramsToQuery } from "./params";

export type RegForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  grade: string;
  town: string;
};

export function isRegFormValid(form: RegForm): boolean {
  const filled =
    form.first_name.trim() &&
    form.last_name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.town.trim();
  if (!filled) return false;
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim());
}

export async function submitFreeRegistration(
  form: RegForm
): Promise<{ ok: boolean; redirect?: string; error?: string }> {
  // Refresh MAM so the /confirmation PageView ships with full hashed identity.
  await setMetaAdvancedMatching({
    email: form.email,
    phone: `+91${form.phone}`,
    firstName: form.first_name,
    lastName: form.last_name,
    city: form.town,
    country: "IN",
  });

  const res = await fetch("/api/free-register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer: {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        dial_code: "+91",
        country_code: "IN",
        city: form.town,
        grade: form.grade,
      },
      params: getStoredParams(),
      event_source_url:
        typeof window !== "undefined" ? window.location.href : "",
    }),
  });
  const data = await res.json();
  if (!data.ok) {
    return { ok: false, error: data.error || "Could not complete your registration." };
  }
  const qs = paramsToQuery(getStoredParams());
  return { ok: true, redirect: qs ? `/confirmation?${qs}` : "/confirmation" };
}
