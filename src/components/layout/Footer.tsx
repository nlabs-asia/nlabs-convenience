/**
 * Footer dinamis (PRD §4.8): konten dari service layer, tahun otomatis.
 * Link eksternal aman (rel="noopener noreferrer").
 */
import { useEffect, useState } from "react";
import { getFooter } from "../../services/contentApi";
import type { FooterContent } from "../../types/content";
import AwningDivider from "../ui/AwningDivider";
import logo from "../../assets/logo.png";

const QUICK_LINKS = [
  { id: "about", label: "About" },
  { id: "menu", label: "Menu" },
  { id: "promo", label: "Promo" },
  { id: "lokasi", label: "Lokasi" },
];

export default function Footer() {
  const [content, setContent] = useState<FooterContent | null>(null);

  useEffect(() => {
    let active = true;
    getFooter().then((data) => {
      if (active) setContent(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <AwningDivider flip />
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <img
              src={logo}
              alt="FamilyMart Indonesia"
              className="h-10 w-auto rounded-lg bg-white p-1.5"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              {content?.description ?? ""}
            </p>
          </div>

          {/* Navigasi cepat */}
          <nav aria-label="Navigasi footer">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">
              Jelajahi
            </h2>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-sm text-white/80 transition hover:text-white hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontak & sosial */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">
              Hubungi Kami
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>{content?.officeAddress}</li>
              <li>
                <a href={`mailto:${content?.email}`} className="hover:text-white hover:underline">
                  {content?.email}
                </a>
              </li>
              <li>
                <a href={`tel:${content?.phone}`} className="hover:text-white hover:underline">
                  {content?.phone}
                </a>
              </li>
            </ul>
            <ul className="mt-5 flex gap-3">
              {content?.socialLinks.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 items-center rounded-full bg-white/10 px-4 text-xs font-bold transition hover:bg-primary active:scale-95"
                  >
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row">
          <p>© {year} FamilyMart Indonesia. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-5">
            <a href={content?.privacyPolicyUrl ?? "#"} className="hover:text-white hover:underline">
              Kebijakan Privasi
            </a>
            <a href={content?.termsUrl ?? "#"} className="hover:text-white hover:underline">
              Syarat &amp; Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
