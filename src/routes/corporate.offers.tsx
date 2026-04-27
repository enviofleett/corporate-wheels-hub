// Corporate — Incoming Offers list (across all requests).

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  listIncomingOffers,
  listCorpRequests,
  type IncomingOffer,
} from "@/lib/corporate-data";
import { CorporateTopBar } from "@/components/corporate/CorporateTopBar";
import { CorporateBottomNav } from "@/components/corporate/CorporateBottomNav";
import { IncomingOfferCard } from "@/components/corporate/IncomingOfferCard";
import { withRole } from "@/components/auth/withRole";

export const Route = createFileRoute("/corporate/offers")({
  head: () => ({
    meta: [
      { title: "Incoming offers — FleetLink" },
      {
        name: "description",
        content: "Review offers from anonymous hosts on your active requests.",
      },
    ],
  }),
  component: withRole(["corporate"], OffersInboxPage),
});

function OffersInboxPage() {
  const offers = listIncomingOffers();
  const requests = listCorpRequests();
  const [requestFilter, setRequestFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | IncomingOffer["status"]>(
    "all",
  );

  const filtered = offers.filter((o) => {
    if (requestFilter !== "all" && o.requestId !== requestFilter) return false;
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <CorporateTopBar
        title="Incoming offers"
        subtitle={`${offers.length} from anonymous hosts`}
      />

      <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={requestFilter}
            onChange={(e) => setRequestFilter(e.target.value)}
            className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-xs text-foreground"
          >
            <option value="all">All requests</option>
            {requests.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | IncomingOffer["status"])
            }
            className="h-10 rounded-xl border border-input bg-background px-3 text-xs text-foreground"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm font-semibold text-foreground">No offers match</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting the filters above.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((o) => (
              <IncomingOfferCard key={o.id} offer={o} />
            ))}
          </div>
        )}
      </main>

      <CorporateBottomNav unreadOffers={offers.filter((o) => o.status === "new").length} />
    </div>
  );
}
