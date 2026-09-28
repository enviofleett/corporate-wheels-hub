import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarPlus, ChevronRight, MapPin } from "lucide-react";
import { useOrgAdmin } from "@/lib/org-admin-store";
import { useRideState } from "@/lib/rides-data";

export const Route = createFileRoute("/org/events")({ component: Events });

function Events() {
  const state = useOrgAdmin();
  const rideState = useRideState();

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background px-5 py-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-muted-foreground">Organization</p>
            <h1 className="text-2xl font-black">Events</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Create and manage the events visible to your community.
            </p>
          </div>
          <Link
            to="/org/events/new"
            className="flex h-10 items-center gap-2 rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground"
          >
            <CalendarPlus className="h-4 w-4" />
            New event
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-3 px-5 pt-4">
        {state.events.map((event) => {
          const rides = rideState.rides.filter((ride) => ride.eventId === event.id);
          const rideIds = new Set(rides.map((ride) => ride.id));
          const confirmedBookings = rideState.requests.filter(
            (request) => rideIds.has(request.rideId) && request.status === "accepted",
          );

          return (
            <Link
              key={event.id}
              to="/org/events/$eventId"
              params={{ eventId: event.id }}
              className="block rounded-2xl border bg-card p-4 transition-colors hover:border-primary"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold">{event.name}</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold">
                      {event.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{event.date}</p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.venue} · {event.city}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {event.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Drivers</p>
                  <p className="font-bold">{rides.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Seats booked</p>
                  <p className="font-bold">{confirmedBookings.length}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </main>
    </div>
  );
}
