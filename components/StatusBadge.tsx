import type { ShipmentStatus } from "@/lib/types";

const STYLES: Record<ShipmentStatus, { dot: string; text: string; bg: string }> = {
  Pending: { dot: "bg-status-pending", text: "text-status-pending", bg: "bg-status-pendingDim" },
  "In Transit": { dot: "bg-status-transit", text: "text-status-transit", bg: "bg-status-transitDim" },
  Delivered: { dot: "bg-status-delivered", text: "text-status-delivered", bg: "bg-status-deliveredDim" },
  Delayed: { dot: "bg-status-delayed", text: "text-status-delayed", bg: "bg-status-delayedDim" },
};

/** Just the dot color per status — reused by the activity feed and stat tiles
 *  so every part of the UI agrees on the same status → color mapping. */
export const STATUS_DOT_CLASS: Record<ShipmentStatus, string> = Object.fromEntries(
  Object.entries(STYLES).map(([status, style]) => [status, style.dot])
) as Record<ShipmentStatus, string>;

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  const style = STYLES[status];
  const isLive = status === "In Transit";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-mono tracking-wide ${style.bg} ${style.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot} ${isLive ? "animate-pulse-dot" : ""}`}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}
