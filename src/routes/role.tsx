import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Building2, Car, ChevronRight, ShieldCheck, AlertCircle } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { setRole, useRole, type AppRole } from "@/lib/role-store";

export const Route = createFileRoute("/role")({
  validateSearch: (search: Record<string, unknown>): { from?: string } => {
    const from = typeof search.from === "string" ? search.from : undefined;
    return from ? { from } : {};
  },
  head: () => ({
    meta: [
      { title: "Choose your role — FleetLink" },
      { name: "description", content: "Sign up as a corporate or as a vehicle host on FleetLink." },
    ],
  }),
  component: RoleScreen,
});

const CORPORATE_ROUTES = [
  "/corporate (dashboard)",
  "/corporate/requests",
  "/corporate/offers",
  "/corporate/deals",
  "/feed · /offers",
  "/payments · /payments/methods · /payments/receipts",
  "/trust · /trust/kyc · /trust/disputes · /trust/reviews",
];

const HOST_ROUTES = [
  "/host (dashboard)",
  "/host/vehicles",
  "/host/offers",
  "/host/engaged",
  "/host/earnings",
  "/feed · /offers",
  "/payments · /payments/methods · /payments/receipts · /payments/payouts",
  "/trust · /trust/kyc · /trust/disputes · /trust/reviews",
];

const ADMIN_ROUTES = [
  "/admin (dashboard)",
  "/admin/users · /admin/kyc",
  "/admin/disputes · /admin/moderation",
  "/admin/finance (transactions, payouts)",
  "/admin/audit · /admin/announcements · /admin/settings",
];

function ownerOfPath(path: string): AppRole | null {
  if (path.startsWith("/corporate")) return "corporate";
  if (path.startsWith("/host")) return "host";
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/payments/payouts")) return "host";
  return null;
}

function RoleScreen() {
  const navigate = useNavigate();
  const { from } = Route.useSearch();
  const currentRole = useRole();

  const choose = (role: AppRole, to: string) => {
    setRole(role);
    navigate({ to });
  };

  const blockedOwner = from ? ownerOfPath(from) : null;

  return (
    <OnboardingShell
      title="How will you use FleetLink?"
      subtitle="Each role unlocks its own dashboard. You can switch later."
      backTo="/"
    >
      {currentRole && (
        <div className="mb-3 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2 text-xs">
          <span className="text-muted-foreground">
            Signed in as <span className="font-semibold text-foreground capitalize">{currentRole}</span>
          </span>
          <Link to="/" className="font-semibold text-accent">
            Go home
          </Link>
        </div>
      )}

      {from && (
        <div className="mb-3 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p className="text-foreground">
            You tried to open <span className="font-mono font-semibold">{from}</span>
            {blockedOwner ? (
              <>
                {" "}— that page is for{" "}
                <span className="font-semibold capitalize">{blockedOwner}s</span>. Pick the matching
                role to continue.
              </>
            ) : (
              <> — pick a role first to continue.</>
            )}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <RoleCard
          onClick={() => choose("corporate", "/signup/corporate")}
          icon={<Building2 className="h-6 w-6" />}
          title="Corporate"
          description="Post rental requests, receive offers from vetted hosts."
          tags={["Post requests", "Compare offers", "Escrow"]}
          routes={CORPORATE_ROUTES}
          highlight={blockedOwner === "corporate"}
          active={currentRole === "corporate"}
        />
        <RoleCard
          onClick={() => choose("host", "/signup/host")}
          icon={<Car className="h-6 w-6" />}
          title="Host"
          description="List your vehicles and respond to corporate requests."
          tags={["Earn weekly", "Choose deals", "Telematics"]}
          routes={HOST_ROUTES}
          accent
          highlight={blockedOwner === "host"}
          active={currentRole === "host"}
        />
        <RoleCard
          onClick={() => choose("admin", "/admin")}
          icon={<ShieldCheck className="h-6 w-6" />}
          title="Admin"
          description="Internal tools — manage users, KYC, disputes, finance."
          tags={["Internal only", "2FA required"]}
          routes={ADMIN_ROUTES}
          highlight={blockedOwner === "admin"}
          active={currentRole === "admin"}
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
  routes: string[];
  accent?: boolean;
  highlight?: boolean;
  active?: boolean;
}

function RoleCard({
  onClick,
  icon,
  title,
  description,
  tags,
  routes,
  accent,
  highlight,
  active,
}: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-start gap-4 rounded-2xl border bg-card p-5 text-left shadow-[var(--shadow-card)] transition-all hover:border-accent hover:shadow-[var(--shadow-elevated)] ${
        highlight ? "border-warning ring-2 ring-warning/30" : "border-border"
      }`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          accent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {active && (
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                Active
              </span>
            )}
          </div>
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
        <div className="mt-3 rounded-lg bg-muted/40 p-2.5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Pages you'll see
          </p>
          <ul className="space-y-0.5">
            {routes.map((r) => (
              <li key={r} className="font-mono text-[10px] leading-snug text-foreground/80">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}
