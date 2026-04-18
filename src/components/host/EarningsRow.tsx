import { ArrowDownLeft, ArrowUpRight, Gift } from "lucide-react";
import type { EarningEntry } from "@/lib/host-data";
import { EARNING_STATUS_LABEL } from "@/lib/host-data";
import { formatNaira, formatRelativeTime } from "@/lib/format";

const STATUS_TONE: Record<EarningEntry["status"], string> = {
  pending: "bg-muted text-muted-foreground",
  in_escrow: "bg-warning/15 text-warning-foreground",
  released: "bg-success/15 text-success",
  paid_out: "bg-primary-soft text-primary",
};

export function EarningsRow({ entry }: { entry: EarningEntry }) {
  const isOutgoing = entry.type === "payout" || entry.amount < 0;
  const Icon = entry.type === "bonus" ? Gift : isOutgoing ? ArrowUpRight : ArrowDownLeft;
  return (
    <div className="flex items-center gap-3 border-b border-border px-1 py-3 last:border-0">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isOutgoing
            ? "bg-muted text-muted-foreground"
            : entry.type === "bonus"
              ? "bg-accent-soft text-accent"
              : "bg-success/15 text-success"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{entry.vehicleLabel}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {entry.corporateHandle} · {formatRelativeTime(entry.date)}
        </p>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-bold ${isOutgoing ? "text-foreground" : "text-success"}`}
        >
          {isOutgoing ? "" : "+"}
          {formatNaira(Math.abs(entry.amount))}
        </p>
        <span
          className={`mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${STATUS_TONE[entry.status]}`}
        >
          {EARNING_STATUS_LABEL[entry.status]}
        </span>
      </div>
    </div>
  );
}
