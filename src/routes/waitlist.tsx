import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BellRing, MapPin } from "lucide-react";
import { withRole } from "@/components/auth/withRole";
import { rideEngine, useRideState } from "@/lib/rides-data";
import { useActiveEvent } from "@/lib/community-events";
import { useTenant } from "@/components/tenant/TenantProvider";
import { CommunityBottomNav } from "@/components/community/CommunityBottomNav";
export const Route = createFileRoute("/waitlist")({
  component: withRole(["member", "organization_staff", "organization_admin"], Waitlist),
});
function Waitlist() {
  const s = useRideState(),
    event = useActiveEvent(),
    tenant = useTenant(),
    [area, setArea] = useState("Gwarinpa");
  const mine = s.waitlist.find(
    (w) => w.userId === "current-member" && w.eventId === event.id && w.status !== "cancelled",
  );
  const join = () =>
    rideEngine.joinWaitlist({
      organizationId: tenant.id,
      eventId: event.id,
      userId: "current-member",
      area,
      direction: "outbound",
    });
  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <main className="mx-auto flex min-h-[75vh] max-w-md flex-col items-center justify-center px-7 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <BellRing className="h-7 w-7" />
        </div>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[.14em] text-primary">
          {event.name}
        </p>
        <h1 className="mt-2 text-2xl font-black">
          {mine?.status === "matched"
            ? "A matching ride is available"
            : mine
              ? "You're on the waitlist"
              : "Join the ride waitlist"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We’ll match you when a compatible ride is published for this event.
        </p>
        <div className="mt-6 w-full rounded-2xl border bg-card p-4 text-left">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">
            Preferred pickup area
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border bg-background px-3">
            <MapPin className="h-4 w-4 text-primary" />
            <input
              disabled={!!mine}
              value={mine?.area ?? area}
              onChange={(e) => setArea(e.target.value)}
              className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none disabled:opacity-70"
            />
          </div>
        </div>
        {!mine && (
          <button
            onClick={join}
            className="mt-4 h-12 w-full rounded-2xl bg-primary text-sm font-bold text-primary-foreground"
          >
            Join waitlist
          </button>
        )}
        <Link to="/find" className="mt-4 text-xs font-bold text-muted-foreground">
          Back to ride search
        </Link>
      </main>
      <CommunityBottomNav />
    </div>
  );
}
