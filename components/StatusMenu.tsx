"use client";

import { useState } from "react";
import { SHIPMENT_STATUSES, type ShipmentStatus } from "@/lib/types";
import { isTransitionAllowed, isTerminalStatus } from "@/lib/domain/shipment-status";
import { StatusBadge } from "./StatusBadge";

interface StatusMenuProps {
  current: ShipmentStatus;
  onChange: (status: ShipmentStatus) => void;
  disabled?: boolean;
}

export function StatusMenu({ current, onChange, disabled }: StatusMenuProps) {
  const [open, setOpen] = useState(false);
  const terminal = isTerminalStatus(current);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled || terminal}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={terminal ? `${current} is a final status — it can't be changed.` : undefined}
        className="group flex items-center gap-1 rounded-full transition-opacity disabled:opacity-50"
      >
        <StatusBadge status={current} />
        {!terminal && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            className="text-ink-faint transition-transform group-hover:text-ink-muted"
            style={{ transform: open ? "rotate(180deg)" : undefined }}
            aria-hidden="true"
          >
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <>
          {/* Click-away catcher */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
          <ul
            role="listbox"
            className="absolute right-0 z-20 mt-1.5 w-44 overflow-hidden rounded-md border border-base-line bg-base-card shadow-lg shadow-black/40"
          >
            {SHIPMENT_STATUSES.map((status) => {
              const allowed = status === current || isTransitionAllowed(current, status);
              return (
                <li key={status}>
                  <button
                    role="option"
                    aria-selected={status === current}
                    aria-disabled={!allowed}
                    disabled={!allowed}
                    onClick={() => {
                      if (!allowed) return;
                      onChange(status);
                      setOpen(false);
                    }}
                    title={!allowed ? `Can't move directly from ${current} to ${status}.` : undefined}
                    className={`flex w-full items-center px-3 py-2 text-left text-xs font-mono transition-colors ${
                      status === current
                        ? "text-signal"
                        : allowed
                          ? "text-ink-muted hover:bg-base-line"
                          : "cursor-not-allowed text-ink-faint/50"
                    }`}
                  >
                    {status}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}