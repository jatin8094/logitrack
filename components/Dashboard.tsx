"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useShipments, useFilteredShipments } from "@/hooks/useShipments";
import { useActivityLog } from "@/hooks/useActivityLog";
import { changeShipmentStatusAction } from "@/lib/server/shipment-actions";
import { describeShipmentError } from "@/lib/domain/errors";
import { buildNotificationForStatusChange } from "@/lib/domain/notifications";
import { isFirebaseConfigured } from "@/lib/firebase";
import { useAuth } from "@/lib/authcontext";
import { useNotifications } from "@/lib/notification-context";
import { FilterBar } from "./FilterBar";
import { StatCards } from "./StatCards";
import { ShipmentTable } from "./ShipmentTable";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { CreateShipmentModal } from "./CreateShipmentModal";
import { ActivityFeed } from "./ActivityFeed";
import { NotificationToast } from "./NotificationToast";
import { NotificationLog } from "./NotificationLog";
import type { Shipment, ShipmentStatus } from "@/lib/types";

export function Dashboard() {
  const { shipments, loading, error } = useShipments();
  const { entries: activityEntries, loading: activityLoading } = useActivityLog();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { push: pushNotification } = useNotifications();

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [pendingUpdateId, setPendingUpdateId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  const filteredShipments = useFilteredShipments(shipments, statusFilter, searchTerm);

  async function handleStatusChange(shipment: Shipment, status: ShipmentStatus) {
    setPendingUpdateId(shipment.id);
    setActionError(null);

    const result = await changeShipmentStatusAction(shipment, status);

    if (!result.ok) {
      console.error("Failed to update shipment status", result.error);
      // invalid-transition is a domain-rule rejection (e.g. trying to edit
      // a Delivered shipment) — surfaced with its own specific copy rather
      // than the generic network/permission message.
      setActionError(
        result.error.kind === "invalid-transition"
          ? result.error.reason
          : `Couldn't update ${shipment.trackingId}: ${describeShipmentError(result.error)}`
      );
    } else {
      pushNotification(buildNotificationForStatusChange({ ...shipment, status }));
    }

    setPendingUpdateId(null);
  }

  function clearFilters() {
    setStatusFilter("All");
    setSearchTerm("");
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/login");
    } catch (err) {
      console.error("Sign-out failed", err);
      setSigningOut(false);
    }
  }

  const hasNoShipmentsAtAll = !loading && shipments.length === 0;
  const hasNoMatches = !loading && shipments.length > 0 && filteredShipments.length === 0;

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 border-b border-base-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal animate-pulse-dot" aria-hidden="true" />
            <h1 className="font-mono text-lg font-semibold text-ink">LogiTrack</h1>
          </div>
          <p className="mt-0.5 text-sm text-ink-muted">Live dispatch board · {shipments.length} active shipments</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              href="/routes"
              className="rounded-md px-2.5 py-2 text-sm font-medium text-ink-muted hover:bg-base-card hover:text-ink transition-colors"
            >
              Routes
            </Link>
            <Link
              href="/analytics"
              className="rounded-md px-2.5 py-2 text-sm font-medium text-ink-muted hover:bg-base-card hover:text-ink transition-colors"
            >
              Analytics
            </Link>
          </nav>
          {user?.email && (
            <span className="hidden truncate text-xs text-ink-faint sm:inline" title={user.email}>
              {user.email}
            </span>
          )}
          <button
            onClick={() => setLogOpen(true)}
            aria-label="Notification log"
            title="Notification log"
            className="rounded-md border border-base-line p-2 text-ink-muted hover:bg-base-card hover:text-ink transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 17h14l-1.4-1.4A2 2 0 0117 14.2V11a5 5 0 00-10 0v3.2a2 2 0 01-.6 1.4L5 17z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M9.5 20a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            disabled={!isFirebaseConfigured}
            className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-base hover:bg-signal/90 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            + New shipment
          </button>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-md border border-base-line px-3 py-2 text-sm font-medium text-ink-muted hover:bg-base-card hover:text-ink disabled:opacity-50 transition-colors"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </header>

      {!isFirebaseConfigured && (
        <div className="rounded-md border border-status-delayed/40 bg-status-delayedDim px-4 py-3 text-sm text-status-delayed">
          Firebase isn't configured. Add your project keys to <code className="font-mono">.env.local</code> and
          restart the dev server — see the README for the exact variable names.
        </div>
      )}

      {error && isFirebaseConfigured && (
        <div className="rounded-md border border-status-delayed/40 bg-status-delayedDim px-4 py-3 text-sm text-status-delayed">
          {error}
        </div>
      )}

      {actionError && (
        <div className="rounded-md border border-status-pending/40 bg-status-pendingDim px-4 py-3 text-sm text-status-pending">
          {actionError}
        </div>
      )}

      {!loading && shipments.length > 0 && (
        <StatCards shipments={shipments} activeFilter={statusFilter} onSelect={setStatusFilter} />
      )}

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-lg border border-base-line bg-base-raised">
          <div className="border-b border-base-line p-4">
            <FilterBar
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            {!loading && shipments.length > 0 && (
              <p className="mt-3 text-xs text-ink-faint">
                Showing {filteredShipments.length} of {shipments.length} shipments
              </p>
            )}
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : hasNoShipmentsAtAll ? (
            <EmptyState variant="no-shipments" onAction={() => setModalOpen(true)} />
          ) : hasNoMatches ? (
            <EmptyState variant="no-matches" onAction={clearFilters} />
          ) : (
            <ShipmentTable
              shipments={filteredShipments}
              onStatusChange={handleStatusChange}
              pendingUpdateId={pendingUpdateId}
            />
          )}
        </section>

        <aside className="rounded-lg border border-base-line bg-base-raised lg:max-h-[calc(100vh-160px)]">
          <ActivityFeed entries={activityEntries} loading={activityLoading} />
        </aside>
      </div>

      {modalOpen && <CreateShipmentModal onClose={() => setModalOpen(false)} />}
      {logOpen && <NotificationLog onClose={() => setLogOpen(false)} />}
      <NotificationToast />
    </div>
  );
}