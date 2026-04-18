import { Link } from "@tanstack/react-router";
import { Eye, MessageSquare, MapPin, Clock } from "lucide-react";
import type { CorpRequestSummary } from "@/lib/corporate-data";
import { REQUEST_LABEL } from "@/lib/corporate-data";
import { formatNaira, formatDuration, formatRelativeTime } from "@/lib/format";

const STATUS_CLASS: Record<CorpRequestSummary["status"], string> = {
  live: "bg-success/15 text-success border-success/30",
  negotiating: "bg-accent/15 text-accent border-accent/30",
  filled: "bg-primary/10 text-primary border-primary/20",
  closed: "bg-muted text-muted-foreground border-border",
  draft: "bg-warning/15 text-warning-foreground border-warning/30",
};

export function RequestSummaryCard({ request }: { request: CorpRequestSummary }) {
  return (
    <Link
      to="/corporate/requests/$requestId"
      params={{ requestId: request.id }}
      className="block overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-colors active:bg-muted/40"
    >
      {/* Color band representing the request */}
      <div
        className="h-1.5"
        style={{
          background: `linear-gradient(90deg, oklch(0.55 0.15 ${request.imageHue}), oklch(0.72 0.19 49))`,
        }}
        aria-hidden
      />

      <div className="px-4 pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {request.title}
            </h3>
            <p className="truncate text-[11px] text-muted-foreground">
              {request.quantity}× {request.vehicleType}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_CLASS[request.status]}`}
          >
            {REQUEST_LABEL[request.status]}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-2 text-center">
          <div>
            <p className="text-xs font-bold text-foreground">
              {formatNaira(request.budget)}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              / {request.period}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">
              {formatDuration(request.durationWeeks)}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Duration
            </p>
          </div>
          <div>
            <p className="truncate text-xs font-bold text-foreground">
              {request.offersCount}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Offers
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {request.location}
        </span>
        <span className="inline-flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {request.views}
          </span>
          {request.newOffersCount > 0 && (
            <span className="inline-flex items-center gap-1 font-semibold text-accent">
              <MessageSquare className="h-3 w-3" />
              {request.newOffersCount} new
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(request.postedAt)}
          </span>
        </span>
      </div>
    </Link>
  );
}
