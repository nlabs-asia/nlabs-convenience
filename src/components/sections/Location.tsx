/**
 * Location section (PRD §4.6): peta Leaflet (lazy, bundle terpisah, mount
 * saat mendekati viewport) + list view cabang terdekat + pencarian +
 * fallback izin lokasi (filter provinsi manual).
 *
 * Izin lokasi HANYA diminta saat user membuka list view / tekan
 * "Lokasi Saya" — tidak saat halaman dimuat (PRD §4.6, §7.5).
 */
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { getBranches } from "../../services/contentApi";
import { useGeolocation } from "../../hooks/useGeolocation";
import { useNearestBranches } from "../../hooks/useNearestBranches";
import { track, ANALYTICS_EVENTS } from "../../services/analytics";
import type { Branch } from "../../types/content";
import SectionHeading from "../ui/SectionHeading";
import Skeleton from "../ui/Skeleton";
import EmptyState from "../ui/EmptyState";
import BranchCard from "../ui/BranchCard";
import Reveal from "../ui/Reveal";

// Bundle peta terpisah — tidak masuk initial load (PRD §7.2)
const MapView = lazy(() => import("./MapView"));

const LIST_PAGE_SIZE = 10;

type ViewMode = "map" | "list";

export default function Location() {
  const [branches, setBranches] = useState<Branch[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("map");
  const [query, setQuery] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(LIST_PAGE_SIZE);
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);
  const [mapMounted, setMapMounted] = useState(false);
  const geo = useGeolocation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    getBranches()
      .then((data) => {
        if (active) setBranches(data);
      })
      .catch(() => {
        if (active) setError("Gagal memuat data lokasi. Coba lagi nanti.");
      });
    return () => {
      active = false;
    };
  }, []);

  // Mount komponen peta hanya saat section mendekati viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const provinces = useMemo(
    () => [...new Set((branches ?? []).map((b) => b.province))].sort(),
    [branches],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (branches ?? []).filter((branch) => {
      if (provinceFilter && branch.province !== provinceFilter) return false;
      if (!q) return true;
      return (
        branch.name.toLowerCase().includes(q) ||
        branch.city.toLowerCase().includes(q) ||
        branch.address.toLowerCase().includes(q)
      );
    });
  }, [branches, query, provinceFilter]);

  const nearest = useNearestBranches(filtered, geo.position);

  /** Minta izin lokasi + catat hasilnya (tanpa koordinat mentah). */
  const requestLocation = () => {
    geo.request().then((position) => {
      track(ANALYTICS_EVENTS.GEOLOCATION_PERMISSION_RESULT, {
        result: position ? "granted" : "denied",
      });
    });
  };

  const enterListView = () => {
    setView("list");
    if (geo.status === "idle") requestLocation();
  };

  const focusBranch = (branch: Branch) => {
    setActiveBranchId(branch.id);
    setView("map");
  };

  const showProvinceFallback =
    view === "list" && (geo.status === "denied" || geo.status === "error");

  return (
    <section id="lokasi" ref={sectionRef} className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Gerai Kami"
          title="Temukan FamilyMart Terdekat"
          subtitle="Ratusan gerai siap melayani Anda 24 jam di seluruh Indonesia."
        />

        {/* Kontrol: search + Lokasi Saya + toggle Peta/Daftar */}
        <Reveal delay={120}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <label htmlFor="branch-search" className="sr-only">
                Cari cabang berdasarkan nama, kota, atau alamat
              </label>
              <svg
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"
              >
                <path d="M12 21s-7-5.1-7-11a7 7 0 1 1 14 0c0 5.9-7 11-7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <input
                id="branch-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama cabang, kota, atau alamat…"
                className="w-full rounded-full border border-primary-100 bg-surface py-3 pl-11 pr-4 text-sm transition placeholder:text-slate-400 focus:border-primary"
              />
            </div>

            <button
              type="button"
              onClick={requestLocation}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-5 py-3 text-sm font-bold text-primary-dark transition hover:bg-primary-50 active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                <circle cx="12" cy="12" r="8" />
              </svg>
              {geo.status === "requesting" ? "Meminta izin…" : "Lokasi Saya"}
            </button>

            <div className="inline-flex rounded-full bg-primary-50 p-1" role="tablist" aria-label="Mode tampilan lokasi">
              {(["map", "list"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={view === mode}
                  onClick={() => (mode === "list" ? enterListView() : setView("map"))}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition active:scale-95 ${
                    view === mode ? "bg-primary text-white shadow-card" : "text-primary-dark"
                  }`}
                >
                  {mode === "map" ? "Peta" : "Daftar"}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {error ? (
          <div className="mt-8">
            <EmptyState title="Lokasi gagal dimuat" message={error} />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-5">
            {/* Peta — selalu tampil di desktop; ikuti toggle di mobile */}
            <Reveal className={`lg:col-span-3 ${view === "list" ? "hidden lg:block" : ""}`}>
              <div className="h-[420px] overflow-hidden rounded-card shadow-card sm:h-[480px]">
                {mapMounted && branches ? (
                  <Suspense fallback={<Skeleton className="h-full" />}>
                    <MapView
                      branches={filtered}
                      activeBranchId={activeBranchId}
                      userPosition={geo.position}
                      onPinClick={(branch) => setActiveBranchId(branch.id)}
                    />
                  </Suspense>
                ) : (
                  <Skeleton className="h-full" />
                )}
              </div>
            </Reveal>

            {/* Daftar — selalu tampil di desktop; ikuti toggle di mobile */}
            <Reveal delay={120} className={`lg:col-span-2 ${view === "map" ? "hidden lg:block" : ""}`}>
              <div className="flex h-full flex-col">
                {showProvinceFallback && (
                  <div className="mb-4 rounded-2xl border border-primary-100 bg-primary-50/70 p-4">
                    <p className="text-xs font-semibold text-primary-700">
                      Izin lokasi tidak diberikan. Pilih provinsi untuk menyaring daftar:
                    </p>
                    <label htmlFor="province-filter" className="sr-only">
                      Filter provinsi
                    </label>
                    <select
                      id="province-filter"
                      value={provinceFilter}
                      onChange={(event) => {
                        setProvinceFilter(event.target.value);
                        setVisibleCount(LIST_PAGE_SIZE);
                      }}
                      className="mt-2 w-full rounded-full border border-primary-100 bg-surface px-4 py-2.5 text-sm focus:border-primary"
                    >
                      <option value="">Semua Provinsi</option>
                      {provinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {nearest.length === 0 ? (
                  <EmptyState
                    title="Cabang tidak ditemukan"
                    message="Coba kata kunci lain atau ubah filter provinsi."
                  />
                ) : (
                  <>
                    <ul className="max-h-[420px] space-y-3 overflow-y-auto pr-1 sm:max-h-[480px]">
                      {nearest.slice(0, visibleCount).map(({ branch, distance }) => (
                        <BranchCard
                          key={branch.id}
                          branch={branch}
                          distance={distance}
                          onFocus={focusBranch}
                        />
                      ))}
                    </ul>
                    {nearest.length > visibleCount && (
                      <button
                        type="button"
                        onClick={() => setVisibleCount((c) => c + LIST_PAGE_SIZE)}
                        className="mt-4 w-full rounded-full border-2 border-primary py-2.5 text-sm font-bold text-primary-dark transition hover:bg-primary hover:text-white active:scale-95"
                      >
                        Muat Lebih Banyak
                      </button>
                    )}
                  </>
                )}
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
