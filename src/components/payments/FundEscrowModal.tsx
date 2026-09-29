import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentMethodRow } from "./PaymentMethodRow";
import { listPaymentMethods, defaultPaymentMethod, calcFees } from "@/lib/payments-data";
import { formatNaira } from "@/lib/format";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  vehicleLabel: string;
  hostHandle: string;
  durationLabel: string;
  onFunded?: () => void;
};

type Stage = "review" | "processing" | "success";

export function FundEscrowModal({
  open,
  onOpenChange,
  amount,
  vehicleLabel,
  hostHandle,
  durationLabel,
  onFunded,
}: Props) {
  const methods = listPaymentMethods("corporate");
  const [selected, setSelected] = useState(defaultPaymentMethod().id);
  const [stage, setStage] = useState<Stage>("review");

  const fees = calcFees(amount);

  function handleClose(next: boolean) {
    if (!next && stage === "processing") return; // block close while processing
    if (!next) {
      setStage("review");
    }
    onOpenChange(next);
  }

  function handleFund() {
    setStage("processing");
    setTimeout(() => {
      setStage("success");
      onFunded?.();
    }, 1600);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border bg-primary/5 px-5 pb-4 pt-5 text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <DialogTitle className="text-base">Fund escrow</DialogTitle>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Funds are held safely until delivery is confirmed.
          </p>
        </DialogHeader>

        {stage === "review" && (
          <div className="space-y-4 px-5 py-4">
            {/* Deal summary */}
            <section className="rounded-xl border border-border bg-card p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                You are funding
              </p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{vehicleLabel}</p>
              <p className="text-[11px] text-muted-foreground">
                with {hostHandle} · {durationLabel}
              </p>
            </section>

            {/* Fee breakdown */}
            <section className="space-y-1.5 rounded-xl bg-muted/40 p-3 text-xs">
              <Row label="Rental amount" value={formatNaira(amount)} />
              <Row label="Platform fee (5%)" value={formatNaira(fees.platform)} muted />
              <Row label="Gateway fee (1.5%)" value={formatNaira(fees.gateway)} muted />
              <div className="my-1 border-t border-border" />
              <Row label="Total to fund" value={formatNaira(fees.grandTotal)} bold />
            </section>

            {/* Payment methods */}
            <section className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Pay with
              </p>
              <div className="space-y-2">
                {methods.map((m) => (
                  <PaymentMethodRow
                    key={m.id}
                    method={m}
                    selected={selected === m.id}
                    onSelect={setSelected}
                  />
                ))}
              </div>
            </section>

            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Encrypted · Mock checkout — no real charges.</span>
            </div>

            <Button
              onClick={handleFund}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              Fund {formatNaira(fees.grandTotal)}
            </Button>
          </div>
        )}

        {stage === "processing" && (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-sm font-semibold text-foreground">Funding escrow…</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Securing {formatNaira(fees.grandTotal)} with your bank.
            </p>
          </div>
        )}

        {stage === "success" && (
          <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <p className="mt-4 text-sm font-bold text-foreground">Escrow funded</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatNaira(fees.grandTotal)} held safely. The host has been notified.
            </p>
            <Button onClick={() => handleClose(false)} className="mt-5 w-full" variant="outline">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  muted,
  bold,
}: {
  label: string;
  value: string;
  muted?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : "text-foreground"}>{label}</span>
      <span
        className={`${bold ? "text-sm font-bold text-foreground" : "font-medium text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}
