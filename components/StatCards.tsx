"use client";

import { SHIPMENT_STATUSES, type Shipment } from "@/lib/types";
import { STATUS_DOT_CLASS } from "./StatusBadge";

interface StatCardsProps {
  shipments: Shipment[];
  activeFilter: string;
  onSelect: (status: string) => void;
}

export function StatCards({ shipments, activeFilter, onSelect }: StatCardsProps) {
  const counts = SHIPMENT_STATUSES.map((status) => ({
    status,
    count: shipments.filter((s) => s.status === status).length,
  }));

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {counts.map(({ status, count }) => {
        const isActive = activeFilter === status;
        return (
          <button
            key={status}
            onClick={() => onSelect(isActive ? "All" : status)}
            aria-pressed={isActive}
            className={`flex flex-col items-start gap-1.5 rounded-lg border px-4 py-3 text-left transition-colors ${
              isActive
                ? "border-signal bg-base-card"
                : "border-base-line bg-base-raised hover:border-base-line hover:bg-base-card/60"
            }`}
          >
            <span className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_CLASS[status]}`} aria-hidden="true" />
              {status}
            </span>
            <span className="font-mono text-2xl font-semibold text-ink">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
