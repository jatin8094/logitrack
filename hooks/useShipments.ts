"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { SHIPMENTS_COLLECTION } from "@/lib/firestore-helpers";
import type { Shipment } from "@/lib/types";

interface UseShipmentsResult {
  shipments: Shipment[];
  loading: boolean;
  error: string | null;
}

/**
 * Subscribes to the shipments collection in real time.
 * The listener is created once per mount and torn down on unmount, so
 * navigating away never leaves a dangling subscription or triggers a
 * setState-after-unmount warning.
 */
export function useShipments(): UseShipmentsResult {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setError(
        "Firebase isn't configured. Add your project keys to .env.local and restart the dev server."
      );
      setLoading(false);
      return;
    }

    const shipmentsQuery = query(
      collection(db, SHIPMENTS_COLLECTION),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      shipmentsQuery,
      (snapshot) => {
        const next: Shipment[] = snapshot.docs.map((docSnap) => {
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
        });
        setShipments(next);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Shipments listener failed", err);
        setError("Couldn't reach Firestore. Check your connection and try again.");
        setLoading(false);
      }
    );

    // Critical: tear down the snapshot listener on unmount so it doesn't
    // keep firing (and leaking) after the dashboard is closed.
    return () => unsubscribe();
  }, []);

  return { shipments, loading, error };
}

/** Derives the filtered + searched view of shipments. Memoized so it only
 *  recomputes when the inputs actually change, not on every render. */
export function useFilteredShipments(
  shipments: Shipment[],
  statusFilter: string,
  searchTerm: string
): Shipment[] {
  return useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return shipments.filter((shipment) => {
      const matchesStatus = statusFilter === "All" || shipment.status === statusFilter;
      const matchesSearch = term === "" || shipment.trackingId.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [shipments, statusFilter, searchTerm]);
}
