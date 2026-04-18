import { Star, Gauge, Check, X, Bookmark, Crown } from "lucide-react";
import type { IncomingOffer } from "@/lib/corporate-data";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import { formatNaira } from "@/lib/format";

type Props = {
  offers: IncomingOffer[];
  onAccept?: (offer: IncomingOffer) => void;
  onReject?: (offer: IncomingOffer) => void;
};

// Side-by-side, horizontally scrollable comparison of offers.
export function OfferComparison({ offers, onAccept, onReject }: Props) {
  if (offers.length === 0) return null;

  const lowestPrice = Math.min(...offers.map((o) => o.price));
  const highestRating = Math.max(...offers.map((o) => o.hostRating));

  return (
    <div className="-mx-5">
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {offers.map((o) => {
          const isBestPrice = o.price === lowestPrice;
          const isTopRated = o.hostRating === highestRating;
          return (
            <article
              key={o.id}
              className="flex w-[78%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]"
            >
              {/* Highlight band */}
              <div className="flex items-center justify-between gap-2 px-3 pt-3">
                <div className="flex items-center gap-2">
                  <CompanyAvatar hue={o.hostHue} />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {o.hostHandle}
                    </p>
                    <p className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                      <Star className="h-2.5 w-2.5 fill-accent text-accent" />
                      {o.hostRating.toFixed(1)} · {o.completedRentals}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-2 flex flex-wrap gap-1 px-3">
                {isBestPrice && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-success/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-success">
                    Best price
                  </span>
                )}
                {isTopRated && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-accent">
                    <Crown className="h-2.5 w-2.5" />
                    Top rated
                  </span>
                )}
                {o.vehicle.telematics && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary">
                    <Gauge className="h-2.5 w-2.5" />
                    Telematics
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mt-3 px-3">
                <p className="text-xl font-bold text-foreground">
                  {formatNaira(o.price)}
                  <span className="text-[10px] font-normal text-muted-foreground">
                    {" "}
                    / {o.period}
                  </span>
                </p>
              </div>

              {/* Spec rows */}
              <dl className="mt-3 space-y-1.5 px-3 text-[11px]">
                <Row label="Vehicle" value={`${o.vehicle.label} ${o.vehicle.year}`} />
                <Row label="Color" value={o.vehicle.color} />
                <Row label="Driver" value={o.driverIncluded ? "Included" : "Self-drive"} />
                <Row
                  label="Response"
                  value={`${o.responseTimeMins}m avg`}
                />
                <Row label="Status" value={o.status === "shortlisted" ? "Shortlisted" : o.status === "rejected" ? "Rejected" : "New"} />
              </dl>

              {/* Actions */}
              <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border bg-muted/30 px-3 py-3">
                <button
                  type="button"
                  onClick={() => onAccept?.(o)}
                  className="flex h-9 items-center justify-center gap-1 rounded-lg bg-accent text-xs font-semibold text-accent-foreground shadow-[var(--shadow-accent)] active:scale-[0.98]"
                >
                  <Check className="h-3.5 w-3.5" />
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => onReject?.(o)}
                  className="flex h-9 items-center justify-center gap-1 rounded-lg border border-border bg-background text-xs font-semibold text-destructive active:scale-[0.98]"
                >
                  <X className="h-3.5 w-3.5" />
                  Reject
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-1 last:border-b-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
