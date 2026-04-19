import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownToLine, Wallet } from "lucide-react";
import { PaymentsTopBar } from "@/components/payments/PaymentsTopBar";
import { PayoutRow } from "@/components/payments/PayoutRow";
import { PayoutModal } from "@/components/payments/PayoutModal";
import { Button } from "@/components/ui/button";
import { listPayouts } from "@/lib/payments-data";
import { hostMetrics } from "@/lib/host-data";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/payments/payouts")({
  head: () => ({
    meta: [
      { title: "Payouts — FleetLink" },
      { name: "description", content: "Withdraw earnings to your bank account." },
    ],
  }),
  component: PayoutsPage,
});

function PayoutsPage() {
  const payouts = listPayouts();
  const m = hostMetrics();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <PaymentsTopBar title="Payouts" subtitle="Withdrawals to bank" backTo="/payments" />

      <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4">
        {/* Available balance hero */}
        <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground shadow-[var(--shadow-elevated)]">
          <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <Wallet className="h-3 w-3" /> Available to withdraw
          </p>
          <p className="mt-1 text-3xl font-bold">{formatNaira(m.availableBalance)}</p>
          <Button
            onClick={() => setOpen(true)}
            className="mt-3 w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Withdraw to bank
          </Button>
        </section>

        {/* History */}
        <section className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
          <h2 className="px-1 pb-1 text-sm font-bold text-foreground">Payout history</h2>
          {payouts.length === 0 ? (
            <p className="px-1 py-6 text-center text-xs text-muted-foreground">
              No payouts yet.
            </p>
          ) : (
            payouts.map((p) => <PayoutRow key={p.id} payout={p} />)
          )}
        </section>
      </main>

      <PayoutModal
        open={open}
        onOpenChange={setOpen}
        available={m.availableBalance}
      />
    </div>
  );
}
