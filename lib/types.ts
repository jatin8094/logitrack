/**
 * Shared domain types for LogiTrack.
 * Kept in one place so Firestore converters, hooks, and components
 * all agree on the same shape.
 */

export type ShipmentStatus = "Pending" | "In Transit" | "Delivered" | "Delayed";

export const SHIPMENT_STATUSES: ShipmentStatus[] = [
  "Pending",
  "In Transit",
  "Delivered",
  "Delayed",
];

export interface Shipment {
  id: string;
  trackingId: string;
  senderName: string;
  receiverAddress: string;
  weightKg: number;
  estimatedDelivery: string; // ISO date string (yyyy-mm-dd)
  status: ShipmentStatus;
  createdAt: number; // epoch ms, set client-side via serverTimestamp on write
  updatedAt: number;
}

/** Shape used when creating a shipment, before Firestore assigns an id. */
export type NewShipment = Omit<Shipment, "id" | "createdAt" | "updatedAt" | "trackingId">;

export interface ActivityLogEntry {
  id: string;
  message: string;
  shipmentId: string;
  trackingId: string;
  status: ShipmentStatus;
  timestamp: number; // epoch ms
}
