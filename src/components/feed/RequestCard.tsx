import { useState } from "react";
import {
  MapPin,
  Clock,
  Truck,
  Users,
  Wallet,
  MoreHorizontal,
  HandCoins,
  ArrowLeftRight,
  UserCircle2,
  Bookmark,
  Star,
} from "lucide-react";
import type { CorporateRequest } from "@/lib/mock-data";
import { formatNaira, formatDuration, formatRelativeTime } from "@/lib/format";
import { CompanyAvatar } from "./CompanyAvatar";
import { VerifiedBadge } from "./VerifiedBadge";

type Props = {
  request: CorporateRequest;
  onOffer: (request: CorporateRequest) => void;
  onCounter: (request: CorporateRequest) => void;
  onViewProfile: (request: CorporateRequest) => void;
};

export function RequestCard({ request, onOffer, onCounter, onViewProfile }: Props) {
  const [saved, setSaved] = useState(false);
  const { company, vehicle, budget, durationWeeks, location, postedAt, description } = request;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      {/* Header */}
      <header className="flex items-start gap-3 px-4 pt-4">
        <button
          type="button"
          onClick={() => onViewProfile(request)}
          className="shrink-0"
          aria-label="View profile"
        >
          <CompanyAvatar hue={company.avatarHue} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <button
              type="button"
              onClick={() => onViewProfile(request)}
              className="text-sm font-semibold text-foreground"
            >
              {company.handle}
            </button>
            <VerifiedBadge level={company.verification} />
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{company.industry}</span>
            <span aria-hidden>•</span>
            <span>{formatRelativeTime(postedAt)}</span>
            {company.rating > 0 && (
              <>
                <span aria-hidden>•</span>
                <span className="inline-flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  {company.rating.toFixed(1)}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          className="-mr-2 -mt-1 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </header>

      {/* Headline metrics */}
      <div className="px-4 pt-3">
        <h3 className="text-base font-semibold leading-snug text-foreground">
          Looking for{" "}
          <span className="text-primary">
            {vehicle.quantity}× {vehicle.type}
          </span>
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      {/* Stat grid */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
        <Stat
          icon={<Wallet className="h-3.5 w-3.5" />}
          label={`Budget / ${budget.period}`}
          value={formatNaira(budget.amount)}
          accent
        />
        <Stat
          icon={<Clock className="h-3.5 w-3.5" />}
          label="Duration"
          value={formatDuration(durationWeeks)}
        />
        <Stat
          icon={<MapPin className="h-3.5 w-3.5" />}
          label="Location"
          value={location}
        />
        <Stat
          icon={request.needsDriver ? <Users className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
          label="Service"
          value={request.needsDriver ? "Driver needed" : "Self-drive"}
        />
      </div>

      {/* Engagement row */}
      <div className="mt-3 flex items-center justify-between px-4 text-xs text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">{request.offersCount}</span>{" "}
          offer{request.offersCount === 1 ? "" : "s"} so far
        </span>
        <button
          type="button"
          onClick={() => setSaved((s) => !s)}
          className="inline-flex items-center gap-1 hover:text-foreground"
          aria-pressed={saved}
        >
          <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-accent text-accent" : ""}`} />
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      {/* Actions */}
      <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2 border-t border-border bg-muted/30 px-3 py-3">
        <button
          type="button"
          onClick={() => onOffer(request)}
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-accent text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)] transition-transform active:scale-[0.98]"
        >
          <HandCoins className="h-4 w-4" />
          Offer vehicle
        </button>
        <button
          type="button"
          onClick={() => onCounter(request)}
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          aria-label="Counter offer"
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">Counter</span>
        </button>
        <button
          type="button"
          onClick={() => onViewProfile(request)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted"
          aria-label="View profile"
        >
          <UserCircle2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 ${
        accent ? "border-accent/30 bg-accent-soft" : "border-border bg-background"
      }`}
    >
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div
        className={`mt-0.5 text-sm font-semibold ${accent ? "text-accent" : "text-foreground"}`}
      >
        {value}
      </div>
    </div>
  );
}
