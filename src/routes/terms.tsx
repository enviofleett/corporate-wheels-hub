import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Wifi, FileText } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Checkbox } from "@/components/ui/checkbox";

type SearchParams = { role?: "corporate" | "host" };

export const Route = createFileRoute("/terms")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    role: search.role === "host" ? "host" : "corporate",
  }),
  head: () => ({
    meta: [
      { title: "Terms & agreements — FleetLink" },
      { name: "description", content: "Review and accept FleetLink platform agreements." },
    ],
  }),
  component: TermsScreen,
});

function TermsScreen() {
  const { role } = Route.useSearch();
  const navigate = useNavigate();
  const [escrow, setEscrow] = useState(false);
  const [telematics, setTelematics] = useState(false);
  const [rules, setRules] = useState(false);

  const allAccepted = escrow && telematics && rules;

  const finish = () => {
    navigate({ to: role === "host" ? "/host" : "/corporate" });
  };

  return (
    <OnboardingShell
      title="One last thing"
      subtitle="Review and accept these to keep the platform safe for everyone."
      backTo={role === "host" ? "/signup/host" : "/signup/corporate"}
      footer={
        <button
          type="button"
          disabled={!allAccepted}
          onClick={finish}
          className="h-12 w-full rounded-xl bg-accent text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          {allAccepted ? "Create account" : "Accept all to continue"}
        </button>
      }
    >
      <div className="space-y-3">
        <TermCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Escrow usage"
          description="All payments are held in escrow by FleetLink and released to hosts only after rental milestones are met."
          checked={escrow}
          onChange={setEscrow}
        />
        <TermCard
          icon={<Wifi className="h-5 w-5" />}
          title="Telematics requirement"
          description="Hosts agree to allow telematics on rented vehicles for trip transparency, safety, and dispute resolution."
          checked={telematics}
          onChange={setTelematics}
        />
        <TermCard
          icon={<FileText className="h-5 w-5" />}
          title="Platform rules"
          description="No off-platform contact before deal acceptance. Anonymous identities are protected. Misuse leads to suspension."
          checked={rules}
          onChange={setRules}
        />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Read the full{" "}
        <a className="underline" href="#">
          Terms of Service
        </a>{" "}
        and{" "}
        <a className="underline" href="#">
          Privacy Policy
        </a>
        .
      </p>
    </OnboardingShell>
  );
}

interface TermCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function TermCard({ icon, title, description, checked, onChange }: TermCardProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-card p-4 transition-all ${
        checked ? "border-accent bg-accent-soft/40" : "border-border hover:border-muted-foreground/30"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          checked ? "bg-accent text-accent-foreground" : "bg-primary-soft text-primary"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <Checkbox
            checked={checked}
            onCheckedChange={(v) => onChange(v === true)}
            className="data-[state=checked]:border-accent data-[state=checked]:bg-accent"
          />
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </label>
  );
}
