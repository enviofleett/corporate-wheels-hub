export function RequestCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 animate-pulse rounded-full bg-muted" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-2.5 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="mt-3 h-10 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
