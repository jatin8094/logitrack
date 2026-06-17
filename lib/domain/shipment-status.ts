import type { ShipmentStatus } from "@/lib/types";

const ALLOWED_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  Pending: ["In Transit", "Delayed"],
  "In Transit": ["Delivered", "Delayed"],
  Delayed: ["In Transit"],
  Delivered: [],
};

export function getAllowedNextStatuses(current: ShipmentStatus): ShipmentStatus[] {
  return ALLOWED_TRANSITIONS[current];
}

export function isTransitionAllowed(from: ShipmentStatus, to: ShipmentStatus): boolean {
  if (from === to) return false;
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function isTerminalStatus(status: ShipmentStatus): boolean {
  return ALLOWED_TRANSITIONS[status].length === 0;
}

export function explainBlockedTransition(from: ShipmentStatus, to: ShipmentStatus): string | null {
  if (from === to) return null; // no-op, not an error
  if (isTransitionAllowed(from, to)) return null;

  if (isTerminalStatus(from)) {
    return `${from} is a final status — it can't be changed.`;
  }
  return `A shipment can't go directly from ${from} to ${to}.`;
}