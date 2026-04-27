import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, Car, ChevronRight, ShieldCheck } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { setRole, type AppRole } from "@/lib/role-store";

export const Route = createFileRoute("/role")({
  head: () => ({
    meta: [
      { title: "Choose your role — FleetLink" },
      { name: "description", content: "Sign up as a corporate or as a vehicle host on FleetLink." },
    ],
  }),
  component: RoleScreen,
});

function RoleScreen() {
  const navigate = useNavigate();

  const choose = (role: AppRole, to: string) => {
    setRole(role);
    navigate({ to });
  };

  return (
    <OnboardingShell
      title="How will you use FleetLink?"
      subtitle="You can switch later. Pick what fits today."
      backTo="/"
    >
      <div className="space-y-3">
        <RoleCard
          onClick={() => choose("corporate", "/signup/corporate")}
          icon={<Building2 className="h-6 w-6" />}
          title="Corporate"
          description="Post rental requests, receive offers from vetted hosts."
          tags={["Post requests", "Compare offers", "Escrow"]}
        />
        <RoleCard
          onClick={() => choose("host", "/signup/host")}
          icon={<Car className="h-6 w-6" />}
          title="Host"
          description="List your vehicles and respond to corporate requests."
          tags={["Earn weekly", "Choose deals", "Telematics"]}
          accent
        />
        <RoleCard
          onClick={() => choose("admin", "/admin")}
          icon={<ShieldCheck className="h-6 w-6" />}
          title="Admin"
          description="Internal tools — manage users, KYC, disputes, finance, and more."
          tags={["Internal only", "2FA required"]}
        />
      </div>

      <div className="mt-8 rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
        Identities stay anonymous on both sides until an offer is accepted.
      </div>
    </OnboardingShell>
  );
}

interface RoleCardProps {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  accent?: boolean;
}

function RoleCard({ onClick, icon, title, description, tags, accent }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-[var(--shadow-card)] transition-all hover:border-accent hover:shadow-[var(--shadow-elevated)]"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          accent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
