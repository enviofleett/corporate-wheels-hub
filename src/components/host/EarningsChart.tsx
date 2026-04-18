// Simple SVG bar chart — no chart library needed for the mock.
type Props = {
  data: { label: string; value: number }[];
};

export function EarningsChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">Last 6 weeks</p>
          <p className="text-base font-bold text-foreground">Earnings trend</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">Avg / week</p>
          <p className="text-sm font-semibold text-foreground">
            ₦{Math.round(data.reduce((s, d) => s + d.value, 0) / data.length / 1000)}k
          </p>
        </div>
      </div>
      <div className="mt-4 flex h-28 items-end gap-2">
        {data.map((d) => {
          const h = (d.value / max) * 100;
          return (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-primary to-accent"
                style={{ height: `${Math.max(h, 6)}%` }}
                aria-label={`${d.label}: ${d.value}`}
              />
              <span className="text-[9px] text-muted-foreground">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
