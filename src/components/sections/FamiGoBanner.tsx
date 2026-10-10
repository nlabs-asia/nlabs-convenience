/**
 * Banner FamiGo (PRD §4.7): gambar desktop/mobile dari CMS, headline,
 * deskripsi, tombol App Store & Google Play, opsional QR. Aktif/nonaktif
 * dari CMS (null → section hilang). Analytics: famigo_download_click.
 */
import { useEffect, useState } from "react";
import { getFamiGoBanner } from "../../services/contentApi";
import { track, ANALYTICS_EVENTS } from "../../services/analytics";
import type { FamiGoBanner } from "../../types/content";
import Reveal from "../ui/Reveal";

function StoreButton({
  store,
  url,
  label,
  sublabel,
}: {
  store: "app_store" | "google_play";
  url: string;
  label: string;
  sublabel: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track(ANALYTICS_EVENTS.FAMIGO_DOWNLOAD_CLICK, { store })}
      className="inline-flex items-center gap-3 rounded-2xl bg-ink px-5 py-3 text-white transition hover:-translate-y-0.5 hover:bg-slate-800 active:scale-95"
    >
      {store === "app_store" ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.9-.19 1.77-.79 3.02-.85 1.35.11 2.36.64 3.03 1.53-2.78 1.66-2.33 5.32.46 6.36-.6 1.56-1.37 3.11-2.59 5.13ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3.6 1.8 13.7 12 3.6 22.2c-.37-.2-.6-.58-.6-1.02V2.82c0-.44.23-.82.6-1.02Zm11.86 8.42L4.4 1.27l10.02 5.7 1.04 3.25Zm0 3.56-1.04 3.25L4.4 22.73l11.06-8.95Zm3.53-2.02c.84.48.84 1.66 0 2.14l-2.28 1.3-1.2-3.44 1.2-3.44 2.28 1.44Z" />
        </svg>
      )}
      <span className="text-left leading-tight">
        <span className="block text-[10px] font-medium uppercase tracking-wide text-white/70">
          {sublabel}
        </span>
        <span className="block text-sm font-bold">{label}</span>
      </span>
    </a>
  );
}

export default function FamiGoBanner() {
  const [banner, setBanner] = useState<FamiGoBanner | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getFamiGoBanner().then((data) => {
      if (active) {
        setBanner(data);
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Banner nonaktif di CMS → section hilang (PRD §4.7)
  if (loaded && !banner) return null;

  return (
    <section id="famigo" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-light shadow-lift">
            {/* Pita awning dekoratif */}
            <div className="awning absolute right-0 top-0 h-full w-16 opacity-25 sm:w-24" aria-hidden="true" />

            <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">
                  Aplikasi FamilyMart
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {banner?.headline ?? "Unduh FamiGo"}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                  {banner?.description ?? ""}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {banner && (
                    <>
                      <StoreButton
                        store="app_store"
                        url={banner.appStoreUrl}
                        sublabel="Unduh di"
                        label="App Store"
                      />
                      <StoreButton
                        store="google_play"
                        url={banner.playStoreUrl}
                        sublabel="Dapatkan di"
                        label="Google Play"
                      />
                    </>
                  )}
                  {banner?.qrCodeImage && (
                    <img
                      src={banner.qrCodeImage}
                      alt="QR code unduh FamiGo"
                      className="hidden h-20 w-20 rounded-xl bg-white p-1.5 lg:block"
                    />
                  )}
                </div>
              </div>

              {banner && (
                <div className="relative">
                  <picture>
                    <source media="(max-width: 767px)" srcSet={banner.imageMobile} />
                    <img
                      src={banner.imageDesktop}
                      alt={banner.imageAlt}
                      loading="lazy"
                      className="mx-auto w-full max-w-md rounded-2xl shadow-lift transition duration-500 hover:scale-[1.02]"
                    />
                  </picture>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
