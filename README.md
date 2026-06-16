# LogiTrack — Real-Time Delivery Dashboard

A mini logistics dashboard where dispatchers create, assign, and track shipments in real time. Built with Next.js (App Router), Tailwind CSS, and Firebase Firestore.

## Stack

- **Next.js 14** (App Router, Server + Client Components)
- **Tailwind CSS** (no arbitrary values — every color, spacing, and radius comes from `tailwind.config.ts`)
- **Firebase Firestore** for real-time data, **Firebase Auth** for the optional login gate
- **TypeScript** throughout

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in your Firebase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without a configured `.env.local`, the dashboard still renders — it shows a clear "Firebase isn't configured" banner and disables writes, instead of crashing.

### Setting up Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Firestore Database** (start in test mode for local dev, then apply `firestore.rules` before sharing the project).
3. (Optional bonus) Enable **Authentication → Email/Password**, and create one dispatcher user to sign in with at `/login`.
4. In **Project settings → General → Your apps**, register a web app and copy the config values into `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

`.env.local` is gitignored — never commit real keys.

## Project structure

```
app/
  layout.tsx          Server Component — fonts, metadata, html shell
  page.tsx             Server Component — renders <Dashboard /> client component
  login/page.tsx        Server Component wrapper for the optional auth screen
  globals.css           Tailwind layers + design tokens (focus rings, scrollbars, motion)
components/
  Dashboard.tsx          Client Component — owns filter/search/modal state, wires hooks together
  FilterBar.tsx           Status pills + tracking ID search
  ShipmentTable.tsx        Dense data grid (desktop) / stacked cards (mobile), same data either way
  StatusMenu.tsx           Quick-action dropdown for changing a shipment's status
  StatusBadge.tsx          Color-coded status pill with a live pulse for "In Transit"
  CreateShipmentModal.tsx   Form with inline validation and Firestore error handling
  ActivityFeed.tsx          Real-time chronological log of status changes
  LoadingSkeleton.tsx       Skeleton rows shown during the initial Firestore fetch
  EmptyState.tsx            Distinct copy for "no shipments yet" vs. "no search results"
  LoginForm.tsx             Email/password sign-in (optional bonus)
hooks/
  useShipments.ts          onSnapshot listener + client-side filter/search (memoized)
  useActivityLog.ts        onSnapshot listener for the activity feed, capped at 25 entries
lib/
  firebase.ts               Guarded Firebase init — never throws if env vars are missing
  firestore-helpers.ts       createShipment / updateShipmentStatus + activity log writes
  types.ts                   Shared Shipment / ActivityLogEntry types
firestore.rules             Restricts reads/writes to signed-in users
```

## Design choices

**Visual direction.** The dashboard is built around the world dispatchers already work in: shipping manifests, waybills, and tracking consoles. The dark, low-saturation base (`#0B0E14`) reads as a control room rather than a generic admin theme, and every shipment status maps to one fixed color — amber for Pending, blue for In Transit, green for Delivered, red for Delayed — used consistently across the badge, the quick-action menu, and the activity feed so a dispatcher can scan the board by color alone.

**Typography.** Tracking IDs, weights, dates, and timestamps are set in a monospace face (IBM Plex Mono), the way they'd appear on an actual manifest, while labels and body copy use a clean grotesque (Inter). This split makes scannable data visually distinct from UI chrome.

**Signature detail.** "In Transit" shipments carry a small animated pulse dot, and new activity log entries animate in — a deliberate nod to a live radar/tracking blip, reinforcing that the board is real-time rather than a static table that happens to refresh.

**Real-time data flow.** `useShipments` and `useActivityLog` each own a single `onSnapshot` listener, created once in `useEffect` and explicitly unsubscribed on cleanup — this is the part of the brief most prone to memory leaks and infinite re-render loops, so the listener lifecycle is isolated in a hook rather than inlined in a component.

**Server vs. Client Components.** `app/page.tsx` and `app/login/page.tsx` are Server Components with no interactivity of their own; they exist purely to render a `'use client'` component (`Dashboard`, `LoginForm`) that owns all state and Firestore access. This keeps the App Router boundary intentional rather than marking every file `'use client'` by default.

**Error handling.** Firestore reads and writes are wrapped in try/catch at the hook and helper level. A missing `.env.local`, a dropped connection, or a failed status update all surface as a specific inline message — never a blank screen or an uncaught exception in the console.

**Filtering & search.** Both are derived client-side from the live snapshot via a memoized hook (`useFilteredShipments`), so they update instantly with no extra Firestore reads, and recompute only when the shipments list, filter, or search term actually changes.

## Notes on scope

Authentication (`/login`) and the activity log are the assessment's optional/bonus items — both are implemented, but the dashboard at `/` works without signing in. If you want to require auth in production, the natural next step is a route guard in `app/layout.tsx` or middleware that redirects unauthenticated users to `/login`; it's left out here so the core dashboard stays easy to evaluate without first creating a Firebase Auth user.
