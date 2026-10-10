/**
 * Halaman detail promo — `/promo/:slug` (PRD §4.5).
 *
 * CATATAN M1: versi fondasi. Layout final + metadata SEO di Milestone 6/10.
 * Promo draft/expired/tidak ditemukan tidak boleh diakses (contentApi memfilter).
 */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPromoBySlug } from "../services/contentApi";
import type { Promo } from "../types/content";

export default function PromoDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [promo, setPromo] = useState<Promo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getPromoBySlug(slug ?? "")
      .then((data) => {
        if (active) {
          setPromo(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError("Gagal memuat promo. Coba lagi nanti.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-64 animate-pulse rounded-card bg-slate-100" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p role="alert" className="rounded-card bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      </main>
    );
  }

  if (!promo) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Promo tidak ditemukan</h1>
        <p className="mt-3 text-sm text-slate-500">
          Promo mungkin sudah berakhir atau belum dipublikasikan.
        </p>
        <Link
          to="/promo"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Lihat Semua Promo
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link
        to="/promo"
        className="text-sm font-medium text-primary-dark hover:underline"
      >
        ← Lihat Semua Promo
      </Link>
      <article className="mt-4">
        <img
          src={promo.thumbnail}
          alt={promo.thumbnailAlt}
          className="aspect-video w-full rounded-card object-cover"
        />
        <h1 className="mt-6 text-3xl font-bold">{promo.title}</h1>
        {(promo.startDate || promo.endDate) && (
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Berlaku {promo.startDate ?? "—"} s.d. {promo.endDate ?? "—"}
          </p>
        )}
        {/* TODO(M6): render rich text via sanitizer sebelum rilis. */}
        <p className="mt-6 leading-relaxed text-slate-600">
          {promo.description}
        </p>
      </article>
    </main>
  );
}
