/**
 * Kartu menu: hover lift + zoom gambar (micro-interaction), badge kategori,
 * harga opsional, klik membuka detail modal. Analytics menu_card_click.
 */
import type { MenuItem } from "../../types/content";
import { formatPriceIDR } from "../../utils/formatters";
import { track, ANALYTICS_EVENTS } from "../../services/analytics";

interface MenuCardProps {
  item: MenuItem;
  categoryName?: string;
  onOpen: (item: MenuItem) => void;
}

export default function MenuCard({ item, categoryName, onOpen }: MenuCardProps) {
  return (
    <button
      type="button"
      onClick={() => {
        track(ANALYTICS_EVENTS.MENU_CARD_CLICK, {
          slug: item.slug,
          category: categoryName ?? "",
        });
        onOpen(item);
      }}
      className="group flex flex-col overflow-hidden rounded-card bg-surface text-left shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-lift active:scale-[0.98]"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-muted">
        <img
          src={item.image}
          alt={item.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        {item.isBestSeller && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-green px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Best Seller
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {categoryName && (
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary-dark">
            {categoryName}
          </p>
        )}
        <h3 className="mt-1 text-sm font-bold leading-snug sm:text-base">{item.name}</h3>
        {item.price !== undefined && (
          <p className="mt-auto pt-3 text-sm font-extrabold text-brand-green">
            {formatPriceIDR(item.price)}
          </p>
        )}
      </div>
    </button>
  );
}
