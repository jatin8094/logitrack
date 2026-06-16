"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!auth) {
      setError("Firebase Auth isn't configured. Add your project keys to .env.local.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The auth-context listener picks up the new session; replace (not
      // push) so "back" from the dashboard doesn't return to the login form.
      router.replace("/");
    } catch (err) {
      console.error("Sign-in failed", err);
      setError("Couldn't sign in. Check the email and password and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-base-line bg-base-raised p-6">
        <div className="mb-6 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-signal animate-pulse-dot" aria-hidden="true" />
          <h1 className="font-mono text-lg font-semibold text-ink">LogiTrack</h1>
        </div>

        {!isFirebaseConfigured && (
          <div className="mb-4 rounded-md border border-status-delayed/40 bg-status-delayedDim px-3 py-2 text-xs text-status-delayed">
            Firebase isn't configured. See the README to add your .env.local keys.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-ink-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-base-line bg-base-card px-3 py-2 text-sm text-ink focus:border-signal focus:outline-none"
              placeholder="dispatcher@logitrack.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-ink-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-base-line bg-base-card px-3 py-2 text-sm text-ink focus:border-signal focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-status-delayed">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-md bg-signal px-3.5 py-2 text-sm font-medium text-base hover:bg-signal/90 disabled:opacity-60 transition-colors"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-ink-faint">
          Tracking a package?{" "}
          <Link href="/track" className="text-signal hover:underline">
            Track without signing in
          </Link>
        </p>
      </div>
    </div>
  );
}