"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { SimulatedNotification } from "@/lib/domain/notifications";

interface NotificationContextValue {
  notifications: SimulatedNotification[];
  latestToast: SimulatedNotification | null;
  push: (n: SimulatedNotification) => void;
  dismissToast: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const MAX_LOG = 50;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<SimulatedNotification[]>([]);
  const [latestToast, setLatestToast] = useState<SimulatedNotification | null>(null);

  const push = useCallback((n: SimulatedNotification) => {
    setNotifications((prev) => [n, ...prev].slice(0, MAX_LOG));
    setLatestToast(n);
  }, []);

  const dismissToast = useCallback(() => setLatestToast(null), []);

  return (
    <NotificationContext.Provider value={{ notifications, latestToast, push, dismissToast }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationProvider");
  return ctx;
}