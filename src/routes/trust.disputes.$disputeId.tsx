import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Paperclip, MessageSquare, Scale, ChevronRight } from "lucide-react";
import { TrustTopBar } from "@/components/trust/TrustTopBar";
import { DisputeStatusBadge } from "@/components/trust/DisputeStatusBadge";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import { getDispute, REASON_LABELS, type Dispute } from "@/lib/trust-data";
import { formatNaira, formatRelativeTime } from "@/lib/format";
import { withRole } from "@/components/auth/withRole";

export const Route = createFileRoute("/trust/disputes/$disputeId")({
  loader: ({ params }): { dispute: Dispute } => {
    const dispute = getDispute(params.disputeId);
    if (!dispute) throw notFound();
    return { dispute };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.dispute.id} — Dispute`
          : "Dispute — FleetLink",
      },
      { name: "description", content: "Dispute thread and resolution status." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Error: {error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md p-8 text-center">
      <p className="text-sm font-semibold text-foreground">Dispute not found</p>
      <Link to="/trust/disputes" className="mt-3 inline-block text-xs font-semibold text-accent">
        Back to disputes
      </Link>
    </div>
  ),
  component: withRole(["corporate", "host", "admin"], DisputeDetail),
});

function DisputeDetail() {
  const { dispute } = Route.useLoaderData() as { dispute: Dispute };

  const timeline = [
    {
      id: "t1",
      label: "Dispute opened",
      meta: formatRelativeTime(dispute.createdAt) + " ago",
      tone: "primary" as const,
    },
    {
      id: "t2",
      label: "Counterparty notified",
      meta: formatRelativeTime(dispute.createdAt) + " ago",
      tone: "muted" as const,
    },
    {
      id: "t3",
      label:
        dispute.status === "resolved"
          ? "Resolved by trust team"
          : "Trust team reviewing evidence",
      meta: formatRelativeTime(dispute.lastUpdateAt) + " ago",
      tone:
        dispute.status === "resolved"
          ? ("success" as const)
          : ("accent" as const),
    },
  ];

  return (
    <>
      <TrustTopBar title={dispute.id} subtitle={dispute.vehicleLabel} />

      <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4 pb-24">
        {/* Header card */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-3">
            <CompanyAvatar hue={dispute.counterpartyHue} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-foreground">
                  {dispute.counterparty}
                </span>
                <DisputeStatusBadge status={dispute.status} />
              </div>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                Deal {dispute.dealId}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-muted/40 p-3">
            <Stat label="Reason" value={REASON_LABELS[dispute.reason]} />
            <Stat label="Amount in dispute" value={formatNaira(dispute.amountInDispute)} />
          </div>

          <div className="mt-3 rounded-xl border border-border p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Summary
            </p>
            <p className="mt-1 text-xs text-foreground">{dispute.summary}</p>
          </div>
        </section>

        {/* Timeline */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-bold text-foreground">Activity</h2>
          <ol className="mt-3 space-y-3">
            {timeline.map((t, i) => (
              <li key={t.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                      t.tone === "success"
                        ? "bg-success/15 text-success"
                        : t.tone === "accent"
                          ? "bg-accent-soft text-accent"
                          : t.tone === "primary"
                            ? "bg-primary-soft text-primary"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {i < timeline.length - 1 && (
                    <span className="my-1 w-px flex-1 bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-xs font-semibold text-foreground">{t.label}</p>
                  <p className="text-[10px] text-muted-foreground">{t.meta}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Evidence */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Evidence</h2>
            <span className="text-[11px] text-muted-foreground">
              {dispute.evidenceCount} attached
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {Array.from({ length: dispute.evidenceCount }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center rounded-xl bg-muted text-muted-foreground"
              >
                <Paperclip className="h-4 w-4" />
              </div>
            ))}
          </div>
          {dispute.status !== "resolved" && (
            <button
              type="button"
              className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-muted/40 text-xs font-semibold text-muted-foreground"
            >
              <Paperclip className="h-3.5 w-3.5" />
              Add more evidence
            </button>
          )}
        </section>

        {/* Actions */}
        {dispute.status !== "resolved" && (
          <section className="space-y-2">
            <ActionRow
              icon={<MessageSquare className="h-4 w-4" />}
              label="Message counterparty"
              hint={dispute.unread > 0 ? `${dispute.unread} new` : undefined}
            />
            <ActionRow
              icon={<Scale className="h-4 w-4" />}
              label="Request mediation"
              hint="Trust team intervenes"
            />
          </section>
        )}
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ActionRow({
  icon,
  label,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-[var(--shadow-card)]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {hint && <p className="text-[10px] text-accent">{hint}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
