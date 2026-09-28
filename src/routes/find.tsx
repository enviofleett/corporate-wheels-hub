import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRideState } from "@/lib/rides-data";
import { RideCard } from "@/components/rides/RideCard";
import { useActiveEvent } from "@/lib/community-events";
import { useTenant } from "@/components/tenant/TenantProvider";
import { CommunityBottomNav } from "@/components/community/CommunityBottomNav";
export const Route = createFileRoute("/find")({ component: FindRide });
function FindRide() {
  const s = useRideState(),
    event = useActiveEvent(),
    tenant = useTenant();
  const [area, setArea] = useState("Gwarinpa"),
    [direction, setDirection] = useState<"outbound" | "return">("outbound");
  const available = s.rides.filter(
    (r) =>
      r.organizationId === tenant.id &&
      r.eventId === event.id &&
      r.direction === direction &&
      r.status === "open" &&
      r.seats > 0 &&
      (!area || r.from.toLowerCase().includes(area.toLowerCase())),
  );
  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <header className="border-b bg-background px-5 py-6">
        <div className="mx-auto max-w-md">
          <p className="text-[11px] font-bold uppercase text-muted-foreground">{event.name}</p>
          <h1 className="text-2xl font-bold">Find a Ride</h1>
        </div>
      </header>
      <main className="mx-auto max-w-md px-5 pt-4">
        <div className="rounded-2xl border bg-card p-4">
          <div className="mb-3 grid grid-cols-2 rounded-xl bg-muted p-1 text-xs font-bold">
            <button
              onClick={() => setDirection("outbound")}
              className={
                direction === "outbound"
                  ? "rounded-lg bg-background py-2 shadow-sm"
                  : "py-2 text-muted-foreground"
              }
            >
              To event
            </button>
            <button
              onClick={() => setDirection("return")}
              className={
                direction === "return"
                  ? "rounded-lg bg-background py-2 shadow-sm"
                  : "py-2 text-muted-foreground"
              }
            >
              Ride home
            </button>
          </div>
          <label className="text-[11px] font-bold text-muted-foreground">COMING FROM</label>
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border bg-background px-3 text-sm"
          />
          <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Search className="h-3 w-3" />
            Matches update as you type.
          </p>
        </div>
        <div className="mb-3 mt-6 flex justify-between">
          <h2 className="text-sm font-bold">Available rides</h2>
          <span className="text-xs font-bold">{available.length} found</span>
        </div>
        <div className="space-y-3">
          {available.map((r) => (
            <RideCard key={r.id} ride={r} />
          ))}
        </div>
        {available.length === 0 && (
          <div className="mt-5 rounded-2xl border border-dashed bg-card p-4 text-center">
            <p className="text-sm font-bold">No suitable ride yet</p>
            <Link to="/waitlist" className="mt-3 inline-block text-sm font-bold text-primary">
              Join waitlist
            </Link>
          </div>
        )}
      </main>
      <CommunityBottomNav />
    </div>
  );
}
