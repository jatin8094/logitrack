import { isTransitionAllowed, explainBlockedTransition } from "@/lib/domain/shipment-status";
import { ok, err, type Result } from "@/lib/result";
import type { ShipmentError } from "@/lib/domain/errors";
import {
  insertShipment,
  writeShipmentStatus,
  findShipmentByTrackingId,
} from "@/lib/firestore/shipments.repository";
import { insertActivityEntry } from "@/lib/firestore/activity.repository";
import type { NewShipment, Shipment, ShipmentStatus } from "@/lib/types";


export async function createShipmentAction(
  input: NewShipment
): Promise<Result<{ trackingId: string }, ShipmentError>> {
  const inserted = await insertShipment(input);
  if (!inserted.ok) return err(inserted.error);

  const { id, trackingId } = inserted.value;

  // Activity logging failure is intentionally non-fatal: the shipment was
  // created successfully, and that's the result the caller cares about.
  const logResult = await insertActivityEntry({
    shipmentId: id,
    trackingId,
    status: input.status,
    message: `Shipment ${trackingId} created and marked '${input.status}'`,
  });
  if (!logResult.ok) {
    console.error("Activity log write failed after successful shipment creation", logResult.error);
  }

  return ok({ trackingId });
}

export async function changeShipmentStatusAction(
  shipment: Shipment,
  nextStatus: ShipmentStatus
): Promise<Result<void, ShipmentError>> {
  if (shipment.status === nextStatus) return ok(undefined);

  if (!isTransitionAllowed(shipment.status, nextStatus)) {
    const reason = explainBlockedTransition(shipment.status, nextStatus) ?? "That transition isn't allowed.";
    return err({ kind: "invalid-transition", reason });
  }

  const writeResult = await writeShipmentStatus(shipment.id, nextStatus);
  if (!writeResult.ok) return err(writeResult.error);

  const logResult = await insertActivityEntry({
    shipmentId: shipment.id,
    trackingId: shipment.trackingId,
    status: nextStatus,
    message: `Shipment ${shipment.trackingId} updated to '${nextStatus}'`,
  });
  if (!logResult.ok) {
    console.error("Activity log write failed after successful status update", logResult.error);
  }

  return ok(undefined);
}

export async function trackShipmentAction(
  trackingId: string
): Promise<Result<Shipment | null, ShipmentError>> {
  return findShipmentByTrackingId(trackingId.trim().toUpperCase());
}