/**
 * About section (PRD §4.2): narasi tersanitasi dari CMS, gambar dengan
 * efek parallax melayang, highlight angka dengan counter animasi.
 * Angka highlight berasal dari CMS — placeholder "—" tampil apa adanya
 * sampai data resmi divalidasi tim brand.
 */
import { useEffect, useRef, useState } from "react";
import { getAbout } from "../../services/contentApi";
import { sanitizeRichText } from "../../utils/sanitize";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { AboutContent } from "../../types/content";
import Reveal from "../ui/Reveal";
import Skeleton from "../ui/Skeleton";

/** Counter animasi naik; fallback teks apa adanya bila bukan angka. */
function HighlightValue({ value, suffix }: { value: string; suffix?: string }) {
  const target = Number.parseInt(value, 10);
  const isNumeric = Number.isFinite(target);
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(isNumeric && !reducedMotion ? 0 : target);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isNumeric || reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(2, -10 * progress); // ease-out-expo
          setDisplay(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isNumeric, target, reducedMotion]);

  return (
    <span ref={ref} className="text-4xl font-extrabold tracking-tight text-primary-dark sm:text-5xl">
      {isNumeric ? display : value}
      {suffix && <span className="text-brand-green">{suffix}</span>}
    </span>
  );
}

export default function About() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const reducedMotion = useReducedMotion();
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    getAbout().then((data) => {
      if (active) setContent(data);
    });
    return () => {
      active = false;
    };
  }, []);

  // Parallax ringan pada blok gambar
  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = imageRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const progress =
          (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        el.style.transform = `translateY(${progress * -28}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  if (!content) {
    return (
      <section id="about" className="px-4 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </section>
    );
  }

  const highlights = [...content.highlights].sort((a, b) => a.order - b.order);

  return (
    <section id="about" className="overflow-hidden px-4 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        {/* Visual dengan parallax */}
        <Reveal>
          <div ref={imageRef} className="relative will-change-transform">
            {/* Bingkai awning mini di belakang foto */}
            <div className="awning absolute -left-4 -top-4 h-24 w-24 rounded-3xl opacity-90" aria-hidden="true" />
            <img
              src={content.imagePrimary}
              alt={content.imagePrimaryAlt}
              loading="lazy"
              className="relative aspect-[4/3] w-full rounded-card object-cover shadow-lift"
            />
            {content.imageSecondary && (
              <img
                src={content.imageSecondary}
                alt={content.imageSecondaryAlt ?? ""}
                loading="lazy"
                className="absolute -bottom-8 -right-4 hidden w-40 rounded-2xl border-4 border-surface object-cover shadow-card sm:block"
              />
            )}
          </div>
        </Reveal>

        {/* Teks */}
        <div>
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green">
              Tentang Kami
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {content.title}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div
              className="mt-5 space-y-4 text-base leading-relaxed text-slate-600 [&_strong]:text-ink"
              // Rich text dari CMS — sudah disanitasi (PRD §7.5)
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(content.bodyRichText) }}
            />
          </Reveal>

          {highlights.length > 0 && (
            <Reveal delay={240}>
              <dl className="mt-9 grid grid-cols-2 gap-6">
                {highlights.map((highlight) => (
                  <div
                    key={highlight.label}
                    className="rounded-2xl border border-primary-100 bg-primary-50/60 p-5"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {highlight.label}
                    </dt>
                    <dd className="mt-1">
                      <HighlightValue value={highlight.value} suffix={highlight.suffix} />
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
