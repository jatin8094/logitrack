"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authcontext";
import { useShipments } from "@/hooks/useShipments";
import { AuthGate } from "@/components/authgate";
import { RouteCard } from "@/components/RouteCard";
import type { ShipmentStatus } from "@/lib/types";

const FILTERS: { label: string; value: "active" | "all" }[] = [
  { label: "Active", value: "active" },
  { label: "All", value: "all" },
];

const ACTIVE_STATUSES: ShipmentStatus[] = ["Pending", "In Transit", "Delayed"];

export default function RouteBoardPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const { shipments, loading } = useShipments();
  const [filter, setFilter] = useState<"active" | "all">("active");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) return <AuthGate />;

  const visible = filter === "active" ? shipments.filter((s) => ACTIVE_STATUSES.includes(s.status)) : shipments;

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between border-b border-base-line pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal animate-pulse-dot" aria-hidden="true" />
            <h1 className="font-mono text-lg font-semibold text-ink">LogiTrack</h1>
          </div>
          <p className="mt-0.5 text-sm text-ink-muted">Route board</p>
        </div>
        <Link
          href="/"
          className="rounded-md border border-base-line px-3 py-2 text-sm font-medium text-ink-muted hover:bg-base-card hover:text-ink transition-colors"
        >
          Back to dashboard
        </Link>
      </header>

      <div className="flex gap-1.5" role="group" aria-label="Filter route board">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f.value ? "bg-signal text-base" : "bg-base-card text-ink-muted hover:bg-base-line hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-base-line" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="rounded-lg border border-base-line bg-base-raised px-6 py-16 text-center text-sm text-ink-muted">
          {filter === "active" ? "No shipments currently on a route." : "No shipments yet."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((s) => (
            <RouteCard key={s.id} shipment={s} />
          ))}
        </div>
      )}
    </div>
  );
}