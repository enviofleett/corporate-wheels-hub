import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  CreditCard,
  Receipt,
  Wallet,
  ChevronRight,
  Info,
} from "lucide-react";
import { PaymentsTopBar } from "@/components/payments/PaymentsTopBar";
import { listTransactions, listPayouts } from "@/lib/payments-data";
import { corporateMetrics } from "@/lib/corporate-data";
import { hostMetrics } from "@/lib/host-data";
import { formatNaira } from "@/lib/format";
import { withRole } from "@/components/auth/withRole";
import { useRole } from "@/lib/role-store";

export const Route = createFileRoute("/payments/")({
  head: () => ({
    meta: [
      { title: "Payments — FleetLink" },
      { name: "description", content: "Manage escrow, payment methods, receipts and payouts." },
    ],
  }),
  component: withRole(["corporate", "host", "admin"], PaymentsHome),
});

function PaymentsHome() {
  const role = useRole();
  const isCorporate = role === "corporate";
  const isHost = role === "host";
  const corp = corporateMetrics();
  const host = hostMetrics();
  const txns = listTransactions().slice(0, 3);
  const payouts = listPayouts();

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <PaymentsTopBar
        title={isHost ? "Earnings & wallet" : "Payments"}
        subtitle={
          isHost
            ? "Payouts, methods & receipts"
            : isCorporate
              ? "Escrow, methods & receipts"
              : "Escrow, methods, receipts & payouts"
        }
        backTo="/"
      />

      <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4">
        {/* Hero — escrow + available */}
        <section className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-primary p-3 text-primary-foreground shadow-[var(--shadow-elevated)]">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-white/70">
              <ShieldCheck className="h-3 w-3" /> In escrow
            </p>
            <p className="mt-1 text-xl font-bold">{formatNaira(corp.inEscrow)}</p>
            <p className="text-[10px] text-white/70">Across {corp.activeDeals} deals</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-success">
              <Wallet className="h-3 w-3" /> Available
            </p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {formatNaira(host.availableBalance)}
            </p>
            <p className="text-[10px] text-muted-foreground">Ready to withdraw</p>
          </div>
        </section>

        {/* Quick links */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <NavRow
            to="/payments/methods"
            icon={<CreditCard className="h-4 w-4" />}
            label="Payment methods"
            hint="Cards, bank transfer, USSD"
          />
          <NavRow
            to="/payments/receipts"
            icon={<Receipt className="h-4 w-4" />}
            label="Receipts & history"
            hint={`${listTransactions().length} transactions`}
          />
          {!isCorporate && (
            <NavRow
              to="/payments/payouts"
              icon={<Wallet className="h-4 w-4" />}
              label="Payouts"
              hint={`${payouts.length} processed`}
            />
          )}
        </section>

        {/* Recent activity */}
        <section className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
          <div className="mb-1 flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-foreground">Recent activity</h2>
            <Link
              to="/payments/receipts"
              className="text-[11px] font-semibold text-primary hover:underline"
            >
              See all
            </Link>
          </div>
          {txns.map((t) => (
            <Link
              key={t.id}
              to="/payments/receipts/$txnId"
              params={{ txnId: t.id }}
              className="flex items-center justify-between border-b border-border px-1 py-2.5 last:border-b-0 hover:bg-muted/40"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {t.counterparty}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">{t.ref}</p>
              </div>
              <p className="ml-2 text-sm font-bold text-foreground">
                {formatNaira(Math.abs(t.amount))}
              </p>
            </Link>
          ))}
        </section>

        <div className="flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-[11px] text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Mock data — no real charges. Live escrow & payouts wire up when payments are enabled.
          </span>
        </div>
      </main>
    </div>
  );
}

function NavRow({
  to,
  icon,
  label,
  hint,
}: {
  to: "/payments/methods" | "/payments/receipts" | "/payments/payouts";
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-muted/40"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{label}</p>
        <p className="truncate text-[11px] text-muted-foreground">{hint}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
