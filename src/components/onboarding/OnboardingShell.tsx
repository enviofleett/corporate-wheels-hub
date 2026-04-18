import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface OnboardingShellProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function OnboardingShell({
  title,
  subtitle,
  backTo,
  children,
  footer,
}: OnboardingShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        {backTo ? (
          <Link
            to={backTo}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        ) : (
          <div className="h-9 w-9" />
        )}
        <div className="flex-1 text-center">
          <span className="text-sm font-semibold tracking-wide text-primary">FleetLink</span>
        </div>
        <div className="h-9 w-9" />
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold leading-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex-1">{children}</div>
      </main>

      {footer && (
        <footer className="sticky bottom-0 border-t border-border bg-background/95 px-5 py-4 backdrop-blur">
          <div className="mx-auto w-full max-w-md">{footer}</div>
        </footer>
      )}
    </div>
  );
}
