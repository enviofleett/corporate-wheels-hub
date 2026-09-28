import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { listAdminTxns } from "@/lib/admin-data";
import { formatNaira, formatRelativeTime } from "@/lib/format";

export const Route = createFileRoute("/admin/finance/transactions")({
  head: () => ({ meta: [{ title: "Transactions — Admin" }] }),
  component: TransactionsScreen,
});

const KINDS = [
  { id: "all", label: "All" },
  { id: "escrow_funding", label: "Funding" },
  { id: "escrow_release", label: "Release" },
  { id: "refund", label: "Refunds" },
  { id: "payout", label: "Payouts" },
  { id: "fee", label: "Fees" },
] as const;

function TransactionsScreen() {
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const all = useMemo(() => listAdminTxns(), []);
  const filtered = useMemo(
    () =>
      all
        .filter((t) => (kind === "all" ? true : t.kind === kind))
        .filter((t) =>
          query
            ? t.ref.toLowerCase().includes(query.toLowerCase()) ||
              t.payer.toLowerCase().includes(query.toLowerCase()) ||
              t.payee.toLowerCase().includes(query.toLowerCase())
            : true,
        ),
    [all, kind, query],
  );

  return (
    <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 shadow-[var(--shadow-card)]">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ref, payer, payee…"
          className="h-10 flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setKind(k.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
              kind === k.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-border bg-card p-3 text-sm shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-mono text-muted-foreground">{t.ref}</p>
                <p className="truncate text-sm font-semibold text-foreground capitalize">
                  {t.kind.replace("_", " ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{formatNaira(t.amount)}</p>
                <p
                  className={`text-[10px] font-semibold uppercase ${
                    t.status === "successful"
                      ? "text-success"
                      : t.status === "pending"
                        ? "text-warning-foreground"
                        : "text-destructive"
                  }`}
                >
                  {t.status}
                </p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {t.payer} → {t.payee} · {formatRelativeTime(t.date)}
              {t.fee ? ` · fee ${formatNaira(t.fee)}` : ""}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
