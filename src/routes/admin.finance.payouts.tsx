import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import { listPayoutApprovals, PAYOUT_LABEL } from "@/lib/admin-data";
import { formatNaira, formatRelativeTime } from "@/lib/format";

export const Route = createFileRoute("/admin/finance/payouts")({
  head: () => ({ meta: [{ title: "Payout approvals — Admin" }] }),
  component: PayoutsScreen,
});

function PayoutsScreen() {
  const items = listPayoutApprovals();
  const [decisions, setDecisions] = useState<Record<string, "approved" | "rejected">>({});

  return (
    <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
      <div className="rounded-2xl border border-warning/30 bg-warning/5 p-3 text-xs text-warning-foreground">
        Approvals release funds within 2 hours. Double-check bank details and risk flags.
      </div>

      <div className="space-y-3">
        {items.map((p) => {
          const decision = decisions[p.id];
          const isComplete = p.status === "completed";
          return (
            <article
              key={p.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <header className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-foreground">{p.hostHandle}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.bank} · {formatRelativeTime(p.requestedAt)}
                  </p>
                </div>
                <p className="text-lg font-bold text-foreground">{formatNaira(p.amount)}</p>
              </header>

              {p.riskFlag && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-destructive/10 px-2.5 py-1 text-[11px] font-medium text-destructive">
                  <AlertTriangle className="h-3 w-3" />
                  {p.riskFlag}
                </div>
              )}

              {isComplete ? (
                <p className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-center text-xs font-semibold text-success">
                  {PAYOUT_LABEL[p.status]}
                </p>
              ) : decision ? (
                <p
                  className={`mt-3 rounded-lg px-3 py-2 text-center text-xs font-semibold ${
                    decision === "approved"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {decision === "approved" ? "Approved — queued for release" : "Rejected"}
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecisions((d) => ({ ...d, [p.id]: "rejected" }))}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-destructive/40 text-xs font-semibold text-destructive"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisions((d) => ({ ...d, [p.id]: "approved" }))}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-success text-xs font-semibold text-success-foreground"
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
  );
}
