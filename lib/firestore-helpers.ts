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
import { db } from "./firebase";
import type { NewShipment, Shipment, ShipmentStatus } from "./types";

const SHIPMENTS_COLLECTION = "shipments";
const ACTIVITY_COLLECTION = "activityLog";

/** Generates a human-readable tracking id, e.g. "LT-48213". */
function generateTrackingId(): string {
  const random = Math.floor(10000 + Math.random() * 89999);
  return `LT-${random}`;
}

/** Writes a single entry to the activity feed. Failures are logged but never block the caller. */
async function logActivity(entry: {
  shipmentId: string;
  trackingId: string;
  status: ShipmentStatus;
  message: string;
}) {
  if (!db) return;
  try {
    await addDoc(collection(db, ACTIVITY_COLLECTION), {
      ...entry,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    // Activity logging is a nice-to-have. A dispatcher should never lose a
    // status update just because the log write failed.
    console.error("Failed to write activity log entry", err);
  }
}

export async function createShipment(input: NewShipment): Promise<void> {
  if (!db) throw new Error("Firestore is not configured.");

  const trackingId = generateTrackingId();

  const docRef = await addDoc(collection(db, SHIPMENTS_COLLECTION), {
    ...input,
    trackingId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await logActivity({
    shipmentId: docRef.id,
    trackingId,
    status: input.status,
    message: `Shipment ${trackingId} created and marked '${input.status}'`,
  });
}

export async function updateShipmentStatus(
  shipmentId: string,
  trackingId: string,
  status: ShipmentStatus
): Promise<void> {
  if (!db) throw new Error("Firestore is not configured.");

  const ref = doc(db, SHIPMENTS_COLLECTION, shipmentId);
  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
  });

  await logActivity({
    shipmentId,
    trackingId,
    status,
    message: `Shipment ${trackingId} updated to '${status}'`,
  });
}

/**
 * Public lookup used by the unauthenticated /track page. Only ever reads a
 * single shipment matched by its tracking id — never the full collection —
 * so the Firestore rule that allows this can stay narrow (see firestore.rules,
 * which permits `get`/list-by-trackingId style access without exposing
 * `list` on the whole `shipments` collection).
 */
export async function lookupShipmentByTrackingId(trackingId: string): Promise<Shipment | null> {
  if (!db) throw new Error("Firestore is not configured.");

  const trackingQuery = query(
    collection(db, SHIPMENTS_COLLECTION),
    where("trackingId", "==", trackingId),
    limit(1)
  );

  const snapshot = await getDocs(trackingQuery);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  const data = docSnap.data();

  return {
    id: docSnap.id,
    trackingId: data.trackingId ?? "—",
    senderName: data.senderName ?? "",
    receiverAddress: data.receiverAddress ?? "",
    weightKg: data.weightKg ?? 0,
    estimatedDelivery: data.estimatedDelivery ?? "",
    status: data.status ?? "Pending",
    createdAt: data.createdAt?.toMillis?.() ?? 0,
    updatedAt: data.updatedAt?.toMillis?.() ?? 0,
  };
}

export { SHIPMENTS_COLLECTION, ACTIVITY_COLLECTION };