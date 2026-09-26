import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Zap, Users } from "lucide-react";
import heroImage from "@/assets/welcome-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Community Rides — Event Carpooling" },
      {
        name: "description",
        content:
          "Find trusted community rides to events, share empty seats, and travel together.",
      },
      { property: "og:title", content: "Community Rides — Event Carpooling" },
      {
        property: "og:description",
        content: "Community carpooling for events, organizations, churches, schools, and conferences.",
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
            Community event carpooling
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
            Travel together, <span className="text-accent">arrive together.</span>
          </h1>
          <p className="mt-3 text-base text-white/80">
            Find a ride to your event or share your empty seats with verified community members.
          </p>

          <div className="mt-auto space-y-2.5 pt-10">
            {[
              { icon: Users, label: "Pickup details protected until accepted" },
              { icon: ShieldCheck, label: "Verified community profiles" },
              { icon: Zap, label: "Built for organized event travel" },
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
          to="/community"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-semibold text-accent-foreground shadow-[var(--shadow-accent)] transition-transform active:scale-[0.98]"
        >
          Explore General Assembly rides
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
