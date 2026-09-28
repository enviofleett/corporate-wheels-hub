import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  CarFront,
  UsersRound,
  Armchair,
  ListChecks,
  Palette,
  MapPin,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";
import { communityEvents } from "@/lib/community-events";
import { useRideState } from "@/lib/rides-data";
import { useTenant } from "@/components/tenant/TenantProvider";
import { useOrgAdmin } from "@/lib/org-admin-store";
export const Route = createFileRoute("/org/")({ component: OrgHome });
function OrgHome() {
  const s = useRideState();
  const tenant = useTenant();
  const admin = useOrgAdmin();
  const pendingDrivers = admin.driverApplications.filter((a) => a.status === "pending").length;
  const events = communityEvents.filter((e) => e.organizationId === tenant.id);
  const rides = s.rides.filter((r) => r.organizationId === tenant.id);
  const openRides = rides.filter((r) => ["open", "full"].includes(r.status));
  const seatsOpen = openRides.reduce((n, r) => n + r.seats, 0);
  const accepted = s.requests.filter(
    (q) => q.status === "accepted" && rides.some((r) => r.id === q.rideId),
  ).length;
  const pending = s.requests.filter(
    (q) => q.status === "pending" && rides.some((r) => r.id === q.rideId),
  ).length;
  const waitlist = s.waitlist.filter(
    (w) => w.organizationId === tenant.id && w.status === "active",
  ).length;
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-primary px-5 pb-8 pt-8 text-primary-foreground">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-white/60">
                Organization Console
              </p>
              <h1 className="mt-1 text-3xl font-black">{tenant.name}</h1>
              <p className="mt-1 text-sm text-white/70">
                Event travel operations and tenant homepage management
              </p>
            </div>
            <Link
              to="/org/branding"
              className="flex h-10 items-center gap-2 rounded-xl bg-white/10 px-4 text-xs font-bold hover:bg-white/15"
            >
              <Palette className="h-4 w-4" />
              Edit public homepage
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 px-5 py-6">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Metric icon={<CarFront />} n={openRides.length} l="Active ride offers" />
          <Metric icon={<Armchair />} n={seatsOpen} l="Seats available" />
          <Metric icon={<UsersRound />} n={accepted} l="Accepted passengers" />
          <Metric icon={<ListChecks />} n={pending + waitlist} l="Pending / waitlist" />
        </section>
        <section className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black">Travel by event</h2>
                <p className="text-xs text-muted-foreground">
                  Operational supply and demand across your events.
                </p>
              </div>
              <Link
                to="/org/events"
                className="flex items-center gap-1 text-xs font-bold text-primary"
              >
                Manage events <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {events.map((e) => {
                const er = rides.filter((r) => r.eventId === e.id);
                const ep = s.requests.filter((q) => er.some((r) => r.id === q.rideId));
                const ew = s.waitlist.filter((w) => w.eventId === e.id && w.status === "active");
                return (
                  <Link
                    key={e.id}
                    to="/org/events/$eventId"
                    params={{ eventId: e.id }}
                    className="block rounded-2xl border bg-card p-4 hover:border-primary"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                        <CalendarDays className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-black">{e.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {e.dateLabel} · {e.venue}
                            </p>
                          </div>
                          <span className="rounded-full bg-primary-soft px-2 py-1 text-[10px] font-bold text-primary">
                            {e.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-2">
                          <Mini n={er.length} l="Rides" />
                          <Mini n={er.reduce((n, r) => n + r.seats, 0)} l="Open seats" />
                          <Mini
                            n={ep.filter((q) => q.status === "accepted").length}
                            l="Passengers"
                          />
                          <Mini n={ew.length} l="Waitlist" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          <aside className="space-y-4">
            <section className="rounded-2xl border bg-card p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-sm font-black">Travel overview</h2>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <Row
                  label="Upcoming events"
                  value={events.filter((e) => e.status !== "completed").length}
                />
                <Row
                  label="Drivers offering rides"
                  value={new Set(rides.map((r) => r.driverId)).size}
                />
                <Row
                  label="Passenger requests"
                  value={s.requests.filter((q) => rides.some((r) => r.id === q.rideId)).length}
                />
                <Row label="Open seats" value={seatsOpen} />
              </div>
            </section>
            <Link
              to="/org/pickup-hubs"
              className="block rounded-2xl border bg-card p-4 hover:border-primary"
            >
              <MapPin className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-black">Pickup network</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Manage approved pickup hubs and review where event demand is concentrating.
              </p>
            </Link>
            <Link
              to="/org/driver-applications"
              className="block rounded-2xl border bg-card p-4 hover:border-primary"
            >
              <UsersRound className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-black">Driver approvals</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {pendingDrivers} application{pendingDrivers === 1 ? "" : "s"} waiting for review.
              </p>
            </Link>
            <Link
              to="/org/policies"
              className="block rounded-2xl border bg-card p-4 hover:border-primary"
            >
              <ListChecks className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-black">Policies & commission</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {admin.policy.commissionMode === "percentage"
                  ? `${admin.policy.commissionPercent}% organization commission`
                  : "No organization commission"}{" "}
                · approval and safety rules.
              </p>
            </Link>
            <Link
              to="/org/branding"
              className="block rounded-2xl border bg-card p-4 hover:border-primary"
            >
              <Palette className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-black">Homepage & branding</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Edit logo, colours, homepage literature and public support details.
              </p>
            </Link>
          </aside>
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
function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-black">{value}</span>
    </div>
  );
}
