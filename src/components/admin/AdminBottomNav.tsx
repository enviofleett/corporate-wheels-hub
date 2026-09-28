import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  ShieldAlert,
  Banknote,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
type Item = {
  to: "/admin" | "/admin/organizations" | "/admin/safety" | "/admin/billing" | "/admin/more";
  label: string;
  icon: LucideIcon;
};
const items: Item[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/organizations", label: "Organizations", icon: Building2 },
  { to: "/admin/safety", label: "Safety", icon: ShieldAlert },
  { to: "/admin/billing", label: "Billing", icon: Banknote },
  { to: "/admin/more", label: "More", icon: MoreHorizontal },
];
export function AdminBottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-md grid-cols-5 items-end px-2 pt-1.5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/admin" ? pathname === "/admin" : pathname.startsWith(to);
          return (
            <li key={label}>
              <Link
                to={to}
                className={`flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}
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
