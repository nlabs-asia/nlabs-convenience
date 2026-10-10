/**
 * Best Seller section (PRD §4.4): data dari MenuItem yang sama
 * (isBestSeller + bestSellerOrder, limit 6). Mobile: carousel horizontal
 * scroll-snap + swipe; desktop: grid fitur. Ghost rank number di belakang
 * kartu. Section disembunyikan otomatis bila tidak ada item.
 */
import { useEffect, useRef, useState } from "react";
import { getBestSellers } from "../../services/contentApi";
import type { MenuItem } from "../../types/content";
import { formatPriceIDR } from "../../utils/formatters";
import { track, ANALYTICS_EVENTS } from "../../services/analytics";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import MenuDetailModal from "./MenuDetailModal";

function BestSellerCard({
  item,
  rank,
  onOpen,
}: {
  item: MenuItem;
  rank: number;
  onOpen: (item: MenuItem) => void;
}) {
  return (
    <li className="relative shrink-0 snap-center first:pl-1 last:pr-1">
      {/* Ghost rank number — urutan berarti di Best Seller */}
      <span
        className="text-outline pointer-events-none absolute -top-9 left-2 z-0 select-none text-8xl font-extrabold"
        aria-hidden="true"
      >
        {String(rank).padStart(2, "0")}
      </span>
      <button
        type="button"
        onClick={() => {
          track(ANALYTICS_EVENTS.MENU_CARD_CLICK, { slug: item.slug, source: "best_seller" });
          onOpen(item);
        }}
        className="group relative z-10 flex w-64 flex-col overflow-hidden rounded-card bg-surface text-left shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-lift active:scale-[0.98] sm:w-72"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
          <img
            src={item.image}
            alt={item.imageAlt}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
          <span className="absolute right-3 top-3 rounded-full bg-brand-green px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
            #{rank} Best Seller
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-base font-bold leading-snug">{item.name}</h3>
          {item.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
              {item.description}
            </p>
          )}
          {item.price !== undefined && (
            <p className="mt-auto pt-4 text-sm font-extrabold text-brand-green">
              {formatPriceIDR(item.price)}
            </p>
          )}
        </div>
      </button>
    </li>
  );
}

export default function BestSeller() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let active = true;
    getBestSellers(6).then((data) => {
      if (active) {
        setItems(data);
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Section auto-hide bila tidak ada item best seller (PRD §4.4)
  if (loaded && items.length === 0) return null;

  const scrollByCard = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({ left: direction * 288, behavior: "smooth" });
  };

  return (
    <section id="best-seller" className="overflow-hidden px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Paling Diburu"
            title="Best Seller"
            subtitle="Menu yang paling sering dipesan pelanggan kami."
          />
          {/* Kontrol carousel — desktop */}
          {items.length > 1 && (
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Geser best seller ke kiri"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary-100 text-primary-dark transition hover:border-primary hover:bg-primary-50 active:scale-95"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Geser best seller ke kanan"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary-100 text-primary-dark transition hover:border-primary hover:bg-primary-50 active:scale-95"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <Reveal delay={150}>
          <ul
            ref={trackRef}
            className="scrollbar-hide -mx-4 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 pt-2"
            aria-label="Daftar menu best seller"
          >
            {items.map((item, index) => (
              <BestSellerCard key={item.id} item={item} rank={index + 1} onOpen={setSelected} />
            ))}
          </ul>
        </Reveal>
      </div>

      <MenuDetailModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
