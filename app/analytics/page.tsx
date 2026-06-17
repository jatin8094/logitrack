"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authcontext";
import { useShipments } from "@/hooks/useShipments";
import { computePerformanceMetrics } from "@/lib/domain/performance-metrics";
import { AuthGate } from "@/components/authgate";
import { MetricCard } from "@/components/MetricCard";
import { DeliveryTrendChart } from "@/components/DeliveryTrendChart";

export default function AnalyticsPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const { shipments, loading } = useShipments();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) return <AuthGate />;

  const metrics = computePerformanceMetrics(shipments);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between border-b border-base-line pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal animate-pulse-dot" aria-hidden="true" />
            <h1 className="font-mono text-lg font-semibold text-ink">LogiTrack</h1>
          </div>
          <p className="mt-0.5 text-sm text-ink-muted">Delivery performance</p>
        </div>
        <Link
          href="/"
          className="rounded-md border border-base-line px-3 py-2 text-sm font-medium text-ink-muted hover:bg-base-card hover:text-ink transition-colors"
        >
          Back to dashboard
        </Link>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-base-line" />
          ))}
        </div>
      ) : metrics.totalShipments === 0 ? (
        <p className="rounded-lg border border-base-line bg-base-raised px-6 py-16 text-center text-sm text-ink-muted">
          No shipments yet — metrics will appear once you have data to measure.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard label="On-time rate" value={metrics.onTimeRate !== null ? `${metrics.onTimeRate}%` : "—"} hint="vs. estimated delivery" />
            <MetricCard label="Avg. transit time" value={metrics.avgDeliveryDays !== null ? `${metrics.avgDeliveryDays}d` : "—"} hint="created to delivered" />
            <MetricCard label="Delivered" value={String(metrics.delivered)} hint={`of ${metrics.totalShipments} total`} />
            <MetricCard label="Currently delayed" value={String(metrics.delayed)} hint="needs attention" />
          </div>

          <section className="rounded-lg border border-base-line bg-base-raised p-5">
            <h2 className="mb-4 text-sm font-medium text-ink">Deliveries completed, last 14 days</h2>
            <DeliveryTrendChart data={metrics.deliveriesByDay} />
          </section>
        </>
      )}
    </div>
  );
}