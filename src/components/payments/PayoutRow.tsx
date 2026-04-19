import { Wallet, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { Payout } from "@/lib/payments-data";
import { PAYOUT_STATUS_LABEL } from "@/lib/payments-data";
import { formatNaira } from "@/lib/format";

const STATUS_CLASS: Record<Payout["status"], string> = {
  scheduled: "bg-primary/10 text-primary",
  processing: "bg-warning/15 text-warning-foreground",
  completed: "bg-success/15 text-success",
  failed: "bg-destructive/10 text-destructive",
};

const STATUS_ICON = {
  scheduled: Clock,
  processing: Clock,
  completed: CheckCircle2,
  failed: XCircle,
} as const;

export function PayoutRow({ payout }: { payout: Payout }) {
  const Icon = STATUS_ICON[payout.status];
  const date = new Date(payout.completedAt ?? payout.requestedAt);
  const dateLabel = date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-3 border-b border-border px-1 py-3 last:border-b-0">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground">
        <Wallet className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{payout.bank}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {payout.ref} · {dateLabel}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-foreground">{formatNaira(payout.net)}</p>
        <span
          className={`mt-0.5 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${STATUS_CLASS[payout.status]}`}
        >
          <Icon className="h-2.5 w-2.5" />
          {PAYOUT_STATUS_LABEL[payout.status]}
        </span>
      </div>
    </div>
  );
}
