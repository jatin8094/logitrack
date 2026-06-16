"use client";

import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { ACTIVITY_COLLECTION } from "@/lib/firestore-helpers";
import type { ActivityLogEntry } from "@/lib/types";

const MAX_ENTRIES = 25;

export function useActivityLog(): { entries: ActivityLogEntry[]; loading: boolean } {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const activityQuery = query(
      collection(db, ACTIVITY_COLLECTION),
      orderBy("timestamp", "desc"),
      limit(MAX_ENTRIES)
    );

    const unsubscribe = onSnapshot(
      activityQuery,
      (snapshot) => {
        const next: ActivityLogEntry[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            message: data.message ?? "",
            shipmentId: data.shipmentId ?? "",
            trackingId: data.trackingId ?? "",
            status: data.status ?? "Pending",
            timestamp: data.timestamp?.toMillis?.() ?? Date.now(),
          };
        });
        setEntries(next);
        setLoading(false);
      },
      (err) => {
        console.error("Activity log listener failed", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { entries, loading };
}
