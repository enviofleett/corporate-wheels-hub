// Corporate — Selected deals (post-acceptance).

import { createFileRoute } from "@tanstack/react-router";
import { listSelectedDeals, corporateMetrics } from "@/lib/corporate-data";
import { CorporateTopBar } from "@/components/corporate/CorporateTopBar";
import { CorporateBottomNav } from "@/components/corporate/CorporateBottomNav";
import { DealCard } from "@/components/corporate/DealCard";
import { formatNaira } from "@/lib/format";
import { Wallet, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/corporate/deals")({
  head: () => ({
    meta: [
      { title: "Selected deals — FleetLink" },
      { name: "description", content: "Active rental deals and escrow status." },
    ],
  }),
  component: DealsPage,
});

function DealsPage() {
  const deals = listSelectedDeals();
  const metrics = corporateMetrics();

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
        </section>

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
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
        )}
      </main>

      <CorporateBottomNav />
    </div>
  );
}
