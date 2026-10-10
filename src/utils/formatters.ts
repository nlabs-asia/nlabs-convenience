/** Formatter tampilan (locale id-ID). */

export function formatPriceIDR(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

/** "1,2 km" / "850 m" — format lokal (PRD §4.6). */
export function formatDistanceKm(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 1,
  }).format(km)} km`;
}
