import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ok, err, type Result } from "@/lib/result";
import { toShipmentError, type ShipmentError } from "@/lib/domain/errors";
import type { NewShipment, Shipment, ShipmentStatus } from "@/lib/types";

export const SHIPMENTS_COLLECTION = "shipments";

function generateTrackingId(): string {
  const random = Math.floor(10000 + Math.random() * 89999);
  return `LT-${random}`;
}

function mapShipmentDoc(id: string, data: Record<string, unknown>): Shipment {
  return {
    id,
    trackingId: (data.trackingId as string) ?? "—",
    senderName: (data.senderName as string) ?? "",
    receiverAddress: (data.receiverAddress as string) ?? "",
    weightKg: (data.weightKg as number) ?? 0,
    estimatedDelivery: (data.estimatedDelivery as string) ?? "",
    status: (data.status as ShipmentStatus) ?? "Pending",
    createdAt: (data.createdAt as { toMillis?: () => number })?.toMillis?.() ?? 0,
    updatedAt: (data.updatedAt as { toMillis?: () => number })?.toMillis?.() ?? 0,
  };
}

export async function insertShipment(
  input: NewShipment
): Promise<Result<{ id: string; trackingId: string }, ShipmentError>> {
  if (!db) return err({ kind: "not-configured" });

  try {
    const trackingId = generateTrackingId();
    const docRef = await addDoc(collection(db, SHIPMENTS_COLLECTION), {
      ...input,
      trackingId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ok({ id: docRef.id, trackingId });
  } catch (cause) {
    return err(toShipmentError(cause));
  }
}

export async function writeShipmentStatus(
  shipmentId: string,
  status: ShipmentStatus
): Promise<Result<void, ShipmentError>> {
  if (!db) return err({ kind: "not-configured" });

  try {
    await updateDoc(doc(db, SHIPMENTS_COLLECTION, shipmentId), {
      status,
      updatedAt: serverTimestamp(),
    });
    return ok(undefined);
  } catch (cause) {
    return err(toShipmentError(cause));
  }
}

export async function findShipmentByTrackingId(
  trackingId: string
): Promise<Result<Shipment | null, ShipmentError>> {
  if (!db) return err({ kind: "not-configured" });

  try {
    const trackingQuery = query(
      collection(db, SHIPMENTS_COLLECTION),
      where("trackingId", "==", trackingId),
      limit(1)
    );
    const snapshot = await getDocs(trackingQuery);
    if (snapshot.empty) return ok(null);

    const docSnap = snapshot.docs[0];
    return ok(mapShipmentDoc(docSnap.id, docSnap.data()));
  } catch (cause) {
    return err(toShipmentError(cause));
  }
}

export { mapShipmentDoc };