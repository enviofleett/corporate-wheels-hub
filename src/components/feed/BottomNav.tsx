import { Link, useLocation } from "@tanstack/react-router";
import { Home, Inbox, PlusCircle, Car, User } from "lucide-react";

const items = [
  { to: "/feed", label: "Feed", icon: Home },
  { to: "/feed", label: "Offers", icon: Inbox, disabled: true },
  { to: "/feed", label: "Post", icon: PlusCircle, primary: true },
  { to: "/feed", label: "Vehicles", icon: Car, disabled: true },
  { to: "/feed", label: "Profile", icon: User, disabled: true },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-md grid-cols-5 items-end px-2 pt-1.5">
        {items.map(({ to, label, icon: Icon, disabled, primary }) => {
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
          return (
            <li key={label} className="flex justify-center">
              <Link
                to={to}
                disabled={disabled}
                className={`flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
                  isActive
                    ? "text-primary"
                    : disabled
                      ? "text-muted-foreground/50"
                      : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
