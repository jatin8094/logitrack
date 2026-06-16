"use client";

import type { ActivityLogEntry } from "@/lib/types";
import { relativeTime } from "@/lib/format";
import { STATUS_DOT_CLASS } from "./StatusBadge";

export function ActivityFeed({ entries, loading }: { entries: ActivityLogEntry[]; loading: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-base-line px-4 py-3">
        <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-dot" aria-hidden="true" />
        <h2 className="text-xs font-medium uppercase tracking-wide text-ink-muted">Activity log</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3.5 w-full animate-pulse rounded bg-base-line" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-ink-muted">
            Updates will appear here the moment a shipment changes.
          </p>
        ) : (
          <ul className="flex flex-col">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="animate-ticker-in flex gap-2.5 border-b border-base-line px-4 py-3 text-sm"
              >
                <span
                  className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${STATUS_DOT_CLASS[entry.status]}`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-ink-muted">{entry.message}</p>
                  <p className="mt-0.5 font-mono text-xs text-ink-faint">{relativeTime(entry.timestamp)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
