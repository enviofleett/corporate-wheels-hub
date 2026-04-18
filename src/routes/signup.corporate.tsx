import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { StepProgress } from "@/components/onboarding/StepProgress";
import { UploadField } from "@/components/onboarding/UploadField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup/corporate")({
  head: () => ({
    meta: [
      { title: "Corporate signup — FleetLink" },
      { name: "description", content: "Create a corporate account to request vehicle rentals." },
    ],
  }),
  component: CorporateSignup,
});

const STEPS = ["Company", "Contact", "Banking"];

function CorporateSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const next = () => {
    if (step < STEPS.length) setStep(step + 1);
    else navigate({ to: "/terms", search: { role: "corporate" } });
  };
  const back = () => (step > 1 ? setStep(step - 1) : navigate({ to: "/role" }));

  return (
    <OnboardingShell
      title={
        step === 1 ? "Tell us about your company" : step === 2 ? "Primary contact" : "Bank account"
      }
      subtitle={
        step === 1
          ? "We use this to verify your business."
          : step === 2
            ? "Who should we contact for approvals?"
            : "Where deposits and refunds will go."
      }
      backTo="/role"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={back}
            className="h-12 flex-1 rounded-xl border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            className="h-12 flex-[2] rounded-xl bg-accent text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)] transition-transform active:scale-[0.98]"
          >
            {step === STEPS.length ? "Continue" : "Next"}
          </button>
        </div>
      }
    >
      <div className="mb-6">
        <StepProgress current={step} total={STEPS.length} label={STEPS[step - 1]} />
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <Field label="Company name" placeholder="Acme Logistics Ltd" />
          <Field label="CAC registration number" placeholder="RC1234567" />
          <Field label="Business address" placeholder="12 Marina Road, Lagos" />
          <Field label="Industry" placeholder="Logistics, FMCG, Oil & Gas..." />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Field label="Full name" placeholder="Jane Doe" />
          <Field label="Phone number" placeholder="+234 800 000 0000" type="tel" />
          <Field label="Work email" placeholder="jane@acme.com" type="email" />
          <UploadField label="Upload contact ID" hint="JPG or PDF, max 5MB" />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Field label="Bank name" placeholder="GTBank" />
          <Field label="Account number" placeholder="0123456789" />
          <Field label="Account name" placeholder="Acme Logistics Ltd" />
          <div className="rounded-xl bg-primary-soft p-3 text-xs text-primary">
            We never share account details with hosts. Used only for refunds and payouts.
          </div>
        </div>
      )}
    </OnboardingShell>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <Input type={type} placeholder={placeholder} className="h-12 rounded-xl bg-background" />
    </div>
  );
}
