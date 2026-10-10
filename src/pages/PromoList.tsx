/**
 * Halaman daftar semua promo — `/promo` (PRD §4.5).
 *
 * CATATAN M1: masih versi fondasi (state loading/error/empty + grid dasar).
 * Kartu final PromoCard dibangun di Milestone 6; metadata SEO di M10.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPromos } from "../services/contentApi";
import type { Promo } from "../types/content";

export default function PromoList() {
  const [promos, setPromos] = useState<Promo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getPromos()
      .then((data) => {
        if (active) setPromos(data);
      })
      .catch(() => {
        if (active) setError("Gagal memuat promo. Coba lagi nanti.");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Link
        to="/"
        className="text-sm font-medium text-primary-dark hover:underline"
      >
        ← Kembali ke Beranda
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Semua Promo</h1>

      {error && (
        <p role="alert" className="mt-6 rounded-card bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {!error && promos === null && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-card bg-slate-100" />
          ))}
        </div>
      )}

      {promos && promos.length === 0 && (
        <p className="mt-8 text-sm text-slate-500">
          Belum ada promo yang tersedia saat ini.
        </p>
      )}

      {promos && promos.length > 0 && (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((promo) => (
            <li
              key={promo.id}
              className="overflow-hidden rounded-card bg-surface shadow-card"
            >
              <img
                src={promo.thumbnail}
                alt={promo.thumbnailAlt}
                className="aspect-video w-full object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h2 className="text-base font-semibold">{promo.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  {promo.description}
                </p>
                <Link
                  to={`/promo/${promo.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-primary-dark hover:underline"
                >
                  Lihat Selengkapnya →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
