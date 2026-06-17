"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { trackShipmentAction } from "@/lib/server/shipment-actions";
import { describeShipmentError } from "@/lib/domain/errors";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import type { Shipment } from "@/lib/types";

type LookupState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "found"; shipment: Shipment }
  | { phase: "not-found" }
  | { phase: "error"; message: string };

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [state, setState] = useState<LookupState>({ phase: "idle" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = trackingId.trim();
    if (!id) return;

    setState({ phase: "loading" });
    const result = await trackShipmentAction(id);

    if (!result.ok) {
      console.error("Tracking lookup failed", result.error);
      setState({ phase: "error", message: describeShipmentError(result.error) });
      return;
    }

    setState(result.value ? { phase: "found", shipment: result.value } : { phase: "not-found" });
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-signal animate-pulse-dot" aria-hidden="true" />
          <h1 className="font-mono text-lg font-semibold text-ink">LogiTrack</h1>
        </div>

        <div className="rounded-lg border border-base-line bg-base-raised p-6">
          <h2 className="mb-1 text-base font-semibold text-ink">Track your shipment</h2>
          <p className="mb-5 text-sm text-ink-muted">Enter the tracking ID from your shipping confirmation.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. LT-48213"
              aria-label="Tracking ID"
              className="w-full rounded-md border border-base-line bg-base-card px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-signal focus:outline-none"
            />
            <button
              type="submit"
              disabled={state.phase === "loading" || !trackingId.trim()}
              className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-base hover:bg-signal/90 disabled:cursor-not-allowed disabled:opacity-50 transition-colors sm:flex-shrink-0"
            >
              {state.phase === "loading" ? "Searching…" : "Track"}
            </button>
          </form>

          {state.phase === "not-found" && (
            <p className="mt-4 rounded-md border border-status-delayed/40 bg-status-delayedDim px-3 py-2 text-xs text-status-delayed">
              No shipment found for that tracking ID. Double-check it and try again.
            </p>
          )}

          {state.phase === "error" && (
            <p className="mt-4 rounded-md border border-status-delayed/40 bg-status-delayedDim px-3 py-2 text-xs text-status-delayed">
              {state.message}
            </p>
          )}

          {state.phase === "found" && (
            <div className="mt-5 flex flex-col gap-3 border-t border-base-line pt-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-ink">{state.shipment.trackingId}</span>
                <StatusBadge status={state.shipment.status} />
              </div>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-ink-faint">Receiver</dt>
                <dd className="text-right text-ink-muted">{state.shipment.receiverAddress}</dd>
                <dt className="text-ink-faint">Est. delivery</dt>
                <dd className="text-right text-ink-muted">{formatDate(state.shipment.estimatedDelivery)}</dd>
                <dt className="text-ink-faint">Weight</dt>
                <dd className="text-right text-ink-muted">{state.shipment.weightKg} kg</dd>
              </dl>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-ink-faint">
          Dispatcher?{" "}
          <Link href="/login" className="text-signal hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}