import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PaymentsTopBar } from "@/components/payments/PaymentsTopBar";
import { TransactionRow } from "@/components/payments/TransactionRow";
import { listTransactions, type TxnKind } from "@/lib/payments-data";
import { withRole } from "@/components/auth/withRole";

export const Route = createFileRoute("/payments/receipts/")({
  head: () => ({
    meta: [
      { title: "Receipts — FleetLink" },
      { name: "description", content: "All escrow funding, releases, fees and payouts." },
    ],
  }),
  component: withRole(["corporate", "host", "admin"], ReceiptsPage),
});

const FILTERS: Array<{ id: "all" | TxnKind; label: string }> = [
  { id: "all", label: "All" },
  { id: "escrow_funding", label: "Funding" },
  { id: "escrow_release", label: "Releases" },
  { id: "fee", label: "Fees" },
];

function ReceiptsPage() {
  const all = listTransactions();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const filtered = filter === "all" ? all : all.filter((t) => t.kind === filter);

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <PaymentsTopBar
        title="Receipts"
        subtitle={`${all.length} transactions`}
        backTo="/payments"
      />

      <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm font-semibold text-foreground">No transactions</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different filter.
            </p>
          </div>
        ) : (
          <section className="rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-card)]">
            {filtered.map((t) => (
              <TransactionRow key={t.id} txn={t} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
