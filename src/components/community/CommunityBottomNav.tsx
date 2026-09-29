import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, Car, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/events", label: "Explore", icon: Compass },
  { to: "/rides", label: "Trips", icon: Car },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function CommunityBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-background/95 backdrop-blur-xl border-t border-border z-50 pb-safe">
      <div className="mx-auto max-w-2xl flex items-center justify-around h-16 px-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active =
            (to === "/" && location.pathname === "/") ||
            (to !== "/" && location.pathname.startsWith(to)) ||
            (to === "/events" && location.pathname.startsWith("/event/"));

          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center gap-1 h-full w-16 transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className={`h-6 w-6 ${active && to === "/" ? "fill-primary/10" : ""}`} />
                {active && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-[10px] mt-1 ${active ? "font-black" : "font-bold"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
