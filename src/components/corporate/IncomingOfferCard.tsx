import { Link } from "@tanstack/react-router";
import { Star, Clock, Gauge, Check, X, Bookmark } from "lucide-react";
import type { IncomingOffer } from "@/lib/corporate-data";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import { formatNaira, formatRelativeTime } from "@/lib/format";

type Props = {
  offer: IncomingOffer;
  onAccept?: (offer: IncomingOffer) => void;
  onReject?: (offer: IncomingOffer) => void;
  onShortlist?: (offer: IncomingOffer) => void;
};

export function IncomingOfferCard({ offer, onAccept, onReject, onShortlist }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3 px-4 pt-3.5">
        <CompanyAvatar hue={offer.hostHue} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-foreground">
              {offer.hostHandle}
            </p>
            {offer.status === "shortlisted" && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                <Bookmark className="h-2.5 w-2.5 fill-accent" />
                Shortlisted
              </span>
            )}
            {offer.status === "new" && (
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-label="New" />
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-accent text-accent" />
              {offer.hostRating.toFixed(1)}
            </span>
            <span>· {offer.completedRentals} rentals</span>
            <span className="inline-flex items-center gap-0.5">
              · <Clock className="h-3 w-3" />
              {offer.responseTimeMins}m response
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-bold text-foreground">{formatNaira(offer.price)}</p>
          <p className="text-[10px] text-muted-foreground">/ {offer.period}</p>
        </div>
      </div>

      <div className="mx-4 mt-3 rounded-xl border border-border bg-muted/40 p-2.5">
        <p className="text-xs font-semibold text-foreground">
          {offer.vehicle.label} {offer.vehicle.year}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
          <span>{offer.vehicle.color}</span>
          <span aria-hidden>·</span>
          <span>{offer.driverIncluded ? "Driver included" : "Self-drive"}</span>
          {offer.vehicle.telematics && (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-0.5 font-medium text-success">
                <Gauge className="h-3 w-3" />
                Telematics
              </span>
            </>
          )}
        </div>
      </div>

      {offer.notes && (
        <p className="mx-4 mt-2 text-xs leading-relaxed text-muted-foreground">
          “{offer.notes}”
        </p>
      )}

      <div className="mt-3 flex items-center justify-between px-4 pb-1 text-[11px] text-muted-foreground">
        <span>{formatRelativeTime(offer.receivedAt)} ago</span>
        <Link
          to="/offers"
          className="font-semibold text-primary hover:underline"
        >
          View thread →
        </Link>
      </div>

      <div className="mt-2 grid grid-cols-[1fr_auto_auto] gap-2 border-t border-border bg-muted/30 px-3 py-3">
        <button
          type="button"
          onClick={() => onAccept?.(offer)}
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-accent text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)] transition-transform active:scale-[0.98]"
        >
          <Check className="h-4 w-4" />
          Accept
        </button>
        <button
          type="button"
          onClick={() => onShortlist?.(offer)}
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          aria-label="Shortlist"
        >
          <Bookmark
            className={`h-4 w-4 ${offer.status === "shortlisted" ? "fill-accent text-accent" : ""}`}
          />
        </button>
        <button
          type="button"
          onClick={() => onReject?.(offer)}
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-destructive transition-colors hover:bg-muted"
          aria-label="Reject"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
