import { Link, useLocation } from "@tanstack/react-router";
import { Home, Inbox, PlusCircle, type LucideIcon } from "lucide-react";
import { unreadCount } from "@/lib/negotiations";
import { useRole } from "@/lib/role-store";

type Slot =
  | {
      kind: "link";
      to: "/feed" | "/offers" | "/host" | "/corporate";
      label: string;
      icon: LucideIcon;
      badge?: number;
    }
  | { kind: "primary"; label: string; icon: LucideIcon }
  | { kind: "disabled"; label: string; icon: LucideIcon };

export function BottomNav() {
  const { pathname } = useLocation();
  const role = useRole();
  const unread = unreadCount(role ?? undefined);

  const homeSlot: Slot =
    role === "host"
      ? { kind: "link", to: "/host", label: "Dashboard", icon: Home }
      : role === "corporate"
        ? { kind: "link", to: "/corporate", label: "Dashboard", icon: Home }
        : { kind: "link", to: "/feed", label: "Feed", icon: Home };

  const items: Slot[] = [
    { kind: "link", to: "/feed", label: "Feed", icon: Home },
    { kind: "link", to: "/offers", label: "Offers", icon: Inbox, badge: unread },
    // Only corporates "post requests"; hosts respond to them.
    role === "corporate"
      ? { kind: "primary", label: "Post", icon: PlusCircle }
      : { kind: "disabled", label: "Post", icon: PlusCircle },
    homeSlot,
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-md grid-cols-4 items-end px-2 pt-1.5">
        {items.map((item, i) => {
          if (item.kind === "primary") {
            const Icon = item.icon;
            return (
              <li key={`${item.label}-${i}`} className="flex justify-center">
                <button
                  type="button"
                  className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-accent)]"
                  aria-label="Create post"
                >
                  <Icon className="h-5 w-5" />
                </button>
              </li>
            );
          }
          if (item.kind === "disabled") {
            const Icon = item.icon;
            return (
              <li key={`${item.label}-${i}`} className="flex justify-center">
                <span className="flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-muted-foreground/50">
                  <Icon className="h-5 w-5" />
                  {item.label}
                </span>
              </li>
            );
          }
          const Icon = item.icon;
          const isActive = pathname === item.to;
          return (
            <li key={`${item.label}-${i}`} className="flex justify-center">
              <Link
                to={item.to}
                className={`relative flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-accent-foreground">
                      {item.badge}
                    </span>
                  ) : null}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
