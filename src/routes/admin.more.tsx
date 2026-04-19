import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Cog,
  LogOut,
  Megaphone,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  UsersRound,
} from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export const Route = createFileRoute("/admin/more")({
  head: () => ({ meta: [{ title: "Admin tools — More" }] }),
  component: MoreScreen,
});

const SECTIONS: {
  title: string;
  items: {
    to:
      | "/admin/kyc"
      | "/admin/disputes"
      | "/admin/moderation"
      | "/admin/audit"
      | "/admin/announcements"
      | "/admin/settings";
    icon: typeof Cog;
    label: string;
    hint: string;
  }[];
}[] = [
  {
    title: "Trust & safety",
    items: [
      {
        to: "/admin/kyc",
        icon: ShieldCheck,
        label: "KYC queue",
        hint: "Verify identities and businesses",
      },
      {
        to: "/admin/disputes",
        icon: ShieldAlert,
        label: "Disputes",
        hint: "Mediate and resolve issues",
      },
      {
        to: "/admin/moderation",
        icon: UsersRound,
        label: "Content moderation",
        hint: "Reported posts, reviews, listings",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        to: "/admin/audit",
        icon: ScrollText,
        label: "Audit log",
        hint: "All admin actions, signed",
      },
      {
        to: "/admin/announcements",
        icon: Megaphone,
        label: "Announcements",
        hint: "Broadcast to hosts or corporates",
      },
      {
        to: "/admin/settings",
        icon: Cog,
        label: "Platform settings",
        hint: "Fees, limits, feature flags",
      },
    ],
  },
];

function MoreScreen() {
  return (
    <>
      <AdminTopBar title="More tools" subtitle="Admin operations" />
      <main className="mx-auto w-full max-w-md space-y-5 px-5 pt-4">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {s.title}
            </h2>
            <div className="space-y-2">
              {s.items.map((it) => (
                <Link
                  key={it.to}
                  to={it.to}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <it.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{it.label}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{it.hint}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Session
          </h2>
          <div className="space-y-2">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left shadow-[var(--shadow-card)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <UserCog className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">admin@fleetlink</p>
                <p className="text-[11px] text-muted-foreground">Super admin · 2FA on</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <Link
              to="/role"
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm font-semibold text-foreground">
                Switch role
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
