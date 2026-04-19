import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Banknote,
  Building2,
  Car,
  ChevronRight,
  Megaphone,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { adminMetrics, listAuditLog, listKycQueue, listAdminDisputes } from "@/lib/admin-data";
import { formatNaira, formatRelativeTime } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Overview — FleetLink" }] }),
  component: AdminOverview,
});

function AdminOverview() {
  const m = adminMetrics();
  const audit = listAuditLog().slice(0, 4);
  const kyc = listKycQueue().slice(0, 3);
  const disputes = listAdminDisputes().filter((d) => d.status !== "resolved").slice(0, 2);

  return (
    <>
      <AdminTopBar title="Admin Overview" subtitle="Platform health at a glance" />

      <main className="mx-auto w-full max-w-md space-y-5 px-5 pt-4">
        {/* Hero — gross volume + revenue */}
        <section
          className="overflow-hidden rounded-2xl p-5 text-primary-foreground shadow-[var(--shadow-elevated)]"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-accent" />
              Gross volume (90d)
            </span>
            <span>Live</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{formatNaira(m.grossVolume)}</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <Stat label="Revenue" value={formatNaira(m.platformRevenue)} />
            <Stat label="In escrow" value={formatNaira(m.escrowHeld)} />
            <Stat label="Active users" value={m.activeUsers.toString()} />
          </div>
        </section>

        {/* Action queues */}
        <section>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Action queues</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <AdminMetricCard
              label="KYC queue"
              value={m.pendingKyc.toString()}
              hint="Awaiting review"
              icon={ShieldCheck}
              tone="warning"
            />
            <AdminMetricCard
              label="Open disputes"
              value={m.openDisputes.toString()}
              hint="Needs attention"
              icon={AlertTriangle}
              tone="danger"
            />
            <AdminMetricCard
              label="Payouts to approve"
              value={m.pendingPayouts.toString()}
              hint="Today"
              icon={Wallet}
              tone="accent"
            />
            <AdminMetricCard
              label="Moderation queue"
              value={m.pendingMod.toString()}
              hint="User reports"
              icon={ShieldAlert}
              tone="danger"
            />
          </div>
        </section>

        {/* Users summary */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Users</h2>
            <Link to="/admin/users" className="text-xs font-medium text-accent">
              Manage →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              to="/admin/users"
              search={{ role: "hosts" }}
              className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
            >
              <Car className="h-4 w-4 text-primary" />
              <p className="mt-2 text-lg font-bold text-foreground">{m.hostsCount}</p>
              <p className="text-[11px] text-muted-foreground">Hosts</p>
            </Link>
            <Link
              to="/admin/users"
              search={{ role: "corporates" }}
              className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
            >
              <Building2 className="h-4 w-4 text-primary" />
              <p className="mt-2 text-lg font-bold text-foreground">{m.corporatesCount}</p>
              <p className="text-[11px] text-muted-foreground">Corporates</p>
            </Link>
          </div>
        </section>

        {/* KYC quick view */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">KYC needs review</h2>
            <Link to="/admin/kyc" className="text-xs font-medium text-accent">
              See all →
            </Link>
          </div>
          <div className="space-y-2">
            {kyc.map((k) => (
              <Link
                key={k.id}
                to="/admin/kyc"
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm shadow-[var(--shadow-card)]"
              >
                <div>
                  <p className="font-semibold text-foreground">{k.userHandle}</p>
                  <p className="text-[11px] text-muted-foreground capitalize">
                    {k.step} · risk {k.riskScore}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    k.status === "auto_flagged"
                      ? "bg-destructive/10 text-destructive"
                      : k.status === "needs_info"
                        ? "bg-warning/15 text-warning-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {k.status.replace("_", " ")}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Disputes quick view */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Disputes needing admin</h2>
            <Link to="/admin/disputes" className="text-xs font-medium text-accent">
              See all →
            </Link>
          </div>
          <div className="space-y-2">
            {disputes.map((d) => (
              <Link
                key={d.id}
                to="/admin/disputes"
                className="block rounded-xl border border-border bg-card p-3 text-sm shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{d.id}</span>
                  <span className="text-[11px] text-destructive">
                    {formatNaira(d.amount)} · {d.priority}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {d.hostHandle} ↔ {d.corporateHandle} · {d.reason}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick links */}
        <section>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Quick access</h2>
          <div className="space-y-2">
            <QuickLink to="/admin/finance/transactions" icon={Banknote} label="Transactions" />
            <QuickLink to="/admin/finance/payouts" icon={Wallet} label="Payout approvals" />
            <QuickLink to="/admin/audit" icon={ScrollText} label="Audit log" />
            <QuickLink to="/admin/announcements" icon={Megaphone} label="Announcements" />
          </div>
        </section>

        {/* Recent activity */}
        <section>
          <h2 className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
            Recent admin activity
          </h2>
          <ul className="space-y-2">
            {audit.map((a) => (
              <li
                key={a.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 text-xs shadow-[var(--shadow-card)]"
              >
                <span
                  className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                    a.severity === "critical"
                      ? "bg-destructive"
                      : a.severity === "warn"
                        ? "bg-warning"
                        : "bg-success"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{a.action}</p>
                  <p className="truncate text-muted-foreground">{a.target}</p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatRelativeTime(a.at)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
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

function QuickLink({
  to,
  icon: Icon,
  label,
}: {
  to: "/admin/finance/transactions" | "/admin/finance/payouts" | "/admin/audit" | "/admin/announcements";
  icon: typeof Users;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
