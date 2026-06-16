import type { Metadata } from "next";
import { AuthProvider } from "@/lib/authcontext";
// @ts-ignore: CSS side-effect import without declaration
import "./globals.css";

export const metadata: Metadata = {
  title: "LogiTrack — Live Dispatch Board",
  description: "Real-time shipment tracking and dispatch dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-base font-sans text-ink antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}