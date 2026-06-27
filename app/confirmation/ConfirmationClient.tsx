"use client";

import { useEffect } from "react";
import { reapplyMamFromCookie } from "@/lib/analytics";

// Backup safety net: re-apply hashed Meta Advanced Matching from the cp_mam
// cookie on the confirmation page, so this PageView ships with full identity
// even if the inline pixel script raced the navigation. fbq init is idempotent.
export default function ConfirmationClient() {
  useEffect(() => {
    reapplyMamFromCookie();
  }, []);
  return null;
}
