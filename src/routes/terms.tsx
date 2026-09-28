import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ShieldCheck, UsersRound, MapPin, FileText } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & agreements — Community Rides" },
      {
        name: "description",
        content: "Community Rides participation, safety and privacy terms.",
      },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-8">
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-primary">
        Community Rides
      </p>
      <h1 className="mt-2 text-3xl font-black">Terms & participation rules</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        These are the frontend contract for member and organization participation.
        Organization-specific ride rules can add requirements but should not override platform
        safety or privacy controls.
      </p>

      <div className="mt-6 space-y-3">
        <Card
          icon={<ShieldCheck />}
          title="Safety & verification"
          text="Organizations may require member, driver and vehicle verification before ride participation. Drivers must follow organization approval rules."
        />
        <Card
          icon={<UsersRound />}
          title="Community conduct"
          text="Drivers and passengers must treat each other respectfully, follow event instructions and use the platform only for legitimate community travel."
        />
        <Card
          icon={<MapPin />}
          title="Location privacy"
          text="Broad pickup areas may be public, while exact meeting points and sensitive contact details should only be shared when appropriate for an accepted ride."
        />
        <Card
          icon={<FileText />}
          title="Contributions & commission"
          text="Where passenger contributions are enabled, the event or organization policy must clearly state any organization commission before a member confirms participation."
        />
      </div>

      <div className="mt-7 rounded-2xl border bg-muted/30 p-4 text-xs leading-5 text-muted-foreground">
        Backend integration should record the version of the platform terms and organization rules
        accepted by each member, together with the acceptance timestamp.
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Link
          to="/role"
          className="flex h-11 items-center justify-center rounded-xl border text-sm font-bold"
        >
          Choose workspace
        </Link>
        <Link
          to="/events"
          className="flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground"
        >
          Browse events
        </Link>
      </div>
    </main>
  );
}

function Card({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <section className="flex gap-3 rounded-2xl border bg-card p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>
      <div>
        <h2 className="text-sm font-black">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
      </div>
    </section>
  );
}
