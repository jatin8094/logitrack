import type { Shipment, ShipmentStatus } from "@/lib/types";

export interface SimulatedNotification {
  id: string;
  channel: "email" | "sms";
  recipient: string;
  subject?: string;
  body: string;
  trackingId: string;
  status: ShipmentStatus;
  timestamp: number;
}

const STATUS_COPY: Record<ShipmentStatus, { subject: string; body: (s: Shipment) => string }> = {
  Pending: {
    subject: "We've received your shipment",
    body: (s) => `Your shipment ${s.trackingId} has been registered and is awaiting pickup.`,
  },
  "In Transit": {
    subject: "Your shipment is on its way",
    body: (s) => `Shipment ${s.trackingId} is now in transit, estimated delivery ${s.estimatedDelivery}.`,
  },
  Delivered: {
    subject: "Delivered",
    body: (s) => `Shipment ${s.trackingId} was delivered to ${s.receiverAddress}.`,
  },
  Delayed: {
    subject: "A delay on your shipment",
    body: (s) => `Shipment ${s.trackingId} is delayed. We'll update the estimated delivery date shortly.`,
  },
};

export function buildNotificationForStatusChange(shipment: Shipment): SimulatedNotification {
  const copy = STATUS_COPY[shipment.status];
  return {
    id: `${shipment.id}-${shipment.status}-${Date.now()}`,
    channel: "email",
    recipient: deriveRecipientEmail(shipment),
    subject: copy.subject,
    body: copy.body(shipment),
    trackingId: shipment.trackingId,
    status: shipment.status,
    timestamp: Date.now(),
  };
}

function deriveRecipientEmail(shipment: Shipment): string {
  const handle = shipment.senderName.trim().toLowerCase().replace(/\s+/g, ".") || "customer";
  return `${handle}@example.com`;
}