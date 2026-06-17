export type ShipmentError =
  | { kind: "not-configured" }
  | { kind: "not-found"; trackingId?: string; shipmentId?: string }
  | { kind: "invalid-transition"; reason: string }
  | { kind: "network"; cause: unknown }
  | { kind: "permission-denied" }
  | { kind: "unknown"; cause: unknown };

export function toShipmentError(cause: unknown): ShipmentError {
  const code = (cause as { code?: string } | undefined)?.code;

  if (code === "permission-denied") return { kind: "permission-denied" };
  if (code === "unavailable" || code === "deadline-exceeded") return { kind: "network", cause };

  return { kind: "unknown", cause };
}

export function describeShipmentError(error: ShipmentError): string {
  switch (error.kind) {
    case "not-configured":
      return "Firestore isn't configured. Add your project keys to .env.local and restart the dev server.";
    case "not-found":
      return error.trackingId
        ? `No shipment found for tracking ID ${error.trackingId}.`
        : "Shipment not found.";
    case "invalid-transition":
      return error.reason;
    case "network":
      return "Couldn't reach Firestore. Check your connection and try again.";
    case "permission-denied":
      return "You don't have permission to do that. Try signing in again.";
    case "unknown":
      return "Something went wrong. Please try again.";
  }
}