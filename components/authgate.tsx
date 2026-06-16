/** Shown while Firebase resolves whether anyone is signed in. Kept brief
 *  and on-brand rather than a generic spinner, since this can flash on
 *  every hard refresh. */
export function AuthGate() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-signal animate-pulse-dot" aria-hidden="true" />
        <span className="font-mono text-sm text-ink-muted">LogiTrack</span>
      </div>
    </div>
  );
}