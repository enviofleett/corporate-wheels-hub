import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  CalendarDays,
  CarFront,
  Clock3,
  MapPin,
  UsersRound,
  Armchair,
  Filter,
  ChevronRight,
} from "lucide-react";
import { useRideState } from "@/lib/rides-data";
import { communityEvents } from "@/lib/community-events";
import { useTenant } from "@/components/tenant/TenantProvider";
export const Route = createFileRoute("/org/rides")({ component: OrgRides });
type FilterMode = "all" | "open" | "full" | "active" | "completed" | "cancelled";
function OrgRides() {
  const s = useRideState();
  const tenant = useTenant();
  const [eventId, setEventId] = useState("all");
  const [status, setStatus] = useState<FilterMode>("all");
  const rides = useMemo(
    () =>
      s.rides.filter(
        (r) =>
          r.organizationId === tenant.id &&
          (eventId === "all" || r.eventId === eventId) &&
          (status === "all" || r.status === status),
      ),
    [s.rides, eventId, status],
  );
  const totalSeats = rides.reduce((n, r) => n + r.seats, 0);
  const interested = rides.reduce(
    (n, r) => n + s.requests.filter((q) => q.rideId === r.id && q.status === "pending").length,
    0,
  );
  const accepted = rides.reduce(
    (n, r) => n + s.requests.filter((q) => q.rideId === r.id && q.status === "accepted").length,
    0,
  );
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background px-5 py-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-primary">
            Organization rides
          </p>
          <h1 className="mt-1 text-2xl font-black">Ride operations</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Monitor ride offers, passenger interest, seats and pickup points across events.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-5 px-5 py-5">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Metric icon={<CarFront />} n={rides.length} l="Ride offers" />
          <Metric icon={<Armchair />} n={totalSeats} l="Open seats" />
          <Metric icon={<UsersRound />} n={interested} l="Interested" />
          <Metric icon={<UsersRound />} n={accepted} l="Accepted" />
        </section>
        <section className="rounded-2xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-black">
            <Filter className="h-4 w-4 text-primary" />
            Filters
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">
              Event
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border bg-background px-3 text-sm font-medium text-foreground"
              >
                <option value="all">All events</option>
                {communityEvents
                  .filter((e) => e.organizationId === tenant.id)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="text-[10px] font-bold uppercase text-muted-foreground">
              Ride status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FilterMode)}
                className="mt-1 h-11 w-full rounded-xl border bg-background px-3 text-sm font-medium text-foreground"
              >
                {["all", "open", "full", "active", "completed", "cancelled"].map((x) => (
                  <option key={x} value={x}>
                    {x === "all" ? "All statuses" : x}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>
        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-black">Ride offers</h2>
              <p className="text-xs text-muted-foreground">
                {rides.length} result{rides.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {rides.map((r) => {
              const event = communityEvents.find((e) => e.id === r.eventId);
              const pending = s.requests.filter(
                (q) => q.rideId === r.id && q.status === "pending",
              ).length;
              const accepted = s.requests.filter(
                (q) => q.rideId === r.id && q.status === "accepted",
              ).length;
              return (
                <Link
                  key={r.id}
                  to="/rides/$rideId"
                  params={{ rideId: r.id }}
                  className="block rounded-2xl border bg-card p-4 transition hover:border-primary"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <CarFront className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-black">{r.driver}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{r.vehicle}</p>
                        </div>
                        <span className="rounded-full bg-primary-soft px-2 py-1 text-[10px] font-bold capitalize text-primary">
                          {r.status}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
                        <p className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {event?.name ?? r.eventId}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock3 className="h-3.5 w-3.5" />
                          {r.date} · {r.time}
                        </p>
                        <p className="flex items-center gap-2 sm:col-span-2">
                          <MapPin className="h-3.5 w-3.5" />
                          {r.meetingPoint || r.from}
                        </p>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <Mini n={r.seats} l="Seats open" />
                        <Mini n={pending} l="Interested" />
                        <Mini n={accepted} l="Accepted" />
                      </div>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </Link>
              );
            })}
            {rides.length === 0 && (
              <div className="rounded-2xl border border-dashed bg-card p-8 text-center">
                <CarFront className="mx-auto h-7 w-7 text-muted-foreground" />
                <p className="mt-3 text-sm font-black">No ride offers match these filters</p>
                <p className="mt-1 text-xs text-muted-foreground">Try another event or status.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
function Metric({ icon, n, l }: { icon: ReactNode; n: number; l: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      <p className="mt-3 text-2xl font-black">{n}</p>
      <p className="text-[10px] text-muted-foreground">{l}</p>
    </div>
  );
}
function Mini({ n, l }: { n: number; l: string }) {
  return (
    <div className="rounded-xl bg-muted/55 p-2">
      <p className="text-sm font-black">{n}</p>
      <p className="mt-0.5 text-[9px] text-muted-foreground">{l}</p>
    </div>
  );
}
