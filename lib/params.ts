"use client";

import { PARAMS_COOKIE_NAME, COOKIE_TTL_SECONDS } from "./checkout-config";

// Captures EVERY query param from the landing-page URL (utm_*, fbclid, gclid,
// and anything else), persists them to a first-party cookie, and forwards them
// across LP -> modal/register -> /confirmation so the full attribution chain
// reaches the Pabbly webhook + Meta CAPI on a successful registration.

export type ParamMap = Record<string, string>;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}

export function getStoredParams(): ParamMap {
  const raw = readCookie(PARAMS_COOKIE_NAME);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredParams(params: ParamMap) {
  if (typeof document === "undefined") return;
  if (Object.keys(params).length === 0) return;
  const value = encodeURIComponent(JSON.stringify(params));
  document.cookie = `${PARAMS_COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_TTL_SECONDS}; SameSite=Lax`;
}

/**
 * Read the current URL's query params, merge them OVER any previously stored
 * params (current URL wins per-key), persist, and return the merged map.
 */
export function capturePageParams(): ParamMap {
  if (typeof window === "undefined") return {};
  const stored = getStoredParams();
  const current: ParamMap = {};
  new URLSearchParams(window.location.search).forEach((v, k) => {
    if (v !== "") current[k] = v;
  });
  const merged = { ...stored, ...current };
  writeStoredParams(merged);
  return merged;
}

export function paramsToQuery(params: ParamMap): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== "") usp.set(k, String(v));
  });
  return usp.toString();
}
