import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { TrustTopBar } from "@/components/trust/TrustTopBar";
import { KycStepRow } from "@/components/trust/KycStepRow";
import { getKycProfile } from "@/lib/trust-data";
import { withRole } from "@/components/auth/withRole";

export const Route = createFileRoute("/trust/kyc")({
  head: () => ({
    meta: [
      { title: "Verification — FleetLink" },
      {
        name: "description",
        content:
          "Track identity, driver and vehicle verification for community rides.",
      },
    ],
  }),
  component: withRole(["corporate", "host", "admin"], KycPage),
});

function KycPage() {
  const kyc = getKycProfile();
  const completed = kyc.steps.filter((s) => s.status === "complete").length;
  const required = kyc.steps.filter((s) => s.required);
  const optional = kyc.steps.filter((s) => !s.required);
  const requiredDone = required.filter((s) => s.status === "complete").length;

  return (
    <>
      <TrustTopBar title="Verification" subtitle="Complete the checks required to offer or join community rides." />

      <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4 pb-24">
        {/* Progress card */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Overall progress
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {completed}
                <span className="text-base font-medium text-muted-foreground">
                  /{kyc.steps.length}
                </span>
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              {kyc.level}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${kyc.trustScore}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {requiredDone}/{required.length} required safety checks complete.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Required
          </h2>
          {required.map((step) => (
            <KycStepRow key={step.id} step={step} />
          ))}
        </section>

        {optional.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Optional
            </h2>
            {optional.map((step) => (
              <KycStepRow key={step.id} step={step} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}
