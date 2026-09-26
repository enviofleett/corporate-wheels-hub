import { Link, useLocation } from "@tanstack/react-router";
import { Home, CalendarDays, Search, PlusCircle, CarFront } from "lucide-react";

const items = [
  { to: "/community", label: "Home", icon: Home },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/find", label: "Find", icon: Search },
  { to: "/offer", label: "Offer", icon: PlusCircle },
  { to: "/rides", label: "My Rides", icon: CarFront },
] as const;

export function CommunityBottomNav() {
  const location = useLocation();
  return <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
    <div className="mx-auto grid max-w-md grid-cols-5 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2">
      {items.map(({to,label,icon:Icon}) => {
        const active = location.pathname === to || (to === "/rides" && location.pathname.startsWith("/rides/"));
        return <Link key={to} to={to} className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
          <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
          {label}
        </Link>
      })}
    </div>
  </nav>;
}