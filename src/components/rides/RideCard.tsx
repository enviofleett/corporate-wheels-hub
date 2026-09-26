import { Link } from "@tanstack/react-router";
import { BadgeCheck, Clock3, MapPin, UsersRound } from "lucide-react";
import type { Ride } from "@/lib/rides-data";

export function RideCard({ ride }: { ride: Ride }) {
  return <Link to="/rides/$rideId" params={{rideId: ride.id}} className="block rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-transform active:scale-[.99]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="flex items-center gap-1 text-sm font-bold text-foreground">{ride.driver}{ride.verified && <BadgeCheck className="h-4 w-4 text-success" />}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{ride.vehicle}</p>
      </div>
      <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">{ride.seats} seat{ride.seats === 1 ? "" : "s"} left</span>
    </div>
    <div className="mt-4 space-y-2 text-sm">
      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary"/><span className="font-semibold">{ride.from}</span><span className="text-muted-foreground">→ {ride.to}</span></div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="h-4 w-4"/>{ride.date} · {ride.time}</div>
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
      <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><UsersRound className="h-3.5 w-3.5"/>Verified community ride</span>
      <span className="text-sm font-bold text-foreground">{ride.contribution ? `₦${ride.contribution.toLocaleString()}` : "Free"}</span>
    </div>
  </Link>;
}