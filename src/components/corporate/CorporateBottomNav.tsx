import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  Inbox,
  Handshake,
  User,
  type LucideIcon,
} from "lucide-react";

type Item = {
  to: "/corporate" | "/corporate/requests" | "/corporate/offers" | "/corporate/deals";
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: number;
};

export function CorporateBottomNav({ unreadOffers = 0 }: { unreadOffers?: number }) {
  const { pathname } = useLocation();
  const items: Item[] = [
    { to: "/corporate", label: "Home", icon: LayoutDashboard },
    { to: "/corporate/requests", label: "Requests", icon: ListChecks },
    { to: "/corporate/offers", label: "Offers", icon: Inbox, badge: unreadOffers },
    { to: "/corporate/deals", label: "Deals", icon: Handshake },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-md grid-cols-5 items-end px-2 pt-1.5">
        {items.map(({ to, label, icon: Icon, badge }) => {
          const isActive = pathname === to;
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
        <li className="flex justify-center">
          <span className="flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-muted-foreground/50">
            <User className="h-5 w-5" />
            Account
          </span>
        </li>
      </ul>
    </nav>
  );
}
