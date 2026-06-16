"use client";

import { useState, type FormEvent } from "react";
import { createShipment } from "@/lib/firestore-helpers";
import type { NewShipment } from "@/lib/types";

interface CreateShipmentModalProps {
  onClose: () => void;
}

interface FormState {
  senderName: string;
  receiverAddress: string;
  weightKg: string;
  estimatedDelivery: string;
}

const INITIAL_STATE: FormState = {
  senderName: "",
  receiverAddress: "",
  weightKg: "",
  estimatedDelivery: "",
};

function validate(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (!form.senderName.trim()) errors.senderName = "Sender name is required.";
  if (!form.receiverAddress.trim()) errors.receiverAddress = "Receiver address is required.";

  const weight = Number(form.weightKg);
  if (!form.weightKg.trim()) {
    errors.weightKg = "Weight is required.";
  } else if (Number.isNaN(weight) || weight <= 0) {
    errors.weightKg = "Enter a weight greater than 0.";
  }

  if (!form.estimatedDelivery) errors.estimatedDelivery = "Pick an estimated delivery date.";

  return errors;
}

export function CreateShipmentModal({ onClose }: CreateShipmentModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    const payload: NewShipment = {
      senderName: form.senderName.trim(),
      receiverAddress: form.receiverAddress.trim(),
      weightKg: Number(form.weightKg),
      estimatedDelivery: form.estimatedDelivery,
      status: "Pending",
    };

    try {
      await createShipment(payload);
      onClose();
    } catch (err) {
      console.error("Failed to create shipment", err);
      setSubmitError("Couldn't reach Firestore. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-backdrop-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-shipment-title"
        className="w-full max-w-md animate-modal-in rounded-lg border border-base-line bg-base-raised p-6 shadow-xl shadow-black/40"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="create-shipment-title" className="text-base font-semibold text-ink">
            New shipment
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-ink-faint hover:bg-base-card hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor="senderName" className="mb-1 block text-xs font-medium text-ink-muted">
              Sender name
            </label>
            <input
              id="senderName"
              type="text"
              value={form.senderName}
              onChange={(e) => updateField("senderName", e.target.value)}
              aria-invalid={Boolean(errors.senderName)}
              aria-describedby={errors.senderName ? "senderName-error" : undefined}
              className="w-full rounded-md border border-base-line bg-base-card px-3 py-2 text-sm text-ink focus:border-signal focus:outline-none"
              placeholder="e.g. Aarav Mehta"
            />
            {errors.senderName && (
              <p id="senderName-error" className="mt-1 text-xs text-status-delayed">
                {errors.senderName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="receiverAddress" className="mb-1 block text-xs font-medium text-ink-muted">
              Receiver address
            </label>
            <textarea
              id="receiverAddress"
              value={form.receiverAddress}
              onChange={(e) => updateField("receiverAddress", e.target.value)}
              aria-invalid={Boolean(errors.receiverAddress)}
              aria-describedby={errors.receiverAddress ? "receiverAddress-error" : undefined}
              rows={2}
              className="w-full resize-none rounded-md border border-base-line bg-base-card px-3 py-2 text-sm text-ink focus:border-signal focus:outline-none"
              placeholder="Street, city, postal code"
            />
            {errors.receiverAddress && (
              <p id="receiverAddress-error" className="mt-1 text-xs text-status-delayed">
                {errors.receiverAddress}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="weightKg" className="mb-1 block text-xs font-medium text-ink-muted">
                Weight (kg)
              </label>
              <input
                id="weightKg"
                type="number"
                min="0"
                step="0.1"
                value={form.weightKg}
                onChange={(e) => updateField("weightKg", e.target.value)}
                aria-invalid={Boolean(errors.weightKg)}
                aria-describedby={errors.weightKg ? "weightKg-error" : undefined}
                className="w-full rounded-md border border-base-line bg-base-card px-3 py-2 text-sm text-ink focus:border-signal focus:outline-none"
                placeholder="0.0"
              />
              {errors.weightKg && (
                <p id="weightKg-error" className="mt-1 text-xs text-status-delayed">
                  {errors.weightKg}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="estimatedDelivery" className="mb-1 block text-xs font-medium text-ink-muted">
                Est. delivery
              </label>
              <input
                id="estimatedDelivery"
                type="date"
                value={form.estimatedDelivery}
                onChange={(e) => updateField("estimatedDelivery", e.target.value)}
                aria-invalid={Boolean(errors.estimatedDelivery)}
                aria-describedby={errors.estimatedDelivery ? "estimatedDelivery-error" : undefined}
                className="w-full rounded-md border border-base-line bg-base-card px-3 py-2 text-sm text-ink focus:border-signal focus:outline-none [color-scheme:dark]"
              />
              {errors.estimatedDelivery && (
                <p id="estimatedDelivery-error" className="mt-1 text-xs text-status-delayed">
                  {errors.estimatedDelivery}
                </p>
              )}
            </div>
          </div>

          {submitError && <p className="text-xs text-status-delayed">{submitError}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3.5 py-2 text-sm font-medium text-ink-muted hover:bg-base-card"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-signal px-3.5 py-2 text-sm font-medium text-base hover:bg-signal/90 disabled:opacity-60 transition-colors"
            >
              {submitting ? "Creating…" : "Create shipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
