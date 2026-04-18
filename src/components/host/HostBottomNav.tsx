import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Car, Send, Wallet, Compass, type LucideIcon } from "lucide-react";

type Item = {
  to: "/host" | "/host/vehicles" | "/host/offers" | "/host/engaged" | "/host/earnings";
  label: string;
  icon: LucideIcon;
  badge?: number;
};

export function HostBottomNav({ pendingOffers = 0 }: { pendingOffers?: number }) {
  const { pathname } = useLocation();
  const items: Item[] = [
    { to: "/host", label: "Home", icon: LayoutDashboard },
    { to: "/host/vehicles", label: "Vehicles", icon: Car },
    { to: "/host/offers", label: "Offers", icon: Send, badge: pendingOffers },
    { to: "/host/engaged", label: "Engaged", icon: Compass },
    { to: "/host/earnings", label: "Earnings", icon: Wallet },
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
      </ul>
    </nav>
  );
}
