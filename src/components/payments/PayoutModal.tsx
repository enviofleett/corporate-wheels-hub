import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Landmark, Loader2, CheckCircle2, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listBankAccounts, defaultBankAccount } from "@/lib/payments-data";
import { formatNaira } from "@/lib/format";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  available: number;
};

type Stage = "form" | "processing" | "success";

export function PayoutModal({ open, onOpenChange, available }: Props) {
  const banks = listBankAccounts();
  const [bankId, setBankId] = useState(defaultBankAccount().id);
  const [amount, setAmount] = useState<number>(available);
  const [stage, setStage] = useState<Stage>("form");

  function handleClose(next: boolean) {
    if (!next && stage === "processing") return;
    if (!next) setStage("form");
    onOpenChange(next);
  }

  function handleSubmit() {
    setStage("processing");
    setTimeout(() => setStage("success"), 1500);
  }

  const valid = amount > 0 && amount <= available;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border bg-primary/5 px-5 pb-4 pt-5 text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <ArrowDownToLine className="h-4 w-4" />
            </span>
            <DialogTitle className="text-base">Withdraw to bank</DialogTitle>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Payouts arrive in 1–2 business days.</p>
        </DialogHeader>

        {stage === "form" && (
          <div className="space-y-4 px-5 py-4">
            {/* Available */}
            <section className="rounded-xl bg-muted/40 p-3 text-center">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Available</p>
              <p className="mt-0.5 text-2xl font-bold text-foreground">{formatNaira(available)}</p>
            </section>

            {/* Amount input */}
            <section>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Amount (₦)
              </label>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                <span className="text-sm font-bold text-muted-foreground">₦</span>
                <input
                  type="number"
                  min={0}
                  max={available}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-transparent text-base font-semibold text-foreground outline-none"
                />
                <button
                  type="button"
                  onClick={() => setAmount(available)}
                  className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground"
                >
                  MAX
                </button>
              </div>
              {!valid && amount > available && (
                <p className="mt-1 text-[11px] text-destructive">
                  Amount exceeds available balance.
                </p>
              )}
            </section>

            {/* Bank selector */}
            <section className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Send to
              </p>
              {banks.map((b) => {
                const selected = bankId === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBankId(b.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 transition-colors ${
                      selected
                        ? "border-accent bg-accent-soft"
                        : "border-border bg-card hover:bg-muted/40"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        selected ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <Landmark className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {b.bankName} {b.accountNumber}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">{b.accountName}</p>
                    </div>
                    {selected && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                        Default
                      </span>
                    )}
                  </button>
                );
              })}
            </section>

            <Button
              disabled={!valid}
              onClick={handleSubmit}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              Withdraw {formatNaira(amount || 0)}
            </Button>
          </div>
        )}

        {stage === "processing" && (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-sm font-semibold text-foreground">Initiating payout…</p>
          </div>
        )}

        {stage === "success" && (
          <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <p className="mt-4 text-sm font-bold text-foreground">Payout scheduled</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatNaira(amount)} on the way to your bank. You'll get a receipt by email.
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
