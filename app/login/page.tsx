"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authcontext";
import { AuthGate } from "@/components/authgate";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  if (authLoading || user) {
    return <AuthGate />;
  }

  return <LoginForm />;
}