/**
 * Item daftar cabang (list view): nama, alamat, jarak, jam, tombol
 * "Buka di Google Maps". Klik item → fokus peta ke pin (PRD §4.6).
 */
import type { Branch } from "../../types/content";
import { buildGoogleMapsUrl } from "../../utils/googleMaps";
import { formatDistanceKm } from "../../utils/formatters";
import { track, ANALYTICS_EVENTS } from "../../services/analytics";

interface BranchCardProps {
  branch: Branch;
  distance: number | null;
  onFocus: (branch: Branch) => void;
}

export default function BranchCard({ branch, distance, onFocus }: BranchCardProps) {
  const mapsUrl = buildGoogleMapsUrl(branch);

  return (
    <li>
      <article className="rounded-2xl border border-primary-100 bg-surface p-4 transition hover:border-primary hover:shadow-card">
        <button
          type="button"
          onClick={() => onFocus(branch)}
          className="block w-full text-left"
          aria-label={`Fokuskan peta ke ${branch.name}`}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-bold leading-snug">{branch.name}</h3>
            {distance !== null && (
              <span className="shrink-0 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-extrabold text-primary-dark">
                {formatDistanceKm(distance)}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{branch.address}</p>
          {branch.openingHours && (
            <p className="mt-1.5 text-xs font-semibold text-brand-green-dark">
              Jam: {branch.openingHours}
            </p>
          )}
        </button>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track(ANALYTICS_EVENTS.OPEN_GOOGLE_MAPS_CLICK, {
              branchId: branch.id,
              city: branch.city,
            })
          }
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary-dark active:scale-95"
        >
          Buka di Google Maps
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
      </article>
    </li>
  );
}
