import { Link } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  Wallet,
  Percent,
  Gift,
} from "lucide-react";
import type { Transaction } from "@/lib/payments-data";
import { TXN_KIND_LABEL, TXN_STATUS_LABEL } from "@/lib/payments-data";
import { formatNaira, formatRelativeTime } from "@/lib/format";

const KIND_ICON = {
  escrow_funding: ShieldCheck,
  escrow_release: ArrowDownLeft,
  refund: RotateCcw,
  payout: Wallet,
  fee: Percent,
  bonus: Gift,
} as const;

const STATUS_CLASS: Record<Transaction["status"], string> = {
  pending: "bg-warning/15 text-warning-foreground",
  processing: "bg-primary/10 text-primary",
  successful: "bg-success/15 text-success",
  failed: "bg-destructive/10 text-destructive",
  refunded: "bg-muted text-muted-foreground",
};

export function TransactionRow({ txn }: { txn: Transaction }) {
  const Icon = KIND_ICON[txn.kind];
  const isOutflow = txn.amount < 0 || txn.kind === "fee" || txn.kind === "escrow_funding";
  const sign = isOutflow ? "−" : "+";

  return (
    <Link
      to="/payments/receipts/$txnId"
      params={{ txnId: txn.id }}
      className="flex items-center gap-3 border-b border-border px-1 py-3 last:border-b-0 hover:bg-muted/40"
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          isOutflow ? "bg-muted text-foreground" : "bg-success/10 text-success"
        }`}
      >
        {isOutflow ? <ArrowUpRight className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {TXN_KIND_LABEL[txn.kind]}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          {txn.counterparty} · {formatRelativeTime(txn.date)} ago
        </p>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-bold ${
            isOutflow ? "text-foreground" : "text-success"
          }`}
        >
          {sign}
          {formatNaira(Math.abs(txn.amount))}
        </p>
        <span
          className={`mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${STATUS_CLASS[txn.status]}`}
        >
          {TXN_STATUS_LABEL[txn.status]}
        </span>
      </div>
    </Link>
  );
}
