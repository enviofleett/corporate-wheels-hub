import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  back?: boolean;
};

export function TrustTopBar({ title, subtitle, back = true }: Props) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between gap-2 px-5">
        {back ? (
          <button
            type="button"
            onClick={() => router.history.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : (
          <span className="h-9 w-9" />
        )}
        <Link to="/trust" className="flex items-center gap-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
          </span>
          <span className="text-sm font-bold text-foreground">Trust &amp; Safety</span>
        </Link>
        <span className="h-9 w-9" />
      </div>
      <div className="mx-auto w-full max-w-md px-5 pb-3">
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </header>
  );
}
