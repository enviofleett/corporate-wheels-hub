import { AlertTriangle, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { DisputeStatus } from "@/lib/trust-data";

const META: Record<DisputeStatus, { label: string; icon: React.ReactNode; cls: string }> = {
  open: {
    label: "Open",
    icon: <AlertTriangle className="h-3 w-3" />,
    cls: "bg-destructive/10 text-destructive",
  },
  under_review: {
    label: "Under review",
    icon: <Clock className="h-3 w-3" />,
    cls: "bg-warning/15 text-warning-foreground",
  },
  resolved: {
    label: "Resolved",
    icon: <CheckCircle2 className="h-3 w-3" />,
    cls: "bg-success/10 text-success",
  },
  rejected: {
    label: "Closed",
    icon: <XCircle className="h-3 w-3" />,
    cls: "bg-muted text-muted-foreground",
  },
};

export function DisputeStatusBadge({ status }: { status: DisputeStatus }) {
  const m = META[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${m.cls}`}
    >
      {m.icon}
      {m.label}
    </span>
  );
}
