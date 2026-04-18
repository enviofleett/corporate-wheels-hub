import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { StepProgress } from "@/components/onboarding/StepProgress";
import { UploadField } from "@/components/onboarding/UploadField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup/host")({
  head: () => ({
    meta: [
      { title: "Host signup — FleetLink" },
      { name: "description", content: "List your vehicles and earn from corporate rentals." },
    ],
  }),
  component: HostSignup,
});

const STEPS = ["Personal", "Verification", "First vehicle"];

function HostSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const next = () => {
    if (step < STEPS.length) setStep(step + 1);
    else navigate({ to: "/terms", search: { role: "host" } });
  };
  const back = () => (step > 1 ? setStep(step - 1) : navigate({ to: "/role" }));

  return (
    <OnboardingShell
      title={
        step === 1
          ? "Your details"
          : step === 2
            ? "Verify your identity"
            : "Add your first vehicle"
      }
      subtitle={
        step === 1
          ? "Stays private. Corporates only see your host ID."
          : step === 2
            ? "We verify all hosts before listings go live."
            : "You can add more vehicles after signup."
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
          <Field label="Full name" placeholder="John Doe" />
          <Field label="Phone number" placeholder="+234 800 000 0000" type="tel" />
          <Field label="Email" placeholder="john@example.com" type="email" />
          <Field label="City" placeholder="Lagos" />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Field label="ID type" placeholder="NIN, Driver's License, Passport" />
          <Field label="ID number" placeholder="1234 5678 9012" />
          <UploadField label="Upload government ID" hint="Front and back combined" />
          <UploadField label="Selfie verification" hint="Hold ID next to your face" />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Field label="Vehicle type" placeholder="SUV, Sedan, Bus, Pickup..." />
          <Field label="Make & model" placeholder="Toyota Hilux 2022" />
          <Field label="Plate number" placeholder="LAG-123-AB" />
          <UploadField label="Upload vehicle papers" hint="Insurance + registration" />
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
