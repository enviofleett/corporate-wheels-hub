import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownToLine, Info, ShieldCheck, Receipt } from "lucide-react";
import { HostTopBar } from "@/components/host/HostTopBar";
import { EarningsRow } from "@/components/host/EarningsRow";
import { EarningsChart } from "@/components/host/EarningsChart";
import { PayoutModal } from "@/components/payments/PayoutModal";
import { hostMetrics, listEarnings } from "@/lib/host-data";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/host/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings — FleetLink" },
      { name: "description", content: "Track your rental earnings and payouts." },
    ],
  }),
  component: EarningsPage,
});

const TREND = [
  { label: "W1", value: 280 },
  { label: "W2", value: 430 },
  { label: "W3", value: 600 },
  { label: "W4", value: 580 },
  { label: "W5", value: 600 },
  { label: "W6", value: 625 },
];

function EarningsPage() {
  const m = hostMetrics();
  const entries = listEarnings();
  const [payoutOpen, setPayoutOpen] = useState(false);

  return (
    <>
      <HostTopBar title="Earnings" subtitle="Escrow & payouts powered by FleetLink" showAdd={false} />

      <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4">
        {/* Balance hero */}
        <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground shadow-[var(--shadow-elevated)]">
          <p className="text-[11px] font-medium uppercase tracking-wide text-white/70">
            Available to withdraw
          </p>
          <p className="mt-1 text-3xl font-bold">{formatNaira(m.availableBalance)}</p>
          <button
            type="button"
            onClick={() => setPayoutOpen(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-2.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)]"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Withdraw to bank
          </button>
          <Link
            to="/payments/payouts"
            className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-white/10 py-1.5 text-[11px] font-semibold text-white hover:bg-white/15"
          >
            <Receipt className="h-3 w-3" />
            Payout history
          </Link>
        </section>

        {/* Sub-balances */}
        <section className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-warning-foreground">
              <ShieldCheck className="h-3 w-3" /> In escrow
            </p>
            <p className="mt-1 text-lg font-bold text-foreground">{formatNaira(m.inEscrow)}</p>
            <p className="text-[10px] text-muted-foreground">Releases on completion</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-success">
              Lifetime
            </p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {formatNaira(m.lifetimeEarnings)}
            </p>
            <p className="text-[10px] text-muted-foreground">All-time earned</p>
          </div>
        </section>

        {/* Trend chart */}
        <EarningsChart data={TREND} />

        {/* Disclaimer */}
        <div className="flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-[11px] text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Mock balances. Live escrow & payouts wire up once a payments provider is enabled.
          </span>
        </div>

        {/* Transactions */}
        <section className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
          <div className="mb-1 flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-foreground">Recent activity</h2>
            <Link
              to="/payments/receipts"
              className="text-[11px] font-semibold text-primary hover:underline"
            >
              All receipts
            </Link>
          </div>
          {entries.map((e) => (
            <EarningsRow key={e.id} entry={e} />
          ))}
        </section>
      </main>

      <PayoutModal
        open={payoutOpen}
        onOpenChange={setPayoutOpen}
        available={m.availableBalance}
      />
    </>
  );
}
