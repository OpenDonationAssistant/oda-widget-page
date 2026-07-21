/// <reference lib="webworker" />

import { DefaultApiFactory as WidgetService } from "@opendonationassistant/oda-widget-service-client";
import type { WidgetDto } from "@opendonationassistant/oda-widget-service-client";

// ── Configuration ───────────────────────────────────────────────────

const WIDGET_API_ENDPOINT = "https://api.oda.digital";

// ── State ──────────────────────────────────────────────────────────

let widgets: WidgetDto[] = [];

// ── Accessors (for other handlers) ─────────────────────────────────

export function getWidgets(): WidgetDto[] {
  return widgets;
}

export function getWidget(id: string): WidgetDto | undefined {
  return widgets.find((w) => w.id === id);
}

// ── Registration ────────────────────────────────────────────────────

export function register(token: string, sw: ServiceWorkerGlobalScope): void {
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  const service = WidgetService(undefined, WIDGET_API_ENDPOINT);

  const loadWidgets = () =>
    service.list(auth).then((response) => {
      widgets = response.data
        .filter((w) => !w.deleted)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    });

  loadWidgets();

  // Allow other handlers to trigger a refresh
  sw.addEventListener("message", (event: ExtendableMessageEvent) => {
    const data = event.data as Record<string, unknown> | undefined;
    if (!data) return;
    if (data.type === "WIDGETS_REFRESH") {
      loadWidgets();
    }
  });
}
