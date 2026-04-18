import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Zap, Users } from "lucide-react";
import heroImage from "@/assets/welcome-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FleetLink — Corporate Vehicle Rental Marketplace" },
      {
        name: "description",
        content:
          "Connect corporates with trusted vehicle hosts. Post requests, receive offers, and rent securely with escrow.",
      },
      { property: "og:title", content: "FleetLink — Corporate Vehicle Rental Marketplace" },
      {
        property: "og:description",
        content: "Anonymous, escrow-protected vehicle rentals between corporates and hosts.",
      },
    ],
  }),
  component: WelcomeScreen,
});

function WelcomeScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <div className="relative flex-1 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-30">
          <img
            src={heroImage}
            alt="Fleet of corporate vehicles"
            width={1024}
            height={1024}
            className="h-full w-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.24 0.06 258 / 0.4) 0%, oklch(0.24 0.06 258 / 0.95) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex h-full min-h-[60vh] w-full max-w-md flex-col px-6 pb-10 pt-16">
          <div className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Corporate vehicle marketplace
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
            Fleet rentals, <span className="text-accent">simplified.</span>
          </h1>
          <p className="mt-3 text-base text-white/80">
            Post requests. Receive offers. Rent vehicles securely — protected by escrow.
          </p>

          <div className="mt-auto space-y-2.5 pt-10">
            {[
              { icon: Users, label: "Anonymous matching until agreement" },
              { icon: ShieldCheck, label: "Escrow-protected payments" },
              { icon: Zap, label: "Telematics for full transparency" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-white/90">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto w-full max-w-md space-y-3 px-6 py-6">
        <Link
          to="/role"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-semibold text-accent-foreground shadow-[var(--shadow-accent)] transition-transform active:scale-[0.98]"
        >
          Get started
        </Link>
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center rounded-xl border border-border bg-background text-base font-medium text-foreground transition-colors hover:bg-muted"
        >
          I already have an account
        </button>
        <p className="pt-1 text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
