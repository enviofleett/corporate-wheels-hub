// Bottom sheet shown when a host taps "Offer vehicle" or "Counter offer".
// Phase 3 — on submit, points the host to the threaded Offers inbox.

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, Check, Info } from "lucide-react";
import type { CorporateRequest } from "@/lib/mock-data";
import { formatNaira } from "@/lib/format";

type Mode = "offer" | "counter";

type Props = {
  open: boolean;
  mode: Mode;
  request: CorporateRequest | null;
  onClose: () => void;
};

const MOCK_VEHICLES = [
  { id: "v1", label: "Toyota Hilux 2022 — White" },
  { id: "v2", label: "Mercedes Sprinter 2021 — Silver" },
  { id: "v3", label: "Honda Accord 2023 — Black" },
];

export function OfferSheet({ open, mode, request, onClose }: Props) {
  const [vehicleId, setVehicleId] = useState(MOCK_VEHICLES[0].id);
  const [price, setPrice] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open && request) {
      setPrice(request.budget.amount);
      setNotes("");
      setSubmitted(false);
      setVehicleId(MOCK_VEHICLES[0].id);
    }
  }, [open, request]);

  if (!open || !request) return null;

  const title = mode === "offer" ? "Offer your vehicle" : "Send a counter offer";
  const cta = mode === "offer" ? "Send offer" : "Send counter";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm md:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="offer-sheet-title"
        className="w-full max-w-md animate-in slide-in-from-bottom rounded-t-3xl bg-background shadow-[var(--shadow-elevated)] md:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="offer-sheet-title" className="text-base font-semibold text-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold">
              {mode === "offer" ? "Offer sent" : "Counter sent"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The corporate has been notified anonymously. You'll see updates in your Offers tab.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 items-center justify-center rounded-xl border border-border bg-background text-sm font-semibold text-foreground"
              >
                Done
              </button>
              <Link
                to="/offers"
                onClick={onClose}
                className="flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
              >
                View thread
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4 px-5 py-4"
          >
            {/* Context summary */}
            <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <div>
                <span className="font-medium text-foreground">{request.company.handle}</span> needs{" "}
                {request.vehicle.quantity}× {request.vehicle.type} in {request.location}.
                <br />
                Budget: <span className="font-medium text-foreground">
                  {formatNaira(request.budget.amount)}
                </span>{" "}
                / {request.budget.period}
              </div>
            </div>

            {/* Vehicle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="vehicle">
                Choose vehicle
              </label>
              <select
                id="vehicle"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
              >
                {MOCK_VEHICLES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="price">
                Your price (₦ / {request.budget.period})
              </label>
              <input
                id="price"
                type="number"
                inputMode="numeric"
                value={price || ""}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
                placeholder="0"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="notes">
                Notes <span className="text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground"
                placeholder={
                  mode === "counter"
                    ? "Explain your counter — what changes you propose"
                    : "Add anything the corporate should know"
                }
              />
            </div>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)] transition-transform active:scale-[0.98]"
            >
              {cta}
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              Your identity stays hidden until the corporate accepts.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
