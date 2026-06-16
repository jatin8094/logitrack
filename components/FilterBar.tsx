"use client";

import { SHIPMENT_STATUSES } from "@/lib/types";

interface FilterBarProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const FILTERS = ["All", ...SHIPMENT_STATUSES];

export function FilterBar({
  statusFilter,
  onStatusChange,
  searchTerm,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="Filter shipments by status"
      >
        {FILTERS.map((filter) => {
          const isActive = filter === statusFilter;
          return (
            <button
              key={filter}
              onClick={() => onStatusChange(filter)}
              aria-pressed={isActive}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-signal text-base"
                  : "bg-base-card text-ink-muted hover:bg-base-line hover:text-ink"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="relative w-full sm:w-64">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tracking ID…"
          aria-label="Search by tracking ID"
          className="w-full rounded-md border border-base-line bg-base-card py-1.5 pl-8 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-signal focus:outline-none"
        />
      </div>
    </div>
  );
}
