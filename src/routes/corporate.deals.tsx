// Corporate — Selected deals (post-acceptance).

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { listSelectedDeals, corporateMetrics } from "@/lib/corporate-data";
import type { SelectedDeal } from "@/lib/corporate-data";
import { CorporateTopBar } from "@/components/corporate/CorporateTopBar";
import { CorporateBottomNav } from "@/components/corporate/CorporateBottomNav";
import { DealCard } from "@/components/corporate/DealCard";
import { FundEscrowModal } from "@/components/payments/FundEscrowModal";
import { formatNaira, formatDuration } from "@/lib/format";
import { Wallet, ShieldCheck, Receipt } from "lucide-react";
import { withRole } from "@/components/auth/withRole";

export const Route = createFileRoute("/corporate/deals")({
  head: () => ({
    meta: [
      { title: "Selected deals — FleetLink" },
      { name: "description", content: "Active rental deals and escrow status." },
    ],
  }),
  component: withRole(["corporate"], DealsPage),
});

function DealsPage() {
  const deals = listSelectedDeals();
  const metrics = corporateMetrics();
  const [funding, setFunding] = useState<SelectedDeal | null>(null);

  const awaiting = deals.filter((d) => d.payment === "awaiting_funding");

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <CorporateTopBar title="Selected deals" subtitle={`${deals.length} active`} />

      <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
        {/* Escrow summary */}
        <section className="overflow-hidden rounded-2xl bg-primary p-4 text-primary-foreground shadow-[var(--shadow-elevated)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-white/70">
                Held in escrow
              </p>
              <p className="mt-1 text-2xl font-bold">{formatNaira(metrics.inEscrow)}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-white/70">
                <ShieldCheck className="h-3 w-3" />
                Released only after confirmed delivery
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Wallet className="h-5 w-5 text-accent" />
            </span>
          </div>
          <Link
            to="/payments/receipts"
            className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-white/10 py-2 text-[11px] font-semibold text-white hover:bg-white/15"
          >
            <Receipt className="h-3.5 w-3.5" />
            View receipts & history
          </Link>
        </section>

        {/* Awaiting funding banner */}
        {awaiting.length > 0 && (
          <section className="rounded-2xl border border-warning/40 bg-warning/10 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-warning-foreground">
              Action needed
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {awaiting.length} deal{awaiting.length === 1 ? "" : "s"} awaiting escrow funding
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Fund within 48 hours to confirm the booking.
            </p>
            <button
              type="button"
              onClick={() => setFunding(awaiting[0])}
              className="mt-2 flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground shadow-[var(--shadow-accent)]"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Fund now
            </button>
          </section>
        )}

        {deals.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm font-semibold text-foreground">No deals yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Accepted offers will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {deals.map((d) => (
              <div key={d.id} className="space-y-1.5">
                <DealCard deal={d} />
                {d.payment === "awaiting_funding" && (
                  <button
                    type="button"
                    onClick={() => setFunding(d)}
                    className="ml-auto flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[11px] font-semibold text-accent-foreground shadow-[var(--shadow-accent)]"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Fund escrow
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <CorporateBottomNav />

      {funding && (
        <FundEscrowModal
          open={!!funding}
          onOpenChange={(o) => !o && setFunding(null)}
          amount={funding.price * funding.durationWeeks}
          vehicleLabel={funding.vehicleLabel}
          hostHandle={funding.hostHandle}
          durationLabel={`${formatDuration(funding.durationWeeks)} contract`}
        />
      )}
    </div>
  );
}
