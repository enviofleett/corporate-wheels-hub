import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Sparkles } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  backTo?: string;
};

export function PaymentsTopBar({ title, subtitle, backTo }: Props) {
  const router = useRouter();

  function handleBack(e: React.MouseEvent) {
    if (backTo) return;
    e.preventDefault();
    router.history.back();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-md items-center gap-2 px-3">
        {backTo ? (
          <Link
            to={backTo}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </span>
          <span className="text-base font-bold text-foreground">FleetLink</span>
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
