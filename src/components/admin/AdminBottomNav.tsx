import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Banknote,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

type Item = {
  to: "/admin" | "/admin/users" | "/admin/moderation" | "/admin/finance" | "/admin/more";
  label: string;
  icon: LucideIcon;
  badge?: number;
};

export function AdminBottomNav({
  pendingMod = 0,
  pendingPayouts = 0,
}: {
  pendingMod?: number;
  pendingPayouts?: number;
}) {
  const { pathname } = useLocation();
  const items: Item[] = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/moderation", label: "Trust", icon: ShieldAlert, badge: pendingMod },
    { to: "/admin/finance", label: "Finance", icon: Banknote, badge: pendingPayouts },
    { to: "/admin/more", label: "More", icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-md grid-cols-5 items-end px-2 pt-1.5">
        {items.map(({ to, label, icon: Icon, badge }) => {
          const isActive = to === "/admin" ? pathname === "/admin" : pathname.startsWith(to);
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
                    <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
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
