import type { Shipment, ShipmentStatus } from "@/lib/types";
import { formatDate, relativeTime } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

const STAGE_ORDER: ShipmentStatus[] = ["Pending", "In Transit", "Delivered"];

function stageIndex(status: ShipmentStatus): number {
  if (status === "Delayed") return 1; 
  return STAGE_ORDER.indexOf(status);
}

export function RouteCard({ shipment }: { shipment: Shipment }) {
  const idx = stageIndex(shipment.status);
  const isDelayed = shipment.status === "Delayed";
  const progressPct = isDelayed ? 50 : (idx / (STAGE_ORDER.length - 1)) * 100;

  return (
    <div className="rounded-lg border border-base-line bg-base-raised p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-ink">{shipment.trackingId}</span>
          <span className="text-xs text-ink-faint">{shipment.senderName} → {shipment.receiverAddress}</span>
        </div>
        <StatusBadge status={shipment.status} />
      </div>

      <div className="relative mt-5 mb-1.5 h-1.5 rounded-full bg-base-line">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${
            isDelayed ? "bg-status-delayed" : "bg-signal"
          }`}
          style={{ width: `${progressPct}%` }}
        />
        {/* Moving marker */}
        <div
          className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-base-raised transition-all duration-700 ${
            isDelayed ? "bg-status-delayed" : "bg-signal"
          } ${shipment.status === "In Transit" ? "animate-pulse-dot" : ""}`}
          style={{ left: `calc(${progressPct}% - 6px)` }}
          aria-hidden="true"
        />
      </div>

      <div className="flex justify-between text-[11px] font-mono text-ink-faint">
        <span className={idx >= 0 ? "text-ink-muted" : ""}>Pending</span>
        <span className={idx >= 1 || isDelayed ? (isDelayed ? "text-status-delayed" : "text-ink-muted") : ""}>
          {isDelayed ? "Delayed" : "In transit"}
        </span>
        <span className={idx >= 2 ? "text-ink-muted" : ""}>Delivered</span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-base-line pt-2.5 text-xs text-ink-faint">
        <span>Est. delivery {formatDate(shipment.estimatedDelivery)}</span>
        <span>Updated {relativeTime(shipment.updatedAt)}</span>
      </div>
    </div>
  );
}