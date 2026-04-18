import { CheckCircle2, Clock, XCircle, RefreshCw, MinusCircle } from "lucide-react";
import type { OfferStatus } from "@/lib/negotiations";

const MAP: Record<
  OfferStatus,
  { label: string; className: string; Icon: typeof Clock }
> = {
  pending: {
    label: "Pending",
    className: "bg-warning/15 text-warning-foreground border border-warning/30",
    Icon: Clock,
  },
  accepted: {
    label: "Accepted",
    className: "bg-success/15 text-success border border-success/30",
    Icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border border-destructive/25",
    Icon: XCircle,
  },
  countered: {
    label: "Countered",
    className: "bg-primary-soft text-primary border border-primary/20",
    Icon: RefreshCw,
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-muted text-muted-foreground border border-border",
    Icon: MinusCircle,
  },
};

export function StatusBadge({ status, size = "sm" }: { status: OfferStatus; size?: "sm" | "md" }) {
  const { label, className, Icon } = MAP[status];
  const sizing =
    size === "md" ? "text-xs px-2.5 py-1 gap-1.5" : "text-[10px] px-2 py-0.5 gap-1";
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${sizing} ${className}`}>
      <Icon className={size === "md" ? "h-3.5 w-3.5" : "h-3 w-3"} />
      {label}
    </span>
  );
}
