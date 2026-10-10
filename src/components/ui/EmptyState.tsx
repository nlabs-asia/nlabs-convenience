/**
 * Empty state — mengarahkan user saat hasil kosong (PRD §4.3).
 */
interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-card border-2 border-dashed border-primary-100 px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-2xl" aria-hidden>
        🍙
      </div>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
