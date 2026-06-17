import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ok, err, type Result } from "@/lib/result";
import { toShipmentError, type ShipmentError } from "@/lib/domain/errors";
import type { ShipmentStatus } from "@/lib/types";

export const ACTIVITY_COLLECTION = "activityLog";

interface ActivityInput {
  shipmentId: string;
  trackingId: string;
  status: ShipmentStatus;
  message: string;
}

export async function insertActivityEntry(entry: ActivityInput): Promise<Result<void, ShipmentError>> {
  if (!db) return err({ kind: "not-configured" });

  try {
    await addDoc(collection(db, ACTIVITY_COLLECTION), {
      ...entry,
      timestamp: serverTimestamp(),
    });
    return ok(undefined);
  } catch (cause) {
    return err(toShipmentError(cause));
  }
}