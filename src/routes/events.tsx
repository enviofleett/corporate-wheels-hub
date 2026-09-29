import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, MapPin, Compass } from "lucide-react";
import { communityEvents, eventStore, useActiveEvent } from "@/lib/community-events";
import { useTenant } from "@/components/tenant/TenantProvider";
import { CommunityBottomNav } from "@/components/community/CommunityBottomNav";
import { useOrgHomepageConfig } from "@/lib/org-homepage-store";

export const Route = createFileRoute("/events")({ component: Events });

function Events() {
  const active = useActiveEvent();
  const nav = useNavigate();
  const tenant = useTenant();
  const config = useOrgHomepageConfig(tenant.id);

  const select = (id: string) => {
    eventStore.select(id);
    nav({ to: "/event/$eventId", params: { eventId: id } });
  };

  const groups = [
    [
      "Upcoming Events",
      communityEvents.filter((e) => e.organizationId === tenant.id && e.status === "carpool_open"),
    ],
    [
      "Later",
      communityEvents.filter((e) => e.organizationId === tenant.id && e.status === "published"),
    ],
    [
      "Past Events",
      communityEvents.filter((e) => e.organizationId === tenant.id && e.status === "completed"),
    ],
  ] as const;

  return (
    <div className="min-h-screen bg-muted/10 pb-24 text-foreground font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-md">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-black leading-tight">Explore</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
              {config.portalName} Events
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-8 px-4 pt-6">
        {groups.map(
          ([title, items]) =>
            items.length > 0 && (
              <section key={title}>
                <h2 className="mb-4 text-sm font-bold text-muted-foreground">{title}</h2>
                <div className="space-y-4">
                  {items.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => select(e.id)}
                      className={`group flex w-full flex-col overflow-hidden rounded-3xl border bg-background text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                        active.id === e.id
                          ? "border-primary ring-2 ring-primary/20 shadow-md"
                          : "border-border shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                      }`}
                    >
                      {/* Event Banner Image (Square format as requested) */}
                      {e.status === "carpool_open" && e.bannerUrl && (
                        <div className="relative aspect-square w-full overflow-hidden bg-muted">
                          <img
                            src={e.bannerUrl}
                            alt={e.name}
                            className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 text-white">
                            <span className="rounded-full bg-background/95 backdrop-blur px-3 py-1.5 text-[11px] font-black text-foreground shadow-sm">
                              {e.seatsAvailable > 0 ? `${e.seatsAvailable} seats left` : "Rides Open"}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex w-full items-start gap-4 p-4 sm:p-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <CalendarDays className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-base font-black text-foreground">{e.name}</span>
                          <span className="mt-1 block text-xs font-semibold text-muted-foreground">
                            {e.dateLabel}
                          </span>
                          <span className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate">{e.venue}</span>
                          </span>
                          
                          {/* Status Footer */}
                          <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
                            <span className="text-[11px] font-black text-primary">
                              {e.status === "carpool_open"
                                ? `${e.rides} active rides`
                                : e.arrivalLabel}
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ),
        )}
      </main>
      <CommunityBottomNav />
    </div>
  );
}
