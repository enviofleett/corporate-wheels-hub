import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  Car,
  CheckCircle2,
  Compass,
  Send,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { HostTopBar } from "@/components/host/HostTopBar";
import { MetricCard } from "@/components/corporate/MetricCard";
import { HostOfferCard } from "@/components/host/HostOfferCard";
import { hostMetrics, listHostOffers, listEngagedRequests } from "@/lib/host-data";
import { formatNaira } from "@/lib/format";
import { withRole } from "@/components/auth/withRole";

export const Route = createFileRoute("/host/")({
  head: () => ({
    meta: [
      { title: "Host dashboard — FleetLink" },
      { name: "description", content: "Manage your vehicles, offers, and earnings." },
    ],
  }),
  component: withRole(["host"], HostHome),
});

function HostHome() {
  const m = hostMetrics();
  const recentOffers = listHostOffers().slice(0, 2);
  const engaged = listEngagedRequests().slice(0, 2);

  return (
    <>
      <HostTopBar
        title="Welcome back, Host"
        subtitle="Here's what's happening with your fleet today."
      />

      <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4">
        {/* Verification banner */}
        <Link
          to="/trust"
          className="flex items-center gap-2 rounded-2xl border border-success/30 bg-success/10 p-3"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
          <p className="flex-1 text-xs text-foreground">
            Profile verified · {m.avgRating.toFixed(2)} avg rating
          </p>
          <span className="text-[11px] font-semibold text-success">Trust hub →</span>
        </Link>

        {/* Earnings snapshot */}
        <Link
          to="/host/earnings"
          className="block rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground shadow-[var(--shadow-elevated)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wide text-white/70">
              Available balance
            </span>
            <Wallet className="h-4 w-4 text-accent" />
          </div>
          <p className="mt-2 text-3xl font-bold">{formatNaira(m.availableBalance)}</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-white/70">
              In escrow: <span className="font-semibold text-white">{formatNaira(m.inEscrow)}</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-accent">
              View earnings <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Link>

        {/* Metrics grid */}
        <section className="grid grid-cols-2 gap-2">
          <MetricCard
            icon={<Car className="h-4 w-4" />}
            label="Active vehicles"
            value={`${m.activeVehicles}`}
            hint={`${m.rentedNow} rented now`}
          />
          <MetricCard
            icon={<Send className="h-4 w-4" />}
            label="Pending offers"
            value={`${m.pendingOffers}`}
            hint={`${m.acceptedOffers} accepted`}
            tone="accent"
          />
          <MetricCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Lifetime earnings"
            value={formatNaira(m.lifetimeEarnings)}
            tone="success"
          />
          <MetricCard
            icon={<Star className="h-4 w-4" />}
            label="Host rating"
            value={m.avgRating.toFixed(2)}
            hint="Last 90 days"
          />
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-2 gap-2">
          <QuickAction to="/feed" icon={<Bell className="h-4 w-4" />} label="Browse requests" />
          <QuickAction
            to="/host/engaged"
            icon={<Compass className="h-4 w-4" />}
            label="Engaged"
            count={engaged.length}
          />
        </section>

        {/* Recent activity */}
        <section className="space-y-2">
          <SectionHeader title="Recent offer activity" linkTo="/host/offers" />
          <div className="space-y-2">
            {recentOffers.map((o) => (
              <HostOfferCard key={o.id} offer={o} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function QuickAction({
  to,
  icon,
  label,
  count,
}: {
  to: "/feed" | "/host/engaged";
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{label}</p>
        {typeof count === "number" && (
          <p className="text-[10px] text-muted-foreground">{count} active</p>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

function SectionHeader({
  title,
  linkTo,
}: {
  title: string;
  linkTo: "/host/offers" | "/host/vehicles" | "/host/engaged" | "/host/earnings";
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      <Link to={linkTo} className="text-[11px] font-semibold text-accent">
        See all
      </Link>
    </div>
  );
}
