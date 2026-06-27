import type { ReactNode } from "react";

// Shared chrome for the privacy / terms / refund pages. Server component — uses
// the funnel's brand tokens (var(--ink), var(--gold-deep)…) from /funnel.css so
// it matches the rest of the site, with a few legal-specific styles inlined.

export function Sec({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="legal-sec">
      <h2>
        <span className="legal-num">{n}</span> {title}
      </h2>
      {children}
    </section>
  );
}

export default function LegalShell({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="page-stage page-light">
      <style>{LEGAL_CSS}</style>
      <div className="legal">
        <a className="legal-back" href="/">&larr; Back to the seminar</a>
        <span className="eyebrow">Legal</span>
        <h1 className="legal-h1">{title}</h1>
        <p className="legal-lede">{intro}</p>
        <p className="legal-updated">Last updated &middot; {updated}</p>
        <div className="legal-body">{children}</div>
        <div className="colophon">
          <p className="colophon-legal">
            <a href="/privacy">Privacy</a> &middot; <a href="/terms">Terms</a> &middot;{" "}
            <a href="/refund">Refund</a> &middot; &copy; 2026 CLAT Possible
          </p>
        </div>
      </div>
    </div>
  );
}

const LEGAL_CSS = `
.legal{max-width:760px;margin:0 auto;padding:clamp(40px,6vw,84px) 22px clamp(48px,7vw,80px)}
.legal-back{display:inline-block;margin-bottom:22px;font-family:var(--f-mono);font-size:12px;letter-spacing:.04em;color:var(--gold-deep);text-decoration:none}
.legal-back:hover{color:var(--gold-lite)}
.legal-h1{font-family:var(--f-display);font-weight:600;font-size:clamp(30px,4.4vw,46px);line-height:1.08;letter-spacing:-.02em;margin:10px 0 0;color:var(--ink)}
.legal-lede{margin:14px 0 0;font-size:clamp(16px,1.6vw,18px);line-height:1.6;color:#46566B;max-width:62ch}
.legal-updated{margin:16px 0 0;font-family:var(--f-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#8e96aa}
.legal-body{margin-top:clamp(28px,3.4vw,40px)}
.legal-sec{margin:0 0 clamp(22px,2.6vw,30px)}
.legal-sec h2{display:flex;gap:10px;align-items:baseline;font-family:var(--f-display);font-weight:600;font-size:clamp(18px,2.1vw,22px);line-height:1.2;letter-spacing:-.01em;color:var(--ink);margin:0 0 10px}
.legal-num{font-family:var(--f-mono);font-size:13px;font-weight:500;color:var(--gold-deep);flex:none}
.legal-sec p,.legal-sec li{font-size:clamp(15px,1.45vw,16.5px);line-height:1.66;color:#2b3346}
.legal-sec p{margin:0 0 .9em}
.legal-sec ul{margin:0 0 .9em;padding-left:20px}
.legal-sec li{margin:0 0 .45em}
.legal-sec strong{color:var(--ink);font-weight:600}
.legal-sec a{color:var(--gold-deep);text-decoration:none}
.legal-sec a:hover{color:var(--gold-lite)}
`;
