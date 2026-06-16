"use client";

import { useState } from "react";
import { SHIPMENT_STATUSES, type ShipmentStatus } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface StatusMenuProps {
  current: ShipmentStatus;
  onChange: (status: ShipmentStatus) => void;
  disabled?: boolean;
}

export function StatusMenu({ current, onChange, disabled }: StatusMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="group flex items-center gap-1 rounded-full transition-opacity disabled:opacity-50"
      >
        <StatusBadge status={current} />
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
      </button>

      {open && (
        <>
          {/* Click-away catcher */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
          <ul
            role="listbox"
            className="absolute right-0 z-20 mt-1.5 w-40 overflow-hidden rounded-md border border-base-line bg-base-card shadow-lg shadow-black/40"
          >
            {SHIPMENT_STATUSES.map((status) => (
              <li key={status}>
                <button
                  role="option"
                  aria-selected={status === current}
                  onClick={() => {
                    onChange(status);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center px-3 py-2 text-left text-xs font-mono transition-colors hover:bg-base-line ${
                    status === current ? "text-signal" : "text-ink-muted"
                  }`}
                >
                  {status}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
