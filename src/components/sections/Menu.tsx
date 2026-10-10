/**
 * Menu section (PRD §4.3): grid semua menu + chips kategori + search +
 * "Muat Lebih Banyak" (12 item/muat) + detail modal. State lengkap:
 * skeleton / error / empty. Grid 2 kolom mobile, 3 tablet, 4 desktop.
 */
import { useCallback, useEffect, useState } from "react";
import { getMenuCategories, getMenuItems } from "../../services/contentApi";
import type { MenuCategory, MenuItem } from "../../types/content";
import SectionHeading from "../ui/SectionHeading";
import Skeleton from "../ui/Skeleton";
import EmptyState from "../ui/EmptyState";
import MenuCard from "../ui/MenuCard";
import MenuDetailModal from "./MenuDetailModal";
import Reveal from "../ui/Reveal";

const PAGE_SIZE = 12;

export default function Menu() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [categorySlug, setCategorySlug] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<MenuItem | null>(null);

  const categoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name;

  const load = useCallback(
    (offset: number, append: boolean) => {
      setError(null);
      if (!append) setLoading(true);
      getMenuItems({ categorySlug, search, limit: PAGE_SIZE, offset })
        .then((result) => {
          setItems((prev) => (append ? [...prev, ...result.items] : result.items));
          setHasMore(result.hasMore);
        })
        .catch(() => setError("Gagal memuat menu. Coba lagi nanti."))
        .finally(() => setLoading(false));
    },
    [categorySlug, search],
  );

  useEffect(() => {
    getMenuCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Reload saat filter/search berubah (search didebounce ringan)
  useEffect(() => {
    const timer = setTimeout(() => load(0, false), 200);
    return () => clearTimeout(timer);
  }, [load]);

  const resetFilters = () => {
    setCategorySlug(undefined);
    setSearch("");
  };

  return (
    <section id="menu" className="bg-surface-muted px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Katalog"
          title="Menu FamilyMart"
          subtitle="Jelajahi pilihan makanan, minuman, dan snack favorit di gerai kami."
        />

        {/* Filter kategori + search */}
        <Reveal delay={120}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
              role="tablist"
              aria-label="Filter kategori menu"
            >
              <button
                type="button"
                role="tab"
                aria-selected={categorySlug === undefined}
                onClick={() => setCategorySlug(undefined)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition active:scale-95 ${
                  categorySlug === undefined
                    ? "bg-primary text-white shadow-card"
                    : "bg-surface text-ink hover:bg-primary-50"
                }`}
              >
                Semua
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={categorySlug === category.slug}
                  onClick={() => setCategorySlug(category.slug)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition active:scale-95 ${
                    categorySlug === category.slug
                      ? "bg-primary text-white shadow-card"
                      : "bg-surface text-ink hover:bg-primary-50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="relative shrink-0">
              <label htmlFor="menu-search" className="sr-only">
                Cari menu berdasarkan nama
              </label>
              <svg
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                id="menu-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari menu…"
                className="w-full rounded-full border border-primary-100 bg-surface py-2.5 pl-11 pr-4 text-sm transition placeholder:text-slate-400 focus:border-primary sm:w-56"
              />
            </div>
          </div>
        </Reveal>

        {/* Grid menu */}
        {error ? (
          <div className="mt-10">
            <EmptyState
              title="Menu gagal dimuat"
              message={error}
              actionLabel="Coba Lagi"
              onAction={() => load(0, false)}
            />
          </div>
        ) : loading ? (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Menu tidak ditemukan"
              message="Coba kata kunci lain atau pilih kategori berbeda."
              actionLabel="Reset Filter"
              onAction={resetFilters}
            />
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {items.map((item, index) => (
                <Reveal key={item.id} delay={Math.min(index % PAGE_SIZE, 7) * 60}>
                  <MenuCard
                    item={item}
                    categoryName={categoryName(item.categoryId)}
                    onOpen={setSelected}
                  />
                </Reveal>
              ))}
            </div>
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => load(items.length, true)}
                  className="rounded-full border-2 border-primary px-8 py-3 text-sm font-bold text-primary-dark transition hover:bg-primary hover:text-white active:scale-95"
                >
                  Muat Lebih Banyak
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <MenuDetailModal
        item={selected}
        categoryName={selected ? categoryName(selected.categoryId) : undefined}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
