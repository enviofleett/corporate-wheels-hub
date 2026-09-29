import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Banknote, TrendingUp, Wallet } from "lucide-react";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { adminMetrics, listAdminTxns, listPayoutApprovals } from "@/lib/admin-data";
import { formatNaira, formatRelativeTime } from "@/lib/format";

export const Route = createFileRoute("/admin/finance/")({
  head: () => ({ meta: [{ title: "Finance Overview — Admin" }] }),
  component: FinanceOverview,
});

function FinanceOverview() {
  const m = adminMetrics();
  const recent = listAdminTxns().slice(0, 4);
  const pendingPayouts = listPayoutApprovals().filter((p) => p.status === "awaiting_approval");

  return (
    <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4">
      {/* Hero */}
      <section
        className="overflow-hidden rounded-2xl p-5 text-primary-foreground shadow-[var(--shadow-elevated)]"
        style={{ background: "var(--gradient-hero)" }}
      >
        <p className="text-xs text-white/70">Held in escrow</p>
        <p className="mt-1 text-3xl font-bold">{formatNaira(m.escrowHeld)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <Stat label="Gross volume (90d)" value={formatNaira(m.grossVolume)} />
          <Stat label="Platform revenue" value={formatNaira(m.platformRevenue)} />
        </div>
      </section>

      {/* Quick metrics */}
      <section className="grid grid-cols-2 gap-2.5">
        <AdminMetricCard
          label="Pending payouts"
          value={pendingPayouts.length.toString()}
          hint="Awaiting approval"
          icon={Wallet}
          tone="warning"
        />
        <AdminMetricCard
          label="Take rate"
          value="6.5%"
          hint="Platform + gateway"
          icon={TrendingUp}
          tone="success"
        />
      </section>

      {/* Pending approvals */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Awaiting approval</h2>
          <Link to="/admin/finance/payouts" className="text-xs font-medium text-accent">
            All payouts →
          </Link>
        </div>
        <div className="space-y-2">
          {pendingPayouts.slice(0, 3).map((p) => (
            <Link
              key={p.id}
              to="/admin/finance/payouts"
              className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm shadow-[var(--shadow-card)]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">{p.hostHandle}</p>
                <p className="text-[11px] text-muted-foreground">
                  {p.bank} · {formatRelativeTime(p.requestedAt)}
                </p>
              </div>
              <span className="font-bold text-foreground">{formatNaira(p.amount)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent transactions */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Recent transactions</h2>
          <Link to="/admin/finance/transactions" className="text-xs font-medium text-accent">
            See all →
          </Link>
        </div>
        <div className="space-y-2">
          {recent.map((t) => {
            const negative = t.kind === "refund" || t.kind === "payout";
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    negative ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                  }`}
                >
                  {negative ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground capitalize">
                    {t.kind.replace("_", " ")}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {t.payer} → {t.payee}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{formatNaira(t.amount)}</p>
                  <p className="text-[10px] text-muted-foreground">{formatRelativeTime(t.date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-card p-3 text-xs text-muted-foreground">
        <Banknote className="h-4 w-4" />
        Reconciled with payment gateway every 30 minutes.
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur">
      <p className="text-[10px] uppercase tracking-wide text-white/60">{label}</p>
      <p className="mt-0.5 text-sm font-bold">{value}</p>
    </div>
  );
}
