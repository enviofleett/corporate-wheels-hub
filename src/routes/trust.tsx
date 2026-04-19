import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  ArrowRight,
  Star,
  AlertTriangle,
  BadgeCheck,
} from "lucide-react";
import { TrustTopBar } from "@/components/trust/TrustTopBar";
import {
  getKycProfile,
  listDisputes,
  listReviewableDeals,
} from "@/lib/trust-data";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: "Trust & Safety — FleetLink" },
      {
        name: "description",
        content: "Manage your verification, disputes, and reviews on FleetLink.",
      },
    ],
  }),
  component: TrustHub,
});

function TrustHub() {
  const kyc = getKycProfile();
  const disputes = listDisputes();
  const openDisputes = disputes.filter(
    (d) => d.status === "open" || d.status === "under_review",
  ).length;
  const reviewable = listReviewableDeals();
  const pendingReviews = reviewable.filter((d) => !d.reviewed).length;

  const completed = kyc.steps.filter((s) => s.status === "complete").length;

  return (
    <>
      <TrustTopBar
        title="Trust & Safety"
        subtitle="Build credibility, resolve issues, and rate completed deals."
        back={false}
      />

      <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4 pb-24">
        {/* Trust score hero */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-white/70">
                Trust score
              </p>
              <p className="mt-1 text-4xl font-bold">{kyc.trustScore}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              {kyc.level}
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${kyc.trustScore}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-white/70">
            {completed} of {kyc.steps.length} verification steps complete.
          </p>
        </section>

        {/* Tiles */}
        <section className="space-y-2">
          <Tile
            to="/trust/kyc"
            icon={<BadgeCheck className="h-4 w-4" />}
            title="Verification (KYC)"
            subtitle={`${completed}/${kyc.steps.length} steps complete`}
            tone="primary"
          />
          <Tile
            to="/trust/disputes"
            icon={<AlertTriangle className="h-4 w-4" />}
            title="Disputes"
            subtitle={
              openDisputes > 0
                ? `${openDisputes} open · needs attention`
                : "No active disputes"
            }
            tone={openDisputes > 0 ? "warning" : "muted"}
            badge={openDisputes > 0 ? openDisputes : undefined}
          />
          <Tile
            to="/trust/reviews"
            icon={<Star className="h-4 w-4" />}
            title="Reviews"
            subtitle={
              pendingReviews > 0
                ? `${pendingReviews} pending after completed rentals`
                : "All caught up"
            }
            tone={pendingReviews > 0 ? "accent" : "muted"}
            badge={pendingReviews > 0 ? pendingReviews : undefined}
          />
        </section>

        <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Verified profiles get up to{" "}
            <span className="font-semibold text-foreground">3× more responses</span> on offers.
          </p>
        </div>
      </main>
    </>
  );
}

type TileTone = "primary" | "accent" | "warning" | "muted";

function Tile({
  to,
  icon,
  title,
  subtitle,
  tone,
  badge,
}: {
  to: "/trust/kyc" | "/trust/disputes" | "/trust/reviews";
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone: TileTone;
  badge?: number;
}) {
  const iconCls =
    tone === "primary"
      ? "bg-primary-soft text-primary"
      : tone === "accent"
        ? "bg-accent-soft text-accent"
        : tone === "warning"
          ? "bg-warning/15 text-warning-foreground"
          : "bg-muted text-muted-foreground";

  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconCls}`}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          {typeof badge === "number" && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
