"use client";

import { MAM_COOKIE_NAME, COOKIE_TTL_SECONDS } from "./checkout-config";

// Pixel ID is inlined into the client bundle via NEXT_PUBLIC_. Pixel IDs are not
// secrets (anyone with the Meta Pixel Helper can read them). The CAPI access
// token is the secret and is server-only — it never appears in this file.
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * SHA-256 hex via the Web Crypto API (HTTPS + http://localhost). We pre-hash so
 * the cookie never stores plain PII; Meta detects 64-char hex as already-hashed
 * and uses it verbatim (no double-hashing).
 */
async function sha256Hex(value: string): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) return value;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Meta-spec normalise, SHA-256 hash, derive external_id from the email hash. */
async function buildHashedMatching(data: {
  email?: string;
  phone?: string; // raw, with or without dial code
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string; // 2-letter ISO, case-insensitive
}): Promise<Record<string, string>> {
  const normalised: Record<string, string | undefined> = {};
  if (data.email) normalised.em = data.email.trim().toLowerCase();
  if (data.phone) {
    const digits = data.phone.replace(/\D/g, "");
    if (digits) normalised.ph = digits;
  }
  if (data.firstName) normalised.fn = data.firstName.trim().toLowerCase();
  if (data.lastName) normalised.ln = data.lastName.trim().toLowerCase();
  if (data.city) {
    const ct = data.city.trim().toLowerCase().replace(/[^a-z]/g, "");
    if (ct) normalised.ct = ct;
  }
  if (data.country) {
    const c = data.country.trim().toLowerCase();
    if (c) normalised.country = c;
  }

  const keys = Object.keys(normalised);
  const hashes = await Promise.all(keys.map((k) => sha256Hex(normalised[k] as string)));
  const matching: Record<string, string> = {};
  keys.forEach((k, i) => {
    matching[k] = hashes[i];
  });
  // external_id must be user-stable AND identical across browser + CAPI.
  if (matching.em) matching.external_id = matching.em;
  return matching;
}

function writeMamCookie(matching: Record<string, string>) {
  if (typeof document === "undefined") return;
  if (Object.keys(matching).length === 0) return;
  const value = encodeURIComponent(JSON.stringify(matching));
  document.cookie = `${MAM_COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_TTL_SECONDS}; SameSite=Lax`;
}

export function readMamCookie(): Record<string, string> | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${MAM_COOKIE_NAME}=([^;]+)`));
  if (!m) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(m[1]));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Re-init the Meta Pixel with Manual Advanced Matching. Pass RAW form values —
 * this hashes them client-side, persists the hashes to the cp_mam cookie, then
 * calls fbq init so all subsequent pixel events inherit the identity.
 * Call sites: form-fill effect, submit handler.
 */
export async function setMetaAdvancedMatching(data: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
}) {
  if (typeof window === "undefined" || !window.fbq) return;
  const matching = await buildHashedMatching(data);
  if (Object.keys(matching).length === 0) return;
  window.fbq("init", META_PIXEL_ID, matching);
  writeMamCookie(matching);
}

/** Re-fire MAM from the persisted cookie (safety net on the confirmation page). */
export function reapplyMamFromCookie() {
  if (typeof window === "undefined" || !window.fbq) return;
  const matching = readMamCookie();
  if (!matching || Object.keys(matching).length === 0) return;
  window.fbq("init", META_PIXEL_ID, matching);
}
