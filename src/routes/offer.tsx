import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { withRole } from "@/components/auth/withRole";
import { useState } from "react";
import { rideEngine, type Direction } from "@/lib/rides-data";
import { useActiveEvent } from "@/lib/community-events";
import { useTenant } from "@/components/tenant/TenantProvider";
import { useOrgAdmin } from "@/lib/org-admin-store";
import { CommunityBottomNav } from "@/components/community/CommunityBottomNav";
export const Route = createFileRoute("/offer")({
  component: withRole(["member", "organization_staff", "organization_admin"], Offer),
});
function Offer() {
  const nav = useNavigate(),
    event = useActiveEvent(),
    tenant = useTenant(),
    admin = useOrgAdmin();
  const approved = admin.driverApplications.some(
    (a) => a.userId === "current-member" && a.status === "approved",
  );
  const [from, setFrom] = useState("Gwarinpa"),
    [seats, setSeats] = useState(3),
    [direction, setDirection] = useState<Direction>("outbound"),
    [contribution, setContribution] = useState(admin.policy.allowContributions ? 1500 : 0);
  const publish = () => {
    const r = rideEngine.publish({
      organizationId: tenant.id,
      eventId: event.id,
      from,
      to: direction === "outbound" ? event.name : "Gwarinpa",
      time: "7:00 AM",
      date: "Sat, 12 Dec",
      driver: "You",
      driverId: "current-member",
      vehicle: "Toyota Corolla · Silver",
      seats,
      seatsTotal: seats,
      contribution,
      verified: true,
      direction,
      meetingPoint: "H-Medix, 3rd Avenue, Gwarinpa",
    });
    nav({ to: "/rides/$rideId", params: { rideId: r.id } });
  };
  if (admin.policy.requireDriverApproval && !approved)
    return (
      <div className="min-h-screen bg-muted/30 pb-24">
        <main className="mx-auto max-w-md px-5 py-12 text-center">
          <h1 className="text-2xl font-black">Driver approval required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your organization requires approved driver and vehicle details before you can offer
            rides.
          </p>
          <button
            onClick={() => nav({ to: "/profile" })}
            className="mt-6 h-11 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
          >
            Go to Profile
          </button>
        </main>
        <CommunityBottomNav />
      </div>
    );
  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <header className="border-b bg-background px-5 py-6">
        <div className="mx-auto max-w-md">
          <p className="text-[11px] font-bold uppercase text-muted-foreground">{event.name}</p>
          <h1 className="text-2xl font-bold">Offer a Ride</h1>
        </div>
      </header>
      <main className="mx-auto max-w-md space-y-4 px-5 pt-4">
        <div className="grid grid-cols-2 rounded-xl bg-muted p-1 text-xs font-bold">
          <button
            onClick={() => setDirection("outbound")}
            className={
              direction === "outbound" ? "rounded-lg bg-background py-2 shadow-sm" : "py-2"
            }
          >
            To event
          </button>
          <button
            onClick={() => setDirection("return")}
            className={direction === "return" ? "rounded-lg bg-background py-2 shadow-sm" : "py-2"}
          >
            Ride home
          </button>
        </div>
        <label className="block text-xs font-bold">
          Origin area
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 h-11 w-full rounded-xl border px-3 font-normal"
          />
        </label>
        <div>
          <p className="mb-2 text-xs font-bold">Available seats</p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                onClick={() => setSeats(n)}
                key={n}
                className={`h-11 rounded-xl border text-sm font-bold ${seats === n ? "bg-primary text-primary-foreground" : ""}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <label className="block text-xs font-bold">
          Contribution per seat
          <input
            disabled={!admin.policy.allowContributions}
            type="number"
            value={admin.policy.allowContributions ? contribution : 0}
            onChange={(e) => setContribution(Number(e.target.value))}
            className="mt-1 h-11 w-full rounded-xl border px-3 font-normal disabled:bg-muted disabled:text-muted-foreground"
          />
        </label>
        {admin.policy.allowContributions && admin.policy.commissionMode === "percentage" && (
          <p className="rounded-xl bg-muted/50 p-3 text-[11px] leading-5 text-muted-foreground">
            Your organization retains {admin.policy.commissionPercent}% of passenger contributions.
            You receive the remaining {100 - admin.policy.commissionPercent}%.
          </p>
        )}
        {!admin.policy.allowContributions && (
          <p className="rounded-xl bg-muted/50 p-3 text-[11px] text-muted-foreground">
            This organization has disabled passenger contributions. Your ride will be listed as
            free.
          </p>
        )}
        <button
          onClick={publish}
          className="h-12 w-full rounded-2xl bg-accent text-sm font-bold text-accent-foreground"
        >
          Publish Ride
        </button>
        <p className="text-center text-[11px] text-muted-foreground">
          Your exact pickup point remains private until a request is accepted.
        </p>
      </main>
      <CommunityBottomNav />
    </div>
  );
}
