/** Heading section konsisten: eyebrow + judul + opsional subjudul. */
import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  return (
    <Reveal>
      <div className={`mx-auto max-w-2xl ${alignClass}`}>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-dark">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </Reveal>
  );
}
