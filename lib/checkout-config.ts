// Single source of truth for registration + Meta tracking constants (CLAT Possible).
// Pure constants only (no "use client") so this can be imported from both server
// routes and client components.

export const CHECKOUT_CONFIG = {
  brandName: "CLAT Possible",
  productName: "Free CLAT Career Seminar (5th July, in person)",
  // Free funnel: the custom event fired server-side alongside the standard
  // CompleteRegistration. Env (FREE_CUSTOM_EVENT) overrides this at the route.
  customEventName: "FreeWebinarRegistration",
  currency: "INR",
  amountRupees: 0, // the seminar is free
} as const;

// First-party cookies (same-origin, SameSite=Lax, 30-day TTL).
export const MAM_COOKIE_NAME = "cp_mam"; // hashed Meta Advanced Matching values
export const PARAMS_COOKIE_NAME = "cp_params"; // forwarded landing-page URL params
export const COOKIE_TTL_SECONDS = 30 * 24 * 60 * 60;
