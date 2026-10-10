import type { Branch } from "../types/content";

/**
 * URL "Buka di Google Maps" (PRD §4.6).
 * Prioritas: URL resmi dari CMS; fallback generate dari koordinat.
 */
export function buildGoogleMapsUrl(branch: Branch): string {
  if (branch.googleMapsUrl) return branch.googleMapsUrl;
  const query = `${branch.lat},${branch.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
