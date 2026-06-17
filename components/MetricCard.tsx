interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-base-line bg-base-raised px-4 py-3.5">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      <span className="font-mono text-2xl font-semibold text-ink">{value}</span>
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </div>
  );
}