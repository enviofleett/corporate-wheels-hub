import { Link, useLocation } from "@tanstack/react-router";
import { Home, Inbox, PlusCircle, Car, User, type LucideIcon } from "lucide-react";
import { unreadCount } from "@/lib/negotiations";

type Item = {
  to: "/feed" | "/offers";
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  primary?: boolean;
  badge?: number;
};

export function BottomNav() {
  const { pathname } = useLocation();
  const unread = unreadCount();

  const items: Item[] = [
    { to: "/feed", label: "Feed", icon: Home },
    { to: "/offers", label: "Offers", icon: Inbox, badge: unread },
    { to: "/feed", label: "Post", icon: PlusCircle, primary: true },
    { to: "/feed", label: "Vehicles", icon: Car, disabled: true },
    { to: "/feed", label: "Profile", icon: User, disabled: true },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-md grid-cols-5 items-end px-2 pt-1.5">
        {items.map(({ to, label, icon: Icon, disabled, primary, badge }) => {
          const isActive = pathname === to && !disabled && !primary;
          if (primary) {
            return (
              <li key={label} className="flex justify-center">
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
          if (disabled) {
            return (
              <li key={label} className="flex justify-center">
                <span className="flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-muted-foreground/50">
                  <Icon className="h-5 w-5" />
                  {label}
                </span>
              </li>
            );
          }
          return (
            <li key={label} className="flex justify-center">
              <Link
                to={to}
                className={`relative flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {badge && badge > 0 ? (
                    <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-accent-foreground">
                      {badge}
                    </span>
                  ) : null}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
