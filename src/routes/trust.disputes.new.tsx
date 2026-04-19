import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CheckCircle2, Paperclip, X } from "lucide-react";
import { useState } from "react";
import { TrustTopBar } from "@/components/trust/TrustTopBar";
import { REASON_LABELS, type DisputeReason } from "@/lib/trust-data";

export const Route = createFileRoute("/trust/disputes/new")({
  head: () => ({
    meta: [
      { title: "Report a dispute — FleetLink" },
      { name: "description", content: "Open a formal dispute on a rental deal." },
    ],
  }),
  component: NewDisputePage,
});

const DEALS = [
  { id: "DEAL-119", label: "DEAL-119 · Mercedes Sprinter · Quiet Harbor Logistics" },
  { id: "DEAL-104", label: "DEAL-104 · Toyota Hilux · Bright Anchor FMCG" },
  { id: "DEAL-128", label: "DEAL-128 · Toyota Hiace · Stellar Field Ops" },
];

const REASONS: DisputeReason[] = [
  "vehicle_condition",
  "late_delivery",
  "no_show",
  "payment",
  "behavior",
  "other",
];

function NewDisputePage() {
  const router = useRouter();
  const [dealId, setDealId] = useState(DEALS[0]!.id);
  const [reason, setReason] = useState<DisputeReason>("vehicle_condition");
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const charLeft = 500 - summary.length;
  const valid = summary.trim().length >= 20 && summary.length <= 500;

  if (submitted) {
    return (
      <>
        <TrustTopBar title="Report a dispute" back={false} />
        <main className="mx-auto w-full max-w-md px-5 pt-10">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-foreground">Dispute submitted</h2>
            <p className="mt-2 max-w-xs text-xs text-muted-foreground">
              Our trust team will review within 24 hours and contact both parties. Funds for this
              deal are held in escrow until resolution.
            </p>
            <button
              type="button"
              onClick={() => router.navigate({ to: "/trust/disputes" })}
              className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
            >
              View my disputes
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <TrustTopBar title="Report a dispute" subtitle="Provide as much detail as possible." />

      <main className="mx-auto w-full max-w-md space-y-5 px-5 pt-4 pb-32">
        {/* Deal */}
        <Field label="Which deal?">
          <select
            value={dealId}
            onChange={(e) => setDealId(e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {DEALS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Reason */}
        <Field label="Reason">
          <div className="grid grid-cols-2 gap-2">
            {REASONS.map((r) => {
              const active = r === reason;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                    active
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {REASON_LABELS[r]}
                </button>
              );
            })}
          </div>
        </Field>

        {/* Summary */}
        <Field
          label="What happened?"
          hint={`${charLeft} character${charLeft === 1 ? "" : "s"} left`}
        >
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value.slice(0, 500))}
            rows={5}
            placeholder="Describe the issue with dates, locations, and amounts where possible."
            className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        {/* Evidence */}
        <Field label="Evidence (photos, receipts)">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() =>
                setFiles((f) => [...f, `evidence-${f.length + 1}.jpg`].slice(0, 5))
              }
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 text-xs font-semibold text-muted-foreground"
            >
              <Paperclip className="h-4 w-4" />
              {files.length === 0 ? "Attach evidence" : "Attach more"}
            </button>
            {files.length > 0 && (
              <ul className="space-y-1.5">
                {files.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs"
                  >
                    <span className="truncate text-foreground">{f}</span>
                    <button
                      type="button"
                      onClick={() => setFiles((arr) => arr.filter((_, idx) => idx !== i))}
                      className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                      aria-label={`Remove ${f}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Field>

        <p className="rounded-xl bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
          By submitting, you confirm details are accurate. False claims may result in account
          suspension. Funds remain in escrow until resolution.
        </p>
      </main>

      {/* Sticky submit */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md gap-2 px-5 py-3">
          <button
            type="button"
            onClick={() => router.history.back()}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-border bg-background text-sm font-semibold text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => setSubmitted(true)}
            className="flex h-11 flex-[1.4] items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit dispute
          </button>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">{label}</label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
