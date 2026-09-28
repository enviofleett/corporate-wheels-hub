import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Armchair,
  CarFront,
  ListChecks,
  ShieldCheck,
  UsersRound,
  ChevronRight,
} from "lucide-react";
import type { ReactNode } from "react";
import { useOrgAdmin } from "@/lib/org-admin-store";
import { useRideState } from "@/lib/rides-data";
export const Route = createFileRoute("/org/events/$eventId")({ component: EventDashboard });
function EventDashboard() {
  const { eventId } = Route.useParams();
  const admin = useOrgAdmin();
  const s = useRideState();
  const event = admin.events.find((e) => e.id === eventId);
  if (!event)
    return (
      <main className="mx-auto max-w-2xl p-6">
        <p className="font-black">Event not found.</p>
        <Link to="/org/events" className="mt-3 inline-block text-sm font-bold text-primary">
          Back to events
        </Link>
      </main>
    );
  const rides = s.rides.filter((r) => r.eventId === eventId);
  const req = s.requests.filter((q) => rides.some((r) => r.id === q.rideId));
  const wait = s.waitlist.filter((w) => w.eventId === eventId && w.status === "active");
  const accepted = req.filter((q) => q.status === "accepted").length;
  const openSeats = rides.reduce((n, r) => n + r.seats, 0);
  return (
    <>
      <header className="bg-primary px-5 pb-7 pt-8 text-primary-foreground">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
            {event.status} Event
          </p>
          <h1 className="mt-1 text-2xl font-black">{event.name}</h1>
          <p className="mt-1 text-xs text-white/65">
            {event.date} · {event.city}
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-5 px-5 pt-5">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Metric i={<CarFront />} n={rides.length} l="Ride offers" />
          <Metric i={<UsersRound />} n={accepted} l="Passengers" />
          <Metric i={<Armchair />} n={openSeats} l="Open seats" />
          <Metric i={<ListChecks />} n={wait.length} l="Waitlisted" />
        </section>
        <section className="rounded-2xl border bg-card p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-bold">Safety & verification</p>
              <p className="text-xs text-muted-foreground">
                Driver approval and vehicle rules follow your organization policy.
              </p>
            </div>
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-sm font-bold">Event operations</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { label: "Rides", to: "/org/rides" },
              { label: "Drivers", to: "/org/driver-applications" },
              { label: "Passengers", to: "/org/members" },
              { label: "Waitlist", to: "/org/rides" },
              { label: "Safety & rules", to: "/org/policies" },
              { label: "Organization overview", to: "/org" },
            ].map((x) => (
              <Link
                key={x.label}
                to={x.to}
                className="flex items-center justify-between rounded-xl border bg-card p-4 text-left text-xs font-bold hover:border-primary"
              >
                <span>{x.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
function Metric({ i, n, l }: { i: ReactNode; n: number; l: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <span className="text-primary [&>svg]:h-5 [&>svg]:w-5">{i}</span>
      <p className="mt-3 text-2xl font-black">{n}</p>
      <p className="text-[10px] text-muted-foreground">{l}</p>
    </div>
  );
}
