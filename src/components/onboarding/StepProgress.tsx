interface StepProgressProps {
  current: number;
  total: number;
  label?: string;
}

export function StepProgress({ current, total, label }: StepProgressProps) {
  const pct = (current / total) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium">
          Step {current} of {total}
        </span>
        {label && <span>{label}</span>}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
