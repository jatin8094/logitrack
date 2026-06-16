interface EmptyStateProps {
  variant: "no-shipments" | "no-matches";
  onAction: () => void;
}

export function EmptyState({ variant, onAction }: EmptyStateProps) {
  const isFirstRun = variant === "no-shipments";

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        className="text-ink-faint"
        aria-hidden="true"
      >
        <rect x="4" y="12" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 18H36" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 12V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <p className="text-sm font-medium text-ink">
        {isFirstRun ? "No shipments on the board yet" : "Nothing matches that search"}
      </p>
      <p className="max-w-sm text-sm text-ink-muted">
        {isFirstRun
          ? "Create the first shipment to start tracking it here in real time."
          : "Try a different tracking ID or clear the status filter."}
      </p>
      <button
        onClick={onAction}
        className="mt-1 rounded-md bg-signal px-3.5 py-2 text-sm font-medium text-base hover:bg-signal/90 transition-colors"
      >
        {isFirstRun ? "Create a shipment" : "Clear filters"}
      </button>
    </div>
  );
}
