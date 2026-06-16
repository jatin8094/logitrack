"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authcontext";
import { AuthGate } from "@/components/authgate";
import { Dashboard } from "@/components/Dashboard";

export default function HomePage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return <AuthGate />;
  }

  return <Dashboard />;
}