"use client";

import { useEffect } from "react";
import { useNotifications } from "@/lib/notification-context";

export function NotificationToast() {
  const { latestToast, dismissToast } = useNotifications();

  useEffect(() => {
    if (!latestToast) return;
    const timer = setTimeout(dismissToast, 5000);
    return () => clearTimeout(timer);
  }, [latestToast, dismissToast]);

  if (!latestToast) return null;

  return (
    <div
      role="status"
      className="animate-ticker-in fixed bottom-5 right-5 z-40 w-80 rounded-lg border border-base-line bg-base-card p-4 shadow-xl shadow-black/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-signal" aria-hidden="true">
            <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
            Customer email sent (simulated)
          </span>
        </div>
        <button
          onClick={dismissToast}
          aria-label="Dismiss"
          className="text-ink-faint hover:text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <p className="mt-2 text-sm font-medium text-ink">{latestToast.subject}</p>
      <p className="mt-0.5 text-xs text-ink-muted">{latestToast.body}</p>
      <p className="mt-2 font-mono text-[11px] text-ink-faint">to {latestToast.recipient}</p>
    </div>
  );
}