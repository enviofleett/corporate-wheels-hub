import { ArrowRight, MapPin, MessageCircle, Users } from "lucide-react";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import type { HostOffer } from "@/lib/host-data";
import { OFFER_STATUS_LABEL } from "@/lib/host-data";
import { formatNaira, formatRelativeTime, formatDuration } from "@/lib/format";

const STATUS_TONE: Record<HostOffer["status"], string> = {
  pending: "bg-warning/15 text-warning-foreground",
  countered: "bg-accent-soft text-accent",
  accepted: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
  withdrawn: "bg-muted text-muted-foreground",
};

export function HostOfferCard({ offer }: { offer: HostOffer }) {
  const periodLabel = offer.period === "week" ? "/wk" : "/mo";
  const diff = offer.myPrice - offer.theirBudget;
  const diffPct = Math.round((diff / offer.theirBudget) * 100);
  return (
    <article className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <CompanyAvatar hue={offer.corporateHue} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {offer.requestTitle}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {offer.corporateHandle}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_TONE[offer.status]}`}
            >
              {OFFER_STATUS_LABEL[offer.status]}
            </span>
          </div>

          <p className="mt-1.5 text-[11px] text-muted-foreground">{offer.vehicleLabel}</p>

          <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-muted/60 p-2">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">My offer</p>
              <p className="text-sm font-bold text-foreground">
                {formatNaira(offer.myPrice)}
                <span className="text-[10px] font-medium text-muted-foreground">{periodLabel}</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Their budget
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatNaira(offer.theirBudget)}
                <span className="text-[10px] font-medium text-muted-foreground">{periodLabel}</span>
              </p>
              {diff !== 0 && (
                <p
                  className={`text-[10px] font-medium ${diff > 0 ? "text-destructive" : "text-success"}`}
                >
                  {diff > 0 ? "+" : ""}
                  {diffPct}% vs budget
                </p>
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {offer.location}
            </span>
            <span>{formatDuration(offer.durationWeeks)}</span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" /> {offer.competingOffers} competing
            </span>
            <span className="ml-auto">{formatRelativeTime(offer.lastActivityAt)}</span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            {offer.unreadMessages > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                <MessageCircle className="h-3 w-3" />
                {offer.unreadMessages} new
              </span>
            )}
            <button
              type="button"
              className="ml-auto flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground"
            >
              Open thread
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
