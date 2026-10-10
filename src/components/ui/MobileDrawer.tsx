/**
 * Drawer navigasi mobile fullscreen (PRD §4.1): tutup via tombol close,
 * tap backdrop, Escape, dan klik link. Lock body scroll saat terbuka.
 */
import { useEffect } from "react";
import { createPortal } from "react-dom";
import logo from "../../assets/logo.png";

interface NavLink {
  id: string;
  label: string;
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  activeId: string;
}

export default function MobileDrawer({
  open,
  onClose,
  links,
  activeId,
}: MobileDrawerProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] md:hidden" role="dialog" aria-modal="true" aria-label="Menu navigasi">
      {/* Backdrop — tap untuk tutup */}
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="absolute inset-x-3 top-4 rounded-3xl bg-surface p-5 shadow-lift">
        <div className="flex items-center justify-between">
          <img src={logo} alt="FamilyMart Indonesia" className="h-8 w-auto" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu navigasi"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-primary-50 active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <ul className="mt-6 space-y-1">
          {links.map((link, index) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={onClose}
                className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-bold transition active:scale-[0.98] ${
                  activeId === link.id
                    ? "bg-primary-50 text-primary-dark"
                    : "text-ink hover:bg-surface-muted"
                }`}
              >
                {link.label}
                <span className="text-xs font-semibold text-slate-400">
                  0{index + 1}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#famigo"
          onClick={onClose}
          className="mt-6 block rounded-full bg-primary px-5 py-3.5 text-center text-sm font-bold text-white transition hover:bg-primary-dark active:scale-95"
        >
          Unduh FamiGo
        </a>
      </div>
    </div>,
    document.body,
  );
}
