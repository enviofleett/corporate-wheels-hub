import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, MessageSquare, Scale } from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { DISPUTE_LABEL, listAdminDisputes, type AdminDisputeStatus } from "@/lib/admin-data";
import { formatNaira, formatRelativeTime } from "@/lib/format";

export const Route = createFileRoute("/admin/disputes")({
  head: () => ({ meta: [{ title: "Disputes — Admin" }] }),
  component: AdminDisputesScreen,
});

const TABS: { id: AdminDisputeStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "needs_admin", label: "Needs admin" },
  { id: "open", label: "Open" },
  { id: "under_review", label: "Reviewing" },
  { id: "resolved", label: "Resolved" },
];

function AdminDisputesScreen() {
  const [tab, setTab] = useState<AdminDisputeStatus | "all">("all");
  const all = listAdminDisputes();
  const filtered = tab === "all" ? all : all.filter((d) => d.status === tab);

  return (
    <>
      <AdminTopBar title="Disputes" subtitle={`${all.length} total`} backTo="/admin" />
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
          {filtered.map((d) => (
            <article
              key={d.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <header className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-foreground">{d.id}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {d.dealId} · {d.vehicleLabel}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      d.status === "needs_admin"
                        ? "bg-destructive/10 text-destructive"
                        : d.status === "resolved"
                          ? "bg-success/10 text-success"
                          : "bg-warning/15 text-warning-foreground"
                    }`}
                  >
                    {DISPUTE_LABEL[d.status]}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatRelativeTime(d.createdAt)}
                  </span>
                </div>
              </header>

              <p className="mt-3 text-sm text-foreground">{d.reason}</p>

              <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/50 p-2.5 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground">Parties</p>
                  <p className="font-medium text-foreground">
                    {d.hostHandle} ↔ {d.corporateHandle}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Amount</p>
                  <p className="font-bold text-destructive">{formatNaira(d.amount)}</p>
                </div>
              </div>

              {d.priority === "high" && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-destructive">
                  <AlertTriangle className="h-3 w-3" /> High priority — {d.ageHours}h old
                </div>
              )}

              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-1 rounded-lg border border-border text-[11px] font-medium text-foreground"
                >
                  <MessageSquare className="h-3 w-3" /> Message
                </button>
                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-1 rounded-lg border border-border text-[11px] font-medium text-foreground"
                >
                  <Scale className="h-3 w-3" /> Mediate
                </button>
                <Link
                  to="/admin/finance/transactions"
                  className="flex h-9 items-center justify-center rounded-lg bg-primary text-[11px] font-semibold text-primary-foreground"
                >
                  Resolve
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
