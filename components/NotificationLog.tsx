"use client";

import { useNotifications } from "@/lib/notification-context";
import { relativeTime } from "@/lib/format";
import { STATUS_DOT_CLASS } from "./StatusBadge";

export function NotificationLog({ onClose }: { onClose: () => void }) {
  const { notifications } = useNotifications();

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/50 animate-backdrop-in" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-sm flex-col border-l border-base-line bg-base-raised"
      >
        <div className="flex items-center justify-between border-b border-base-line px-4 py-3.5">
          <h2 className="text-sm font-medium text-ink">Customer notifications</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-ink-faint hover:bg-base-card hover:text-ink">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="border-b border-base-line px-4 py-2.5 text-xs text-ink-faint">
          Simulated — no real emails are sent. Shows what a customer would receive when a shipment's status changes.
        </p>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-ink-muted">
              Change a shipment's status to see a simulated notification here.
            </p>
          ) : (
            <ul className="flex flex-col">
              {notifications.map((n) => (
                <li key={n.id} className="border-b border-base-line px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_CLASS[n.status]}`} aria-hidden="true" />
                    <span className="font-mono text-xs text-ink-faint">{n.trackingId}</span>
                    <span className="ml-auto font-mono text-xs text-ink-faint">{relativeTime(n.timestamp)}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-ink">{n.subject}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{n.body}</p>
                  <p className="mt-1.5 font-mono text-[11px] text-ink-faint">to {n.recipient}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}