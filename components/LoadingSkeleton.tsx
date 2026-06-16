export function LoadingSkeleton() {
  return (
    <div className="divide-y divide-base-line" role="status" aria-label="Loading shipments">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="grid grid-cols-12 items-center gap-4 px-5 py-4">
          <div className="col-span-2 h-3.5 w-20 animate-pulse rounded bg-base-line" />
          <div className="col-span-3 h-3.5 w-32 animate-pulse rounded bg-base-line" />
          <div className="col-span-3 h-3.5 w-40 animate-pulse rounded bg-base-line" />
          <div className="col-span-1 h-3.5 w-10 animate-pulse rounded bg-base-line" />
          <div className="col-span-2 h-3.5 w-24 animate-pulse rounded bg-base-line" />
          <div className="col-span-1 h-6 w-20 animate-pulse rounded-full bg-base-line" />
        </div>
      ))}
    </div>
  );
}
