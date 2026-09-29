import { ShieldCheck, CheckCircle2, Clock, XCircle, RotateCcw } from "lucide-react";
import type { Transaction } from "@/lib/payments-data";
import { TXN_KIND_LABEL, TXN_STATUS_LABEL } from "@/lib/payments-data";
import { formatNaira } from "@/lib/format";

const STATUS_VISUAL = {
  successful: { Icon: CheckCircle2, cls: "bg-success/15 text-success" },
  pending: { Icon: Clock, cls: "bg-warning/15 text-warning-foreground" },
  processing: { Icon: Clock, cls: "bg-primary/10 text-primary" },
  failed: { Icon: XCircle, cls: "bg-destructive/10 text-destructive" },
  refunded: { Icon: RotateCcw, cls: "bg-muted text-muted-foreground" },
} as const;

export function ReceiptCard({ txn }: { txn: Transaction }) {
  const { Icon, cls } = STATUS_VISUAL[txn.status];
  const date = new Date(txn.date).toLocaleString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      {/* Header */}
      <header className="flex flex-col items-center gap-2 bg-primary/5 px-5 py-5 text-center">
        <span className={`flex h-12 w-12 items-center justify-center rounded-full ${cls}`}>
          <Icon className="h-6 w-6" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {TXN_KIND_LABEL[txn.kind]}
        </p>
        <p className="text-3xl font-bold text-foreground">{formatNaira(Math.abs(txn.amount))}</p>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}
        >
          {TXN_STATUS_LABEL[txn.status]}
        </span>
      </header>

      {/* Detail rows */}
      <div className="space-y-0 px-5 py-3 text-xs">
        <Row label="Reference" value={txn.ref} mono />
        <Row label="Date" value={date} />
        <Row label="Counterparty" value={txn.counterparty} />
        {txn.vehicleLabel && <Row label="Vehicle" value={txn.vehicleLabel} />}
        {txn.method && <Row label="Method" value={txn.method} />}
        {txn.description && <Row label="Description" value={txn.description} />}
        {txn.fee !== undefined && <Row label="Fees" value={formatNaira(txn.fee)} muted />}
      </div>

      {/* Escrow footer */}
      {txn.kind === "escrow_funding" && (
        <footer className="flex items-center gap-2 border-t border-border bg-muted/40 px-5 py-3 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          <span>Held in FleetLink escrow. Released to host on confirmed delivery milestones.</span>
        </footer>
      )}
    </article>
  );
}

function Row({
  label,
  value,
  muted,
  mono,
}: {
  label: string;
  value: string;
  muted?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-2 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`text-right font-semibold ${
          muted ? "text-muted-foreground" : "text-foreground"
        } ${mono ? "font-mono text-[11px]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
