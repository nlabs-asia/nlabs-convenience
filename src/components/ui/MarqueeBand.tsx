/**
 * Marquee signage toko (signature): teks berjalan ala papan gerai.
 * Konten digandakan 2x agar loop mulus; animasi dimatikan saat reduced-motion.
 */
const ITEMS = [
  "OPEN 24 JAM",
  "FRESH FOOD",
  "KOPI SUSU",
  "ONIGIRI",
  "ODEN HANGAT",
  "FAMIGO REWARDS",
];

export default function MarqueeBand() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden bg-ink py-3" aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-8">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-8">
            {row.map((item, index) => (
              <span
                key={`${copy}-${index}`}
                className="flex items-center gap-8 text-xs font-bold uppercase tracking-[0.25em] text-white/80"
              >
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
