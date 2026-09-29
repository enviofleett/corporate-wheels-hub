import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Check, MapPin, X } from "lucide-react";
import { withRole } from "@/components/auth/withRole";
import { rideEngine, useRideState } from "@/lib/rides-data";
import { CommunityBottomNav } from "@/components/community/CommunityBottomNav";
export const Route = createFileRoute("/ride-requests_/$rideId")({
  component: withRole(["member", "organization_staff", "organization_admin"], Requests),
});
function Requests() {
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
  const people = s.requests.filter((r) => r.rideId === rideId && r.status !== "cancelled");
  const decide = (id: string, a: boolean) => {
    try {
      rideEngine.decide(id, a);
    } catch (e) {
      alert((e as Error).message);
    }
  };
  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <header className="border-b bg-background px-5 py-6">
        <div className="mx-auto max-w-md">
          <Link
            to="/rides"
            className="mb-4 flex items-center gap-2 text-xs font-bold text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            My Rides
          </Link>
          <p className="text-[11px] font-bold uppercase text-muted-foreground">
            {ride.from} → {ride.to} · {ride.time}
          </p>
          <h1 className="text-2xl font-bold">Seat Requests</h1>
          <p className="mt-1 text-xs text-muted-foreground">{ride.seats} seats currently open</p>
        </div>
      </header>
      <main className="mx-auto max-w-md space-y-3 px-5 pt-4">
        {people.map((p) => (
          <div key={p.id} className="rounded-2xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft font-black text-primary">
                {p.name[0]}
              </div>
              <div className="flex-1">
                <p className="flex items-center gap-1 text-sm font-bold">
                  {p.name}
                  <BadgeCheck className="h-4 w-4 text-success" />
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {p.area}
                </p>
              </div>
              <span className="text-[10px] font-bold capitalize">{p.status}</span>
            </div>
            {p.status === "pending" && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => decide(p.id, false)}
                  className="h-10 rounded-xl border text-xs font-bold"
                >
                  <X className="mr-1 inline h-4 w-4" />
                  Decline
                </button>
                <button
                  onClick={() => decide(p.id, true)}
                  className="h-10 rounded-xl bg-primary text-xs font-bold text-primary-foreground"
                >
                  <Check className="mr-1 inline h-4 w-4" />
                  Accept
                </button>
              </div>
            )}
          </div>
        ))}
        {people.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-card p-6 text-center">
            <p className="text-sm font-bold">No seat requests yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Passenger interest for this ride will appear here.
            </p>
          </div>
        )}
      </main>
      <CommunityBottomNav />
    </div>
  );
}
