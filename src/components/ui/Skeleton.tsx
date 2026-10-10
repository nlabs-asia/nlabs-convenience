/** Skeleton loading placeholder (PRD §8: state loading di tiap section). */
interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-card bg-slate-100 ${className}`}
      role="status"
      aria-label="Memuat konten"
    />
  );
}
