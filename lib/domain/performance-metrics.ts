import type { Shipment } from "@/lib/types";



export interface PerformanceMetrics {
  totalShipments: number;
  delivered: number;
  inTransit: number;
  delayed: number;
  pending: number;
  onTimeRate: number | null;
  avgDeliveryDays: number | null;
  deliveriesByDay: { date: string; count: number }[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function computePerformanceMetrics(shipments: Shipment[], windowDays = 14): PerformanceMetrics {
  const delivered = shipments.filter((s) => s.status === "Delivered");
  const inTransit = shipments.filter((s) => s.status === "In Transit");
  const delayed = shipments.filter((s) => s.status === "Delayed");
  const pending = shipments.filter((s) => s.status === "Pending");

  let onTimeCount = 0;
  let onTimeEligible = 0;
  let totalDeliveryDays = 0;
  let deliveryDaysCount = 0;

  for (const s of delivered) {
    if (s.estimatedDelivery) {
      const estimatedMs = new Date(s.estimatedDelivery).getTime();
      if (!Number.isNaN(estimatedMs) && s.updatedAt) {
        onTimeEligible += 1;
        if (s.updatedAt <= estimatedMs + DAY_MS) onTimeCount += 1;
      }
    }
    if (s.createdAt && s.updatedAt && s.updatedAt > s.createdAt) {
      totalDeliveryDays += (s.updatedAt - s.createdAt) / DAY_MS;
      deliveryDaysCount += 1;
    }
  }

  const todayStart = startOfDay(Date.now());
  const buckets = new Map<string, number>();
  for (let i = windowDays - 1; i >= 0; i--) {
    const dayMs = todayStart - i * DAY_MS;
    buckets.set(new Date(dayMs).toISOString().slice(0, 10), 0);
  }
  for (const s of delivered) {
    if (!s.updatedAt) continue;
    const key = new Date(startOfDay(s.updatedAt)).toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return {
    totalShipments: shipments.length,
    delivered: delivered.length,
    inTransit: inTransit.length,
    delayed: delayed.length,
    pending: pending.length,
    onTimeRate: onTimeEligible > 0 ? Math.round((onTimeCount / onTimeEligible) * 100) : null,
    avgDeliveryDays: deliveryDaysCount > 0 ? Math.round((totalDeliveryDays / deliveryDaysCount) * 10) / 10 : null,
    deliveriesByDay: Array.from(buckets.entries()).map(([date, count]) => ({ date, count })),
  };
}