import { Car, Gauge, Star, UserRound, Wifi, WifiOff } from "lucide-react";
import type { Vehicle } from "@/lib/host-data";
import { VEHICLE_STATUS_LABEL } from "@/lib/host-data";
import { formatNaira, formatRelativeTime } from "@/lib/format";

type Props = {
  vehicle: Vehicle;
  onClick?: () => void;
};

const STATUS_TONE: Record<Vehicle["status"], string> = {
  available: "bg-success/15 text-success",
  rented: "bg-accent-soft text-accent",
  maintenance: "bg-warning/15 text-warning-foreground",
  draft: "bg-muted text-muted-foreground",
};

export function VehicleCard({ vehicle, onClick }: Props) {
  const periodLabel = vehicle.period === "week" ? "/wk" : "/mo";
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-border bg-card text-left shadow-[var(--shadow-card)] transition active:scale-[0.99]"
    >
      <div
        className="relative flex h-28 items-center justify-center overflow-hidden rounded-t-2xl"
        style={{
          background: `linear-gradient(135deg, oklch(0.55 0.15 ${vehicle.imageHue}), oklch(0.32 0.1 ${vehicle.imageHue}))`,
        }}
      >
        <Car className="h-14 w-14 text-white/85" />
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_TONE[vehicle.status]}`}
        >
          {VEHICLE_STATUS_LABEL[vehicle.status]}
        </span>
        {vehicle.telematics ? (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
            <Wifi className="h-3 w-3" /> Telematics
          </span>
        ) : (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
            <WifiOff className="h-3 w-3" /> No telematics
          </span>
        )}
      </div>

      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {vehicle.label} <span className="text-muted-foreground">{vehicle.year}</span>
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {vehicle.type} · {vehicle.color} · {vehicle.plate}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">{formatNaira(vehicle.basePrice)}</p>
            <p className="text-[10px] text-muted-foreground">{periodLabel}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Stat
            icon={<Star className="h-3 w-3" />}
            label={vehicle.rentalsCompleted > 0 ? vehicle.rating.toFixed(1) : "—"}
            sub="Rating"
          />
          <Stat
            icon={<Gauge className="h-3 w-3" />}
            label={`${vehicle.utilizationPct}%`}
            sub="Utilization"
          />
          <Stat
            icon={<UserRound className="h-3 w-3" />}
            label={vehicle.hasDriver ? "Yes" : "No"}
            sub="Driver"
          />
        </div>

        {vehicle.status === "rented" && vehicle.nextAvailable && (
          <p className="rounded-lg bg-muted px-2 py-1.5 text-[10px] text-muted-foreground">
            Free again in {formatRelativeTime(vehicle.nextAvailable).replace("ago", "")}
          </p>
        )}
      </div>
    </button>
  );
}

function Stat({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="rounded-lg bg-muted/60 px-2 py-1.5">
      <div className="flex items-center gap-1 text-foreground">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground">{sub}</p>
    </div>
  );
}
