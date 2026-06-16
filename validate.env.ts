/**
 * Lightweight runtime check for the Firebase env vars, beyond the simple
 * "are they present" check in lib/firebase.ts. Catches the most common
 * copy-paste mistake (a literal leading/trailing space from pasting
 * "KEY= value" into .env.local) with a clear console warning instead of
 * a silent, hours-long debugging session.
 */
export function validateFirebaseEnv(): void {
  if (process.env.NODE_ENV === "production") return;

  const keys = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ] as const;

  for (const key of keys) {
    const value = process.env[key];
    if (value && value !== value.trim()) {
      console.warn(
        `[env] ${key} has leading/trailing whitespace. ` +
          `This usually means .env.local has "KEY= value" instead of "KEY=value" — ` +
          `Firebase will silently reject the malformed value instead of throwing a clear error.`
      );
    }
  }
}