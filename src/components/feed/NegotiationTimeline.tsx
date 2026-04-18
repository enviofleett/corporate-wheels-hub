// Threaded timeline of offers and counters between a host and a corporate.
// Read-only rendering; actions live in NegotiationActions.

import { Building2, User2 } from "lucide-react";
import type { TimelineEntry } from "@/lib/negotiations";
import { formatNaira, formatRelativeTime } from "@/lib/format";
import { StatusBadge } from "@/components/feed/StatusBadge";

type Props = {
  entries: TimelineEntry[];
};

export function NegotiationTimeline({ entries }: Props) {
  return (
    <ol className="relative space-y-4">
      {/* vertical thread line */}
      <span
        aria-hidden
        className="absolute left-[15px] top-2 bottom-2 w-px bg-border"
      />
      {entries.map((e, idx) => (
        <li key={e.id} className="relative flex gap-3">
          <div
            className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-background shadow-sm ${
              e.party === "corporate"
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground"
            }`}
            aria-hidden
          >
            {e.party === "corporate" ? (
              <Building2 className="h-3.5 w-3.5" />
            ) : (
              <User2 className="h-3.5 w-3.5" />
            )}
          </div>

          <div className="flex-1 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">
                  {e.party === "corporate" ? "Corporate" : e.hostHandle}
                  {e.isCounter && (
                    <span className="ml-1.5 text-[10px] font-medium text-muted-foreground">
                      · counter offer
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {idx === 0 ? "Initial offer · " : ""}
                  {formatRelativeTime(e.createdAt)} ago
                </p>
              </div>
              <StatusBadge status={e.status} />
            </div>

            <div className="mt-2.5 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-muted-foreground">
                  {e.vehicleLabel}
                </p>
              </div>
              {e.price > 0 && (
                <div className="text-right">
                  <p className="text-base font-bold text-foreground">
                    {formatNaira(e.price)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">/ {e.period}</p>
                </div>
              )}
            </div>

            {e.notes && (
              <p className="mt-2 rounded-lg bg-muted/60 px-2.5 py-2 text-xs leading-relaxed text-foreground">
                {e.notes}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
