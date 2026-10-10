/**
 * Analytics stub — Family Mart Indonesia landing page.
 * Nama event sesuai PRD §7.7. Provider final dipasang pada Milestone 8;
 * API `track()` sudah final sehingga aman dipanggil sejak M1.
 *
 * Privasi (docs/technical-decisions.md §6 + PRD §7.5):
 * payload TIDAK BOLEH memuat koordinat mentah pengguna — key yang
 * berbau lokasi di-strip otomatis sebelum dikirim.
 */

export const ANALYTICS_EVENTS = {
  HERO_CTA_CLICK: "hero_cta_click",
  MENU_CARD_CLICK: "menu_card_click",
  PROMO_SEE_MORE_CLICK: "promo_see_more_click",
  PROMO_LIST_CLICK: "promo_list_click",
  LOCATION_PIN_CLICK: "location_pin_click",
  OPEN_GOOGLE_MAPS_CLICK: "open_google_maps_click",
  GEOLOCATION_PERMISSION_RESULT: "geolocation_permission_result",
  FAMIGO_DOWNLOAD_CLICK: "famigo_download_click",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

const LOCATION_KEY_PATTERN = /(lat|lng|lon|coords?|position|location|geo)/i;

function sanitizePayload(
  payload: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !LOCATION_KEY_PATTERN.test(key)),
  );
}

export function track(
  event: AnalyticsEventName,
  payload: Record<string, unknown> = {},
): void {
  const safePayload = sanitizePayload(payload);
  // TODO(M8): kirim safePayload ke provider analytics final.
  if (import.meta.env.DEV) {
    console.debug(`[analytics] ${event}`, safePayload);
  }
}
