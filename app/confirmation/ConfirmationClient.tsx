"use client";

import { useEffect, useRef, useState } from "react";
import { reapplyMamFromCookie } from "@/lib/analytics";

/* Confirmation-page client behaviour.

   1) Backup safety net: re-apply hashed Meta Advanced Matching from the cp_mam
      cookie so this PageView ships with full identity even if the inline pixel
      script raced the navigation. fbq init is idempotent.

   2) "Join the WhatsApp group" is the one required step — without it the lead
      never receives venue/timing/reminders. So we guard the in-app ways of
      leaving before it's done with a CUSTOM "have you joined?" modal:
        - back button (history is trapped so the first "back" pops to us)
        - in-page navigation (internal links).
      Clicking any [data-wa-join] link, or confirming "yes I've joined", marks
      the step done (sessionStorage, so each new visit re-arms the guard) and
      silences the guard. */

const JOINED_KEY = "cp_wa_joined";

function hasJoined(): boolean {
  try {
    return sessionStorage.getItem(JOINED_KEY) === "1";
  } catch {
    return false;
  }
}

function setJoined(): void {
  try {
    sessionStorage.setItem(JOINED_KEY, "1");
  } catch {
    /* ignore storage failures (private mode etc.) */
  }
}

type Pending = { type: "href"; url: string } | { type: "back" } | null;

export default function ConfirmationClient({ whatsappUrl }: { whatsappUrl: string }) {
  const [guardOpen, setGuardOpen] = useState(false);
  const pending = useRef<Pending>(null); // what to do if they confirm they've joined

  useEffect(() => {
    reapplyMamFromCookie();

    const markJoined = () => {
      setJoined();
      setGuardOpen(false);
    };

    // Click delegation (capture phase so we run before the link navigates):
    //  - any [data-wa-join] => they're joining, mark done.
    //  - an internal same-tab link => intercept and ask first.
    const onDocClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest("[data-wa-join]")) {
        markJoined();
        return;
      }
      if (hasJoined()) return;
      const a = el.closest("a") as HTMLAnchorElement | null;
      if (!a || a.hasAttribute("data-jg-ignore")) return;
      const href = a.getAttribute("href") || "";
      if (!href || href.startsWith("#") || a.getAttribute("target") === "_blank") return;
      const isInternal = href.startsWith("/") || href.startsWith(window.location.origin);
      if (!isInternal) return;
      e.preventDefault();
      pending.current = { type: "href", url: href };
      setGuardOpen(true);
    };
    document.addEventListener("click", onDocClick, true);

    // Trap the back button: push one guard entry so the first "back" pops to us
    // instead of leaving. On pop we re-push and ask.
    if (!hasJoined()) {
      try {
        window.history.pushState({ cpGuard: true }, "");
      } catch {
        /* ignore */
      }
    }
    const onPopState = () => {
      if (hasJoined()) return;
      try {
        window.history.pushState({ cpGuard: true }, "");
      } catch {
        /* ignore */
      }
      pending.current = { type: "back" };
      setGuardOpen(true);
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onDocClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  // "Yes, I've already joined" — stop guarding and carry out what they attempted.
  const confirmLeave = () => {
    setJoined();
    const action = pending.current;
    pending.current = null;
    setGuardOpen(false);
    if (action?.type === "href") {
      window.location.href = action.url;
    } else if (action?.type === "back") {
      // skip both our guard entry and this page to reach the real previous page
      window.history.go(-2);
    }
  };

  return (
    <>
      {guardOpen && (
        <div className="jg" role="dialog" aria-modal="true" aria-label="Join the WhatsApp group before leaving">
          <div className="jg-panel">
            <span className="jg-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2z" /></svg>
            </span>
            <p className="jg-t">Wait &mdash; have you joined the WhatsApp group?</p>
            <p className="jg-d">All venue details, timing and reminders for the <b>5th July</b> seminar are shared <b>only on WhatsApp</b>. If you leave without joining, you will miss them.</p>
            <div className="jg-acts">
              <a className="jg-join" href={whatsappUrl} target="_blank" rel="noopener" data-wa-join data-jg-ignore>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2z" /></svg> No &mdash; let me join now
              </a>
              <button type="button" className="jg-leave" data-jg-ignore onClick={confirmLeave}>Yes, I&rsquo;ve already joined &mdash; leave</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
