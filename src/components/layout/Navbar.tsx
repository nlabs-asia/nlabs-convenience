/**
 * Navbar sticky: transparan di atas hero, solid saat scroll (PRD §4.1).
 * Anchor + scroll-spy + CTA Unduh FamiGo. Drawer mobile dipisah ke
 * MobileDrawer.tsx.
 */
import { useEffect, useState } from "react";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import MobileDrawer from "../ui/MobileDrawer";
import logo from "../../assets/logo.png";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "menu", label: "Menu" },
  { id: "promo", label: "Promo" },
  { id: "lokasi", label: "Lokasi" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeId = useScrollSpy(["hero", "about", "menu", "best-seller", "promo", "lokasi"]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = isScrolled || drawerOpen;

  return (
    <>
      {/* Pita awning — signature brand, selalu di paling atas */}
      <div className="awning fixed inset-x-0 top-0 z-[60] h-1.5" aria-hidden="true" />
      <header
        className={`fixed inset-x-0 top-1.5 z-50 transition-all duration-300 ${
          solid
            ? "bg-surface/95 shadow-card backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"
          aria-label="Navigasi utama"
        >
          <a href="#hero" className="flex items-center gap-2">
            <img
              src={logo}
              alt="FamilyMart Indonesia"
              className="h-8 w-auto sm:h-9"
            />
          </a>

          {/* Link desktop */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      solid
                        ? isActive
                          ? "text-primary-dark"
                          : "text-ink hover:text-primary-dark"
                        : isActive
                          ? "text-white"
                          : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {/* Underline sliding — micro-interaction scroll-spy */}
                    <span
                      className={`absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full bg-brand-green transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#famigo"
              className={`hidden rounded-full px-5 py-2.5 text-sm font-bold transition active:scale-95 sm:inline-block ${
                solid
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-white text-primary-dark hover:bg-primary-50"
              }`}
            >
              Unduh FamiGo
            </a>

            {/* Hamburger — hanya mobile */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={drawerOpen}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition active:scale-95 md:hidden ${
                solid ? "text-ink hover:bg-primary-50" : "text-white hover:bg-white/10"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        links={NAV_LINKS}
        activeId={activeId}
      />
    </>
  );
}
