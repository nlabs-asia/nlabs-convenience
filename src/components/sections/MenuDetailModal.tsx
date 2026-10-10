/**
 * Modal detail menu (PRD §4.3 + keputusan: modal, bukan route).
 * Dibangun di atas <Modal/> (focus trap, Escape, backdrop).
 */
import type { MenuItem } from "../../types/content";
import { formatPriceIDR } from "../../utils/formatters";
import Modal from "../ui/Modal";

interface MenuDetailModalProps {
  item: MenuItem | null;
  categoryName?: string;
  onClose: () => void;
}

export default function MenuDetailModal({ item, categoryName, onClose }: MenuDetailModalProps) {
  return (
    <Modal open={item !== null} onClose={onClose} label={item ? `Detail menu ${item.name}` : "Detail menu"}>
      {item && (
        <article>
          <img
            src={item.image}
            alt={item.imageAlt}
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
          <div className="mt-5 flex items-start justify-between gap-4">
            <div>
              {categoryName && (
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary-dark">
                  {categoryName}
                </p>
              )}
              <h3 className="mt-1 text-2xl font-extrabold tracking-tight">{item.name}</h3>
            </div>
            {item.price !== undefined && (
              <p className="shrink-0 rounded-full bg-primary-50 px-4 py-2 text-sm font-extrabold text-primary-dark">
                {formatPriceIDR(item.price)}
              </p>
            )}
          </div>
          {item.isBestSeller && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-green/10 px-3 py-1 text-xs font-bold text-brand-green-dark">
              ★ Menu Best Seller
            </p>
          )}
          {item.description && (
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.description}</p>
          )}
          <button
            type="button"
            onClick={onClose}
            className="mt-7 w-full rounded-full bg-primary py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark active:scale-95"
          >
            Tutup
          </button>
        </article>
      )}
    </Modal>
  );
}
