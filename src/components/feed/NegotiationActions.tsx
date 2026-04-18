// Action bar for a negotiation thread: Accept / Reject / Counter.
// Counter opens an inline form. All actions are simulated (in-memory).

import { useState } from "react";
import { Check, X, RefreshCw, Send } from "lucide-react";
import type { Negotiation } from "@/lib/negotiations";
import { appendCounter, setNegotiationStatus } from "@/lib/negotiations";
import { formatNaira } from "@/lib/format";

type Props = {
  negotiation: Negotiation;
  onChange: () => void;
};

export function NegotiationActions({ negotiation, onChange }: Props) {
  const [counterOpen, setCounterOpen] = useState(false);
  const last = negotiation.timeline[negotiation.timeline.length - 1];
  const [price, setPrice] = useState<number>(last?.price ?? 0);
  const [notes, setNotes] = useState("");

  if (negotiation.status === "accepted" || negotiation.status === "rejected") {
    return (
      <div className="rounded-2xl border border-border bg-muted/40 p-4 text-center">
        <p className="text-xs font-medium text-muted-foreground">
          {negotiation.status === "accepted"
            ? "Deal accepted. Proceed to escrow funding (Phase 7)."
            : "This negotiation was closed."}
        </p>
      </div>
    );
  }

  const accept = () => {
    setNegotiationStatus(negotiation.id, "accepted");
    onChange();
  };
  const reject = () => {
    setNegotiationStatus(negotiation.id, "rejected");
    onChange();
  };
  const sendCounter = () => {
    if (!last) return;
    appendCounter(negotiation.id, {
      party: "corporate",
      hostHandle: negotiation.hostHandle,
      vehicleLabel: last.vehicleLabel,
      price,
      period: last.period,
      notes: notes.trim() || undefined,
    });
    setCounterOpen(false);
    setNotes("");
    onChange();
  };

  return (
    <div className="space-y-3">
      {!counterOpen ? (
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={accept}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-success text-xs font-semibold text-success-foreground shadow-sm active:scale-[0.98]"
          >
            <Check className="h-4 w-4" />
            Accept
          </button>
          <button
            type="button"
            onClick={() => setCounterOpen(true)}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-accent text-xs font-semibold text-accent-foreground shadow-[var(--shadow-accent)] active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Counter
          </button>
          <button
            type="button"
            onClick={reject}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-destructive active:scale-[0.98]"
          >
            <X className="h-4 w-4" />
            Reject
          </button>
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Send counter offer</h3>
            <button
              type="button"
              onClick={() => setCounterOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="c-price">
              Your price (₦ / {last?.period ?? "week"})
            </label>
            <input
              id="c-price"
              type="number"
              inputMode="numeric"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
            />
            {last && (
              <p className="text-[11px] text-muted-foreground">
                Their last: {formatNaira(last.price)} / {last.period}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="c-notes">
              Notes <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="c-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground"
              placeholder="Explain what you'd like to change…"
            />
          </div>

          <button
            type="button"
            onClick={sendCounter}
            disabled={!price}
            className="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Send counter
          </button>
        </div>
      )}
    </div>
  );
}
