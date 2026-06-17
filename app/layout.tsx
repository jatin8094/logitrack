import type { Metadata } from "next";
import { AuthProvider } from "@/lib/authcontext";
import { NotificationProvider } from "@/lib/notification-context";
// Suppress TS error for side-effect CSS import when type declarations are not present
// @ts-ignore
import "./globals.css";

export const metadata: Metadata = {
  title: "LogiTrack — Live Dispatch Board",
  description: "Real-time shipment tracking and dispatch dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-base font-sans text-ink antialiased">
        <AuthProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}