import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  tone?: "primary" | "accent" | "success";
};

export function MetricCard({ label, value, hint, icon, tone = "primary" }: Props) {
  const toneClasses =
    tone === "accent"
      ? "bg-accent-soft text-accent"
      : tone === "success"
        ? "bg-success/15 text-success"
        : "bg-primary-soft text-primary";

  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneClasses}`}>
          {icon}
        </span>
      </div>
      <p className="mt-2 text-lg font-bold leading-none text-foreground">{value}</p>
      <p className="mt-1 text-[11px] font-medium text-muted-foreground">{label}</p>
      {hint && <p className="mt-0.5 text-[10px] text-muted-foreground/70">{hint}</p>}
    </div>
  );
}
