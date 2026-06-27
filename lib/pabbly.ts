// Posts the enriched, one-row-per-lead payload to the Pabbly Connect webhook,
// which writes it into the Google Sheet CRM. URL lives in PABBLY_WEBHOOK_URL.

export async function postToPabbly(payload: Record<string, unknown>) {
  const url = (process.env.PABBLY_WEBHOOK_URL || "").trim();
  if (!url) {
    console.warn("[pabbly] PABBLY_WEBHOOK_URL not set — skipping webhook");
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
