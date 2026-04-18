import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Car, TrendingUp, Bell } from "lucide-react";

export const Route = createFileRoute("/host")({
  head: () => ({
    meta: [
      { title: "Host dashboard — FleetLink" },
      { name: "description", content: "Manage your vehicles and rental offers." },
    ],
  }),
  component: HostHome,
});

function HostHome() {
  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <header className="bg-primary px-5 pb-8 pt-10 text-primary-foreground">
        <div className="mx-auto max-w-md">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
            Verification pending
          </div>
          <h1 className="mt-3 text-2xl font-bold">You're in. Welcome!</h1>
          <p className="mt-1 text-sm text-white/70">
            Phase 2 will bring the social feed of corporate requests here.
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-4 w-full max-w-md space-y-3 px-5">
        <Card icon={<Bell />} title="Browse requests" desc="Coming in Phase 2" />
        <Card icon={<Car />} title="My vehicles" desc="Coming in Phase 5" />
        <Card icon={<TrendingUp />} title="Earnings" desc="Coming in Phase 5" />

        <Link
          to="/"
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl border border-border bg-background text-sm font-medium text-foreground"
        >
          Back to start
        </Link>
      </main>
    </div>
  );
}

function Card({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}
