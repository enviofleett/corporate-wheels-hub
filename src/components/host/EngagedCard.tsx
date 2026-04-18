import { ArrowRight, MapPin, Users } from "lucide-react";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import type { EngagedRequest } from "@/lib/host-data";
import { formatNaira, formatRelativeTime, formatDuration } from "@/lib/format";

const STATUS_TONE: Record<EngagedRequest["myStatus"], string> = {
  viewing: "bg-muted text-muted-foreground",
  offered: "bg-warning/15 text-warning-foreground",
  shortlisted: "bg-accent-soft text-accent",
  selected: "bg-success/15 text-success",
};

const STATUS_LABEL: Record<EngagedRequest["myStatus"], string> = {
  viewing: "Saved",
  offered: "Offered",
  shortlisted: "Shortlisted",
  selected: "Selected",
};

export function EngagedCard({ request }: { request: EngagedRequest }) {
  const periodLabel = request.period === "week" ? "/wk" : "/mo";
  return (
    <article className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <CompanyAvatar hue={request.hue} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{request.title}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {request.vehicleType} · ×{request.quantity}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_TONE[request.myStatus]}`}
            >
              {STATUS_LABEL[request.myStatus]}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatNaira(request.budget)}
              <span className="text-[10px] font-medium text-muted-foreground">{periodLabel}</span>
            </span>
            <span>{formatDuration(request.durationWeeks)}</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {request.location}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" /> {request.totalOffers} offers in
            </span>
            <span>{formatRelativeTime(request.postedAt)}</span>
          </div>

          <button
            type="button"
            className="mt-2 flex w-full items-center justify-center gap-1 rounded-full bg-primary px-3 py-2 text-[11px] font-semibold text-primary-foreground"
          >
            {request.myStatus === "viewing" ? "Send offer" : "View thread"}
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </article>
  );
}
