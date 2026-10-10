/**
 * Promo landing section (PRD §4.5): max 6 kartu, deskripsi line-clamp-2,
 * CTA "Lihat Selengkapnya" → /promo/:slug, "Lihat Semua Promo" → /promo.
 * Layout 1 kolom mobile, 2 tablet, 3 desktop. Analytics: promo_see_more_click,
 * promo_list_click.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPromos } from "../../services/contentApi";
import { track, ANALYTICS_EVENTS } from "../../services/analytics";
import type { Promo } from "../../types/content";
import SectionHeading from "../ui/SectionHeading";
import Skeleton from "../ui/Skeleton";
import EmptyState from "../ui/EmptyState";
import Reveal from "../ui/Reveal";

const LANDING_LIMIT = 6;

export default function PromoSection() {
  const [promos, setPromos] = useState<Promo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getPromos({ limit: LANDING_LIMIT })
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
    <section id="promo" className="bg-primary-50/50 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Penawaran"
          title="Promo Terbaru"
          subtitle="Jangan lewatkan penawaran spesial yang sedang berlangsung."
        />

        {error ? (
          <div className="mt-10">
            <EmptyState title="Promo gagal dimuat" message={error} />
          </div>
        ) : promos === null ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72" />
            ))}
          </div>
        ) : promos.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Belum ada promo"
              message="Promo baru akan segera hadir. Cek kembali nanti, ya."
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {promos.map((promo, index) => (
              <Reveal key={promo.id} delay={Math.min(index, 5) * 80}>
                <article className="group flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="relative aspect-video overflow-hidden bg-surface-muted">
                    <img
                      src={promo.thumbnail}
                      alt={promo.thumbnailAlt}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold leading-snug">{promo.title}</h3>
                    {/* Deskripsi max 2 baris + ellipsis (PRD §4.5) */}
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                      {promo.description}
                    </p>
                    <Link
                      to={`/promo/${promo.slug}`}
                      onClick={() =>
                        track(ANALYTICS_EVENTS.PROMO_SEE_MORE_CLICK, { slug: promo.slug })
                      }
                      className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-primary-dark transition hover:gap-2.5 hover:text-primary-700"
                    >
                      Lihat Selengkapnya
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <path d="M5 12h14m-6-6 6 6-6 6" />
                      </svg>
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={200}>
          <div className="mt-12 text-center">
            <Link
              to="/promo"
              onClick={() => track(ANALYTICS_EVENTS.PROMO_LIST_CLICK, { source: "landing_section" })}
              className="inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-primary-dark active:scale-95"
            >
              Lihat Semua Promo
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
