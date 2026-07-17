/// <reference lib="webworker" />

// ── State ──────────────────────────────────────────────────────────

let recipientId = "unknown";
let features: { name: string; state: string }[] = [];

// ── Registration ────────────────────────────────────────────────────

/**
 * Register the USER_AUTHORIZED message handler.
 *
 * Listens for messages with `type: "USER_AUTHORIZED"` and stores the
 * recipient identity.  Accepts two shapes for backward compatibility:
 *
 *   flat:    { type: "USER_AUTHORIZED", recipientId, features }
 *   wrapped: { type: "USER_AUTHORIZED", payload: { recipientId, features } }
 */
export function register(sw: ServiceWorkerGlobalScope): void {
  sw.addEventListener("message", (event: ExtendableMessageEvent) => {
    const data = event.data as Record<string, unknown> | undefined;
    if (!data || data.type !== "USER_AUTHORIZED") return;

    const info = (data.payload ?? data) as Record<string, unknown>;
    recipientId = String(info.recipientId ?? "");
    features = Array.isArray(info.features)
      ? (info.features as { name: string; state: string }[])
      : [];
  });
}

// ── Accessors (for other handlers) ──────────────────────────────────

export function getRecipientId(): string {
  return recipientId;
}

export function getFeatures(): { name: string; state: string }[] {
  return features;
}
