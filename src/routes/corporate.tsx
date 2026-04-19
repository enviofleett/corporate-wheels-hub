// Corporate Dashboard — overview/home.

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ListChecks,
  Inbox,
  Handshake,
  Wallet,
  ArrowRight,
  Plus,
} from "lucide-react";
import {
  corporateMetrics,
  listCorpRequests,
  listIncomingOffers,
  listSelectedDeals,
} from "@/lib/corporate-data";
import { CorporateTopBar } from "@/components/corporate/CorporateTopBar";
import { CorporateBottomNav } from "@/components/corporate/CorporateBottomNav";
import { MetricCard } from "@/components/corporate/MetricCard";
import { RequestSummaryCard } from "@/components/corporate/RequestSummaryCard";
import { IncomingOfferCard } from "@/components/corporate/IncomingOfferCard";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/corporate")({
  head: () => ({
    meta: [
      { title: "Corporate dashboard — FleetLink" },
      {
        name: "description",
        content:
          "Manage active vehicle requests, review incoming offers, and track selected deals.",
      },
    ],
  }),
  component: CorporateHome,
});

function CorporateHome() {
  const metrics = corporateMetrics();
  const requests = listCorpRequests().filter((r) => r.status !== "draft").slice(0, 2);
  const offers = listIncomingOffers().slice(0, 2);
  const deals = listSelectedDeals().slice(0, 1);

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <CorporateTopBar
        title="Hi, FinTech Group"
        subtitle="Here's what's happening with your fleet today."
      />

      <main className="mx-auto w-full max-w-md space-y-5 px-5 pt-4">
        {/* Metrics */}
        <section className="grid grid-cols-2 gap-2">
          <MetricCard
            label="Active requests"
            value={String(metrics.activeRequests)}
            hint="Live + negotiating"
            icon={<ListChecks className="h-4 w-4" />}
            tone="primary"
          />
          <MetricCard
            label="New offers"
            value={String(metrics.newOffers)}
            hint="Awaiting your review"
            icon={<Inbox className="h-4 w-4" />}
            tone="accent"
          />
          <MetricCard
            label="Active deals"
            value={String(metrics.activeDeals)}
            hint="In contract"
            icon={<Handshake className="h-4 w-4" />}
            tone="success"
          />
          <MetricCard
            label="In escrow"
            value={formatNaira(metrics.inEscrow)}
            hint="Funds protected"
            icon={<Wallet className="h-4 w-4" />}
            tone="primary"
          />
        </section>

        {/* CTA */}
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)]"
        >
          <Plus className="h-4 w-4" />
          Post a new request
        </button>

        {/* Active requests */}
        <SectionHeader title="Active requests" to="/corporate/requests" />
        <div className="space-y-2">
          {requests.map((r) => (
            <RequestSummaryCard key={r.id} request={r} />
          ))}
        </div>

        {/* Incoming offers preview */}
        <SectionHeader title="Latest offers" to="/corporate/offers" />
        <div className="space-y-2">
          {offers.map((o) => (
            <IncomingOfferCard key={o.id} offer={o} />
          ))}
        </div>

        {/* Deals */}
        {deals.length > 0 && (
          <>
            <SectionHeader title="Selected deals" to="/corporate/deals" />
            <div className="space-y-2">
              {deals.map((d) => (
                <DealMini key={d.id} hostHandle={d.hostHandle} vehicle={d.vehicleLabel} amount={d.price} period={d.period} />
              ))}
            </div>
          </>
        )}

        {/* Trust & Safety entry */}
        <Link
          to="/trust"
          className="mt-2 flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Trust &amp; Safety</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Verification, disputes, and reviews
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </main>

      <CorporateBottomNav unreadOffers={metrics.newOffers} />
    </div>
  );
}

function SectionHeader({
  title,
  to,
}: {
  title: string;
  to: "/corporate/requests" | "/corporate/offers" | "/corporate/deals" | "/trust";
}) {
  return (
    <div className="flex items-center justify-between pt-1">
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      <Link
        to={to}
        className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline"
      >
        View all <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function DealMini({
  hostHandle,
  vehicle,
  amount,
  period,
}: {
  hostHandle: string;
  vehicle: string;
  amount: number;
  period: "week" | "month";
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-[var(--shadow-card)]">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{vehicle}</p>
        <p className="truncate text-[11px] text-muted-foreground">with {hostHandle}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-foreground">{formatNaira(amount)}</p>
        <p className="text-[10px] text-muted-foreground">/ {period}</p>
      </div>
    </div>
  );
}
