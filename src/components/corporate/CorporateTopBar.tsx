import { Link } from "@tanstack/react-router";
import { Bell, Plus, Sparkles } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  showPost?: boolean;
};

export function CorporateTopBar({ title, subtitle, showPost = true }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between gap-2 px-5">
        <Link to="/corporate" className="flex items-center gap-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </span>
          <span className="text-base font-bold text-foreground">FleetLink</span>
        </Link>
        <div className="flex items-center gap-1">
          {showPost && (
            <button
              type="button"
              className="flex h-9 items-center gap-1 rounded-full bg-accent px-3 text-xs font-semibold text-accent-foreground shadow-[var(--shadow-accent)]"
            >
              <Plus className="h-3.5 w-3.5" />
              New request
            </button>
          )}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
          </button>
        </div>
      </div>
      {(title || subtitle) && (
        <div className="mx-auto w-full max-w-md px-5 pb-3">
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
    </header>
  );
}
