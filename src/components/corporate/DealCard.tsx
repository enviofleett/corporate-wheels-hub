import { Calendar, Gauge, CircleDollarSign } from "lucide-react";
import type { SelectedDeal } from "@/lib/corporate-data";
import { PAYMENT_LABEL } from "@/lib/corporate-data";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import { formatNaira, formatDuration } from "@/lib/format";

const PAYMENT_CLASS: Record<SelectedDeal["payment"], string> = {
  awaiting_funding: "bg-warning/15 text-warning-foreground border-warning/30",
  funded: "bg-primary/10 text-primary border-primary/20",
  in_escrow: "bg-success/15 text-success border-success/30",
  released: "bg-muted text-muted-foreground border-border",
  failed: "bg-destructive/10 text-destructive border-destructive/25",
};

export function DealCard({ deal }: { deal: SelectedDeal }) {
  const start = new Date(deal.startDate);
  const startLabel = start.toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3 px-4 pt-3.5">
        <CompanyAvatar hue={deal.hostHue} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {deal.vehicleLabel}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            with {deal.hostHandle}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${PAYMENT_CLASS[deal.payment]}`}
        >
          {PAYMENT_LABEL[deal.payment]}
        </span>
      </div>

      <div className="mx-4 mt-3 grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-2 text-center">
        <Stat
          icon={<CircleDollarSign className="h-3 w-3" />}
          value={formatNaira(deal.price)}
          label={`/ ${deal.period}`}
        />
        <Stat
          icon={<Calendar className="h-3 w-3" />}
          value={startLabel}
          label="Start date"
        />
        <Stat
          icon={<Gauge className="h-3 w-3" />}
          value={deal.telematics === "active" ? "Active" : "Pending"}
          label="Telematics"
        />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground">
        <span>{formatDuration(deal.durationWeeks)} contract</span>
        <button
          type="button"
          className="font-semibold text-primary hover:underline"
        >
          Manage →
        </button>
      </div>
    </article>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div>
      <span className="inline-flex items-center gap-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        {icon}
      </span>
      <p className="truncate text-xs font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
