import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, FileText, X } from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import { KYC_QUEUE_LABEL, listKycQueue, type KycQueueStatus } from "@/lib/admin-data";
import { formatRelativeTime } from "@/lib/format";

export const Route = createFileRoute("/admin/kyc")({
  head: () => ({ meta: [{ title: "KYC Queue — Admin" }] }),
  component: KycQueue,
});

const TABS: { id: KycQueueStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "auto_flagged", label: "Flagged" },
  { id: "in_review", label: "In review" },
  { id: "needs_info", label: "Needs info" },
];

function KycQueue() {
  const [tab, setTab] = useState<KycQueueStatus | "all">("all");
  const [decisions, setDecisions] = useState<Record<string, "approved" | "rejected">>({});

  const items = useMemo(() => listKycQueue(), []);
  const filtered = useMemo(
    () => (tab === "all" ? items : items.filter((i) => i.status === tab)),
    [items, tab],
  );

  return (
    <>
      <AdminTopBar
        title="KYC queue"
        subtitle={`${filtered.length} pending review`}
        backTo="/admin"
      />
      <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                tab === t.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((k) => {
            const decision = decisions[k.id];
            return (
              <article
                key={k.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <header className="flex items-start gap-3">
                  <CompanyAvatar hue={k.hue} size="sm" />
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/admin/users/$userId"
                      params={{ userId: k.userId }}
                      className="text-sm font-semibold text-foreground"
                    >
                      {k.userHandle}
                    </Link>
                    <p className="text-[11px] text-muted-foreground">
                      {k.userRole === "hosts" ? "Host" : "Corporate"} ·{" "}
                      {formatRelativeTime(k.submittedAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      k.status === "auto_flagged"
                        ? "bg-destructive/10 text-destructive"
                        : k.status === "needs_info"
                          ? "bg-warning/15 text-warning-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {KYC_QUEUE_LABEL[k.status]}
                  </span>
                </header>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <Cell label="Step" value={k.step.toUpperCase()} />
                  <Cell
                    label="Risk score"
                    value={`${k.riskScore}/100`}
                    tone={k.riskScore > 60 ? "danger" : k.riskScore > 30 ? "warn" : "ok"}
                  />
                </div>

                {k.notes && (
                  <p className="mt-3 rounded-lg bg-muted/50 p-2.5 text-[11px] text-muted-foreground">
                    {k.notes}
                  </p>
                )}

                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-accent"
                >
                  <FileText className="h-3 w-3" /> View documents
                </button>

                {decision ? (
                  <p
                    className={`mt-3 rounded-lg px-3 py-2 text-center text-xs font-semibold ${
                      decision === "approved"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {decision === "approved" ? "Approved" : "Rejected"} · logged in audit
                  </p>
                ) : (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDecisions((p) => ({ ...p, [k.id]: "rejected" }))}
                      className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-destructive/40 text-xs font-semibold text-destructive"
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecisions((p) => ({ ...p, [k.id]: "approved" }))}
                      className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-success text-xs font-semibold text-success-foreground"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}

function Cell({
  label,
  value,
  tone = "ok",
}: {
  label: string;
  value: string;
  tone?: "ok" | "warn" | "danger";
}) {
  const cls =
    tone === "danger"
      ? "text-destructive"
      : tone === "warn"
        ? "text-warning-foreground"
        : "text-foreground";
  return (
    <div className="rounded-lg bg-muted/40 p-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold ${cls}`}>{value}</p>
    </div>
  );
}
