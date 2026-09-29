import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, MapPin, ShieldAlert, ArrowLeft } from "lucide-react";
import { withRole } from "@/components/auth/withRole";
import { rideEngine, useRideState, type RideStatus } from "@/lib/rides-data";
import { CommunityBottomNav } from "@/components/community/CommunityBottomNav";
export const Route = createFileRoute("/trip/$rideId")({
  component: withRole(["member", "organization_staff", "organization_admin"], Trip),
});
function Trip() {
  const { rideId } = Route.useParams();
  const s = useRideState();
  const ride = s.rides.find((r) => r.id === rideId);
  if (!ride)
    return (
      <main className="mx-auto max-w-md p-6">
        <p className="font-black">Ride not found.</p>
        <Link to="/rides" className="mt-3 inline-block text-sm font-bold text-primary">
          Back to My Rides
        </Link>
      </main>
    );
  const passengers = s.requests.filter((r) => r.rideId === ride.id && r.status === "accepted");
  const advance = () => {
    const next: Partial<Record<RideStatus, RideStatus>> = {
      open: "boarding",
      full: "boarding",
      boarding: "active",
      active: "completed",
    };
    const n = next[ride.status];
    if (n) rideEngine.setRideStatus(ride.id, n);
  };
  const label =
    ride.status === "open" || ride.status === "full"
      ? "Start boarding"
      : ride.status === "boarding"
        ? "Start ride"
        : ride.status === "active"
          ? "Confirm arrival & complete"
          : "Ride completed";
  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <header className="bg-primary px-5 pb-7 pt-6 text-primary-foreground">
        <div className="mx-auto max-w-md">
          <Link
            to="/rides"
            className="mb-4 flex items-center gap-2 text-xs font-bold text-white/70"
          >
            <ArrowLeft className="h-4 w-4" />
            My Rides
          </Link>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase">
            {ride.status} · driver view
          </span>
          <h1 className="mt-4 text-2xl font-black">
            {ride.from} → {ride.to}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm opacity-70">
            <Clock3 className="h-4 w-4" />
            Departure {ride.time}
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-md space-y-4 px-5 pt-5">
        <section className="rounded-2xl border bg-card p-4">
          <p className="flex gap-2 text-sm font-bold">
            <MapPin className="h-5 w-5 text-primary" />
            Meeting point
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{ride.meetingPoint || ride.from}</p>
        </section>
        <section className="rounded-2xl border bg-card p-4">
          <p className="mb-3 text-sm font-bold">Passenger check-in</p>
          {passengers.map((p) => (
            <div key={p.id} className="flex items-center gap-3 border-t py-3 first:border-0">
              <p className="flex-1 text-sm font-semibold">{p.name}</p>
              {s.checkins[p.passengerId] ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  Here
                </span>
              ) : (
                <button
                  onClick={() => rideEngine.checkIn(p.passengerId)}
                  className="rounded-lg border px-2 py-1 text-[10px] font-bold"
                >
                  Mark here
                </button>
              )}
            </div>
          ))}
          {passengers.length === 0 && (
            <p className="text-xs text-muted-foreground">No accepted passengers yet.</p>
          )}
        </section>
        <button
          disabled={ride.status === "completed" || ride.status === "cancelled"}
          onClick={advance}
          className="h-12 w-full rounded-2xl bg-accent text-sm font-bold text-accent-foreground disabled:opacity-50"
        >
          {label}
        </button>
        {["open", "full", "boarding"].includes(ride.status) && (
          <button
            onClick={() => rideEngine.cancelRide(ride.id)}
            className="w-full py-2 text-xs font-bold text-destructive"
          >
            Cancel ride
          </button>
        )}
        <button className="flex w-full items-center justify-center gap-2 py-2 text-xs font-bold text-destructive">
          <ShieldAlert className="h-4 w-4" />
          Report a safety issue
        </button>
      </main>
      <CommunityBottomNav />
    </div>
  );
}
