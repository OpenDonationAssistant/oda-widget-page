/** A single toggled feature flag from recipient-service settings. */
export interface Feature {
  name: string;
  state: string;
}

/** Feature flag that gates donation handling to the service worker. */
export const SW_DONATIONS_FEATURE = "SW_DONATIONS";

/** True when the given feature is present and toggled on. */
export function isFeatureEnabled(features: Feature[], name: string): boolean {
  return features.some((f) => f.name === name && f.state === "ENABLED");
}
