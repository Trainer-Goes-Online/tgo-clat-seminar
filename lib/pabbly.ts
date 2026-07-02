// Posts the enriched, one-row-per-lead payload to the Pabbly Connect webhook,
// which writes it into the Google Sheet CRM. URL lives in PABBLY_WEBHOOK_URL.

async function postToWebhook(url: string, label: string, payload: Record<string, unknown>) {
  if (!url) {
    console.warn(`[pabbly] ${label} not set — skipping webhook`);
    return { skipped: true } as const;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`Pabbly ${res.status}: ${text}`);
  return { ok: true, status: res.status, body: text } as const;
}

// Free-lead webhook → Google Sheet CRM (PABBLY_WEBHOOK_URL).
export async function postToPabbly(payload: Record<string, unknown>) {
  return postToWebhook((process.env.PABBLY_WEBHOOK_URL || "").trim(), "PABBLY_WEBHOOK_URL", payload);
}

// VIP-purchase webhook → separate sheet/flow (PABBLY_VIP_WEBHOOK_URL). Fired only
// after a verified successful Razorpay payment.
export async function postToPabblyVip(payload: Record<string, unknown>) {
  return postToWebhook((process.env.PABBLY_VIP_WEBHOOK_URL || "").trim(), "PABBLY_VIP_WEBHOOK_URL", payload);
}
