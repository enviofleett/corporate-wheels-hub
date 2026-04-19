import { CreditCard, Landmark, Smartphone, Wallet, Check } from "lucide-react";
import type { PaymentMethod } from "@/lib/payments-data";

const ICON = {
  card: CreditCard,
  bank_transfer: Landmark,
  ussd: Smartphone,
  wallet: Wallet,
} as const;

type Props = {
  method: PaymentMethod;
  selected?: boolean;
  onSelect?: (id: string) => void;
  trailing?: React.ReactNode;
};

export function PaymentMethodRow({ method, selected, onSelect, trailing }: Props) {
  const Icon = ICON[method.type];
  const interactive = !!onSelect;

  const Inner = (
    <>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          selected ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-semibold text-foreground">{method.label}</p>
        {method.hint && (
          <p className="truncate text-[11px] text-muted-foreground">{method.hint}</p>
        )}
      </div>
      {trailing ??
        (selected ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        ) : (
          <span className="h-5 w-5 rounded-full border-2 border-border" />
        ))}
    </>
  );

  if (!interactive) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
        {Inner}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(method.id)}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 transition-colors ${
        selected
          ? "border-accent bg-accent-soft"
          : "border-border bg-card hover:bg-muted/40"
      }`}
    >
      {Inner}
    </button>
  );
}
