"use client";

import { useState } from "react";
import type { Shipment, ShipmentStatus } from "@/lib/types";
import { formatDate, relativeTime } from "@/lib/format";
import { StatusMenu } from "./StatusMenu";

interface ShipmentTableProps {
  shipments: Shipment[];
  onStatusChange: (shipment: Shipment, status: ShipmentStatus) => void;
  pendingUpdateId: string | null;
}

/** Tracking ID with a one-click copy action — the kind of small affordance
 *  a dispatcher actually wants when relaying an ID over a call or message. */
function TrackingId({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can be unavailable (e.g. insecure context) — fail quietly.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group flex items-center gap-1.5 font-mono text-sm text-ink"
      title="Copy tracking ID"
    >
      {value}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        className="text-ink-faint opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      >
        {copied ? (
          <path d="M5 13L9 17L19 7" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <rect x="9" y="9" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" stroke="currentColor" strokeWidth="1.8" />
          </>
        )}
      </svg>
    </button>
  );
}

export function ShipmentTable({ shipments, onStatusChange, pendingUpdateId }: ShipmentTableProps) {
  return (
    <>
      {/* Desktop / tablet: dense data grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-12 gap-4 border-b border-base-line px-5 py-3 text-xs font-medium uppercase tracking-wide text-ink-faint">
          <div className="col-span-2">Tracking ID</div>
          <div className="col-span-2">Sender</div>
          <div className="col-span-2">Receiver address</div>
          <div className="col-span-1">Weight</div>
          <div className="col-span-2">Est. delivery</div>
          <div className="col-span-1">Updated</div>
          <div className="col-span-2">Status</div>
        </div>
        <div className="divide-y divide-base-line">
          {shipments.map((shipment) => (
            <div
              key={shipment.id}
              className="grid grid-cols-12 items-center gap-4 px-5 py-3.5 transition-colors hover:bg-base-card/60"
            >
              <div className="col-span-2">
                <TrackingId value={shipment.trackingId} />
              </div>
              <div className="col-span-2 truncate text-sm text-ink-muted" title={shipment.senderName}>
                {shipment.senderName}
              </div>
              <div
                className="col-span-2 truncate text-sm text-ink-muted"
                title={shipment.receiverAddress}
              >
                {shipment.receiverAddress}
              </div>
              <div className="col-span-1 font-mono text-sm text-ink-muted">{shipment.weightKg} kg</div>
              <div className="col-span-2 text-sm text-ink-muted">
                {formatDate(shipment.estimatedDelivery)}
              </div>
              <div className="col-span-1 font-mono text-xs text-ink-faint">
                {relativeTime(shipment.updatedAt)}
              </div>
              <div className="col-span-2">
                <StatusMenu
                  current={shipment.status}
                  disabled={pendingUpdateId === shipment.id}
                  onChange={(status) => onStatusChange(shipment, status)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: stacked cards, same data, no horizontal scrolling */}
      <div className="divide-y divide-base-line md:hidden">
        {shipments.map((shipment) => (
          <div key={shipment.id} className="flex flex-col gap-2 px-4 py-4">
            <div className="flex items-center justify-between">
              <TrackingId value={shipment.trackingId} />
              <StatusMenu
                current={shipment.status}
                disabled={pendingUpdateId === shipment.id}
                onChange={(status) => onStatusChange(shipment, status)}
              />
            </div>
            <div className="text-sm text-ink-muted">{shipment.senderName}</div>
            <div className="text-sm text-ink-muted">{shipment.receiverAddress}</div>
            <div className="flex items-center justify-between text-xs font-mono text-ink-faint">
              <span>{shipment.weightKg} kg · Due {formatDate(shipment.estimatedDelivery)}</span>
              <span>{relativeTime(shipment.updatedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
