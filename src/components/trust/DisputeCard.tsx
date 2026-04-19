import { Link } from "@tanstack/react-router";
import { Paperclip, MessageCircle } from "lucide-react";
import type { Dispute } from "@/lib/trust-data";
import { REASON_LABELS } from "@/lib/trust-data";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import { DisputeStatusBadge } from "./DisputeStatusBadge";
import { formatNaira, formatRelativeTime } from "@/lib/format";

export function DisputeCard({ dispute }: { dispute: Dispute }) {
  return (
    <Link
      to="/trust/disputes/$disputeId"
      params={{ disputeId: dispute.id }}
      className="block rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-start gap-3">
        <CompanyAvatar hue={dispute.counterpartyHue} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {dispute.counterparty}
            </span>
            <DisputeStatusBadge status={dispute.status} />
          </div>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {dispute.id} · {dispute.vehicleLabel}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-muted/40 p-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {REASON_LABELS[dispute.reason]}
        </p>
        <p className="mt-1 line-clamp-2 text-xs text-foreground">{dispute.summary}</p>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Paperclip className="h-3 w-3" />
            {dispute.evidenceCount}
          </span>
          {dispute.unread > 0 && (
            <span className="inline-flex items-center gap-1 font-semibold text-accent">
              <MessageCircle className="h-3 w-3" />
              {dispute.unread} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            {formatNaira(dispute.amountInDispute)}
          </span>
          <span>· {formatRelativeTime(dispute.lastUpdateAt)} ago</span>
        </div>
      </div>
    </Link>
  );
}
