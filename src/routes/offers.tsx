// Offers inbox — lists negotiations relevant to the active role.

import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Inbox } from "lucide-react";
import { listNegotiations, getRequestForNegotiation } from "@/lib/negotiations";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import { StatusBadge } from "@/components/feed/StatusBadge";
import { formatNaira, formatRelativeTime } from "@/lib/format";
import { BottomNav } from "@/components/feed/BottomNav";
import { withRole } from "@/components/auth/withRole";
import { useRole } from "@/lib/role-store";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers — FleetLink" },
      {
        name: "description",
        content: "Your active offer threads with anonymous corporate clients.",
      },
    ],
  }),
  component: withRole(["corporate", "host", "admin"], OffersPage),
});

function OffersPage() {
  const role = useRole();
  const negotiations = listNegotiations(role ?? undefined);

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-md items-center gap-2 px-5">
          <Link
            to="/feed"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold text-foreground">Offers</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-5 pt-4">
        {negotiations.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-2">
            {negotiations.map((n) => {
              const req = getRequestForNegotiation(n);
              const last = n.timeline[n.timeline.length - 1];
              return (
                <li key={n.id}>
                  <Link
                    to="/offers/$negotiationId"
                    params={{ negotiationId: n.id }}
                    className="block rounded-2xl border border-border bg-card p-3.5 shadow-[var(--shadow-card)] transition-colors active:bg-muted/40"
                  >
                    <div className="flex items-center gap-3">
                      {req && (
                        <CompanyAvatar hue={req.company.avatarHue} />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {req?.company.handle ?? "Corporate"}
                          </p>
                          {n.unread && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                          )}
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {req?.vehicle.quantity}× {req?.vehicle.type} · {req?.location}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <StatusBadge status={n.status} size="md" />
                      <div className="text-right">
                        {last && (
                          <p className="text-sm font-bold text-foreground">
                            {formatNaira(last.price)}
                            <span className="text-[10px] font-normal text-muted-foreground">
                              {" "}
                              / {last.period}
                            </span>
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground">
                          {formatRelativeTime(n.lastActivityAt)} ago
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Inbox className="h-5 w-5" />
      </div>
      <h2 className="mt-3 text-sm font-semibold text-foreground">No offers yet</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Your offer threads will show up here.
      </p>
      <Link
        to="/feed"
        className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-accent px-5 text-xs font-semibold text-accent-foreground shadow-[var(--shadow-accent)]"
      >
        Browse requests
      </Link>
    </div>
  );
}
