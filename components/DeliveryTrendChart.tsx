"use client";

interface DeliveryTrendChartProps {
  data: { date: string; count: number }[];
}

export function DeliveryTrendChart({ data }: DeliveryTrendChartProps) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="flex h-32 items-end gap-1" role="img" aria-label="Deliveries completed per day over the last two weeks">
      {data.map((d) => {
        const heightPct = (d.count / max) * 100;
        const day = new Date(d.date).getDate();
        return (
          <div key={d.date} className="group relative flex flex-1 flex-col items-center gap-1.5">
            <div
              className="w-full rounded-sm bg-signal/70 transition-colors group-hover:bg-signal"
              style={{ height: `${Math.max(heightPct, d.count > 0 ? 6 : 2)}%`, minHeight: d.count > 0 ? "4px" : "2px" }}
            />
            <span className="text-[10px] font-mono text-ink-faint">{day}</span>
            <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-base-card px-1.5 py-0.5 text-[10px] font-mono text-ink opacity-0 shadow-md transition-opacity group-hover:opacity-100">
              {d.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}