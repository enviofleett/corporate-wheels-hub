// Negotiation detail — threaded timeline + actions.

import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import {
  getNegotiationById,
  getRequestForNegotiation,
  markRead,
  type Negotiation,
} from "@/lib/negotiations";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import { VerifiedBadge } from "@/components/feed/VerifiedBadge";
import { StatusBadge } from "@/components/feed/StatusBadge";
import { NegotiationTimeline } from "@/components/feed/NegotiationTimeline";
import { NegotiationActions } from "@/components/feed/NegotiationActions";
import { formatNaira, formatDuration } from "@/lib/format";

export const Route = createFileRoute("/offers/$negotiationId")({
  loader: ({ params }) => {
    const neg = getNegotiationById(params.negotiationId);
    if (!neg) throw notFound();
    return { negotiation: neg };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `Negotiation with ${loaderData.negotiation.hostHandle} — FleetLink`
          : "Negotiation — FleetLink",
      },
    ],
  }),
  component: NegotiationDetailPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-5 py-16 text-center">
      <h1 className="text-base font-semibold">Negotiation not found</h1>
      <Link to="/offers" className="mt-4 inline-block text-sm text-primary">
        Back to Offers
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-md px-5 py-16 text-center">
      <p className="text-sm text-destructive">Error: {error.message}</p>
      <Link to="/offers" className="mt-4 inline-block text-sm text-primary">
        Back to Offers
      </Link>
    </div>
  ),
});

function NegotiationDetailPage() {
  const { negotiation: initial } = Route.useLoaderData();
  const navigate = useNavigate();
  const [negotiation, setNegotiation] = useState<Negotiation>(initial);
  const req = getRequestForNegotiation(negotiation);

  // Force re-render after in-memory mutations.
  const refresh = () => {
    const updated = getNegotiationById(negotiation.id);
    if (updated) setNegotiation({ ...updated, timeline: [...updated.timeline] });
  };

  useEffect(() => {
    markRead(negotiation.id);
  }, [negotiation.id]);

  return (
    <div className="min-h-screen bg-muted/30 pb-32">
      {/* App bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-md items-center gap-2 px-5">
          <button
            type="button"
            onClick={() => navigate({ to: "/offers" })}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {req?.company.handle ?? "Corporate"}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {negotiation.hostHandle}
            </p>
          </div>
          <StatusBadge status={negotiation.status} size="md" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4">
        {/* Request summary */}
        {req && (
          <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-3">
              <CompanyAvatar hue={req.company.avatarHue} size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {req.company.handle}
                  </p>
                  <VerifiedBadge level={req.company.verification} />
                </div>
                <p className="truncate text-[11px] text-muted-foreground">
                  {req.company.industry}
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-muted/50 p-2.5 text-center">
              <Stat label="Vehicles" value={`${req.vehicle.quantity}× ${req.vehicle.type.split(" ")[0]}`} />
              <Stat
                label="Budget"
                value={`${formatNaira(req.budget.amount)}/${req.budget.period[0]}`}
              />
              <Stat label="Duration" value={formatDuration(req.durationWeeks)} />
            </div>
          </section>
        )}

        {/* Timeline */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Negotiation thread
          </h2>
          <NegotiationTimeline entries={negotiation.timeline} />
        </section>

        {/* Actions */}
        <NegotiationActions negotiation={negotiation} onChange={refresh} />

        <p className="px-2 text-center text-[11px] text-muted-foreground">
          Identities stay anonymous until both sides agree. All offers and counters are recorded.
        </p>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="truncate text-[11px] font-semibold text-foreground">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
