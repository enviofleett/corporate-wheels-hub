import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import type { ReviewableDeal } from "@/lib/trust-data";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import { formatNaira, formatDuration, formatRelativeTime } from "@/lib/format";

export function ReviewableDealCard({ deal }: { deal: ReviewableDeal }) {
  const Body = (
    <>
      <div className="flex items-start gap-3">
        <CompanyAvatar hue={deal.counterpartyHue} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{deal.counterparty}</p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{deal.vehicleLabel}</p>
        </div>
        {deal.reviewed ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
            <CheckCircle2 className="h-3 w-3" />
            Reviewed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
            <Star className="h-3 w-3" />
            Pending
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-2.5 text-center">
        <Stat label="Duration" value={formatDuration(deal.durationWeeks)} />
        <Stat label="Amount" value={formatNaira(deal.amount)} />
        <Stat label="Completed" value={`${formatRelativeTime(deal.completedAt)} ago`} />
      </div>

      {!deal.reviewed && (
        <div className="mt-3 flex items-center justify-end text-[11px] font-semibold text-accent">
          Leave a review
          <ArrowRight className="ml-1 h-3 w-3" />
        </div>
      )}
    </>
  );

  if (deal.reviewed) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 opacity-70 shadow-[var(--shadow-card)]">
        {Body}
      </div>
    );
  }

  return (
    <Link
      to="/trust/review/$dealId"
      params={{ dealId: deal.id }}
      className="block rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
    >
      {Body}
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}
