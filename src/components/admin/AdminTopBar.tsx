import { Link } from "@tanstack/react-router";
import type {ReactNode} from "react";
import { ArrowLeft, Bell, ShieldCheck, Sparkles } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  backTo?: string;
  showSearch?: boolean;
  rightSlot?: ReactNode;
};

export function AdminTopBar({ title, subtitle, backTo, rightSlot }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between gap-2 px-5">
        <div className="flex items-center gap-2 min-w-0">
          {backTo ? (
            <Link
              to={backTo}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          ) : (
            <Link to="/admin" className="flex items-center gap-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
              </span>
              <span className="text-base font-bold text-foreground">Community Rides</span>
              <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive">
                <ShieldCheck className="h-3 w-3" />
                Admin
              </span>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-1">
          {rightSlot}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
          </button>
        </div>
      </div>
      {(title || subtitle) && (
        <div className="mx-auto w-full max-w-md px-5 pb-3">
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      )}
    </header>
  );
}
