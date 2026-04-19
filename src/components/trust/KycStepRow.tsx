import { CheckCircle2, Clock, AlertCircle, Upload, ChevronRight } from "lucide-react";
import type { KycStep } from "@/lib/trust-data";
import { formatRelativeTime } from "@/lib/format";

const META: Record<
  KycStep["status"],
  { label: string; icon: React.ReactNode; cls: string; cta: string }
> = {
  complete: {
    label: "Complete",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    cls: "bg-success/10 text-success",
    cta: "View",
  },
  in_review: {
    label: "In review",
    icon: <Clock className="h-3.5 w-3.5" />,
    cls: "bg-warning/15 text-warning-foreground",
    cta: "Track",
  },
  pending: {
    label: "Action needed",
    icon: <Upload className="h-3.5 w-3.5" />,
    cls: "bg-accent-soft text-accent",
    cta: "Upload",
  },
  rejected: {
    label: "Rejected",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    cls: "bg-destructive/10 text-destructive",
    cta: "Resubmit",
  },
};

export function KycStepRow({ step }: { step: KycStep }) {
  const m = META[step.status];
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
            {!step.required && (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                Optional
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${m.cls}`}
        >
          {m.icon}
          {m.label}
        </span>
      </div>

      {step.rejectionReason && (
        <p className="mt-2 rounded-lg bg-destructive/10 px-2.5 py-1.5 text-[11px] text-destructive">
          {step.rejectionReason}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {step.updatedAt ? `Updated ${formatRelativeTime(step.updatedAt)} ago` : "Not started"}
        </span>
        {step.status !== "complete" && (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground"
          >
            {m.cta}
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
