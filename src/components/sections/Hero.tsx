/**
 * Hero section (PRD §4.1): video/poster latar + overlay gradient +
 * headline/sub/2 CTA dari CMS. Micro-interactions:
 * - Parallax: latar bergerak 0.35x kecepatan scroll (rAF, mati saat reduced-motion)
 * - Stagger entrance: badge → headline → sub → CTA masuk berurutan saat load
 * - Scroll cue memantul; analytics hero_cta_click
 */
import { useEffect, useRef, useState } from "react";
import { getHero } from "../../services/contentApi";
import { track, ANALYTICS_EVENTS } from "../../services/analytics";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { HeroContent } from "../../types/content";
import VideoBackground from "../ui/VideoBackground";
import MarqueeBand from "../ui/MarqueeBand";

export default function Hero() {
  const [content, setContent] = useState<HeroContent | null>(null);
  const reducedMotion = useReducedMotion();
  const bgRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    let active = true;
    getHero().then((data) => {
      if (active) setContent(data);
    });
    return () => {
      active = false;
    };
  }, []);

  // Entrance sequence (mati saat reduced-motion)
  useEffect(() => {
    if (!content) return;
    if (reducedMotion) {
      setEntered(true);
      return;
    }
    const timer = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(timer);
  }, [content, reducedMotion]);

  // Parallax via rAF — latar lebih lambat dari scroll
  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (bgRef.current) {
          bgRef.current.style.transform = `translateY(${y * 0.35}px)`;
        }
        if (fgRef.current) {
          fgRef.current.style.transform = `translateY(${y * 0.18}px)`;
          fgRef.current.style.opacity = String(Math.max(0, 1 - y / 600));
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  const onCtaClick = (label: string, target: string) =>
    track(ANALYTICS_EVENTS.HERO_CTA_CLICK, { label, target });

  const enter = (delayMs: number) =>
    `transition-all duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
      entered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    } [transition-delay:${delayMs}ms]`;

  return (
    <section id="hero" className="relative flex min-h-svh flex-col overflow-hidden bg-primary-900">
      {content && <VideoBackground content={content} containerRef={bgRef} />}

      {/* Overlay gradient — kontras teks ≥ 4.5:1 (WCAG AA) */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/80"
        aria-hidden="true"
      />

      {/* Konten foreground (parallax ringan + fade out saat scroll) */}
      <div
        ref={fgRef}
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 pb-32 pt-36 text-center will-change-transform"
      >
        {/* Badge "OPEN 24 JAM" — signage toko dengan dot berdenyut */}
        <div className={enter(0)}>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            <span className="pulse-dot h-2 w-2 rounded-full bg-brand-green" aria-hidden="true" />
            Open 24 Jam
          </span>
        </div>

        <h1
          className={`mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-sm sm:text-6xl lg:text-7xl ${enter(100)}`}
        >
          {content?.headline ?? "Belanja Lagi di FamilyMart"}
        </h1>

        <p className={`mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg ${enter(220)}`}>
          {content?.subHeadline ?? ""}
        </p>

        <div className={`mt-9 flex flex-col items-center gap-3 sm:flex-row ${enter(340)}`}>
          <a
            href={content?.primaryCtaTarget ?? "#menu"}
            onClick={() =>
              onCtaClick(content?.primaryCtaLabel ?? "Lihat Menu", content?.primaryCtaTarget ?? "#menu")
            }
            className="rounded-full bg-white px-8 py-4 text-sm font-bold text-primary-dark shadow-lift transition hover:-translate-y-0.5 hover:bg-primary-50 active:scale-95"
          >
            {content?.primaryCtaLabel ?? "Lihat Menu"}
          </a>
          <a
            href={content?.secondaryCtaTarget ?? "#lokasi"}
            onClick={() =>
              onCtaClick(content?.secondaryCtaLabel ?? "Cari Gerai Terdekat", content?.secondaryCtaTarget ?? "#lokasi")
            }
            className="rounded-full border-2 border-white/60 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white hover:bg-white/10 active:scale-95"
          >
            {content?.secondaryCtaLabel ?? "Cari Gerai Terdekat"}
          </a>
        </div>
      </div>

      {/* Scroll cue — bounce, hilang saat scroll */}
      <div
        className={`absolute bottom-28 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-500 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/50 p-1.5">
          <div className="h-2 w-1 animate-bounce rounded-full bg-white/80" />
        </div>
      </div>

      {/* Marquee signage di dasar hero */}
      <div className="relative z-10">
        <MarqueeBand />
      </div>
    </section>
  );
}
