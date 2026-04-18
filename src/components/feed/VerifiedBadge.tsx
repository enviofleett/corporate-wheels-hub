import { BadgeCheck, Sparkles } from "lucide-react";
import type { VerificationLevel } from "@/lib/mock-data";

export function VerifiedBadge({ level }: { level: VerificationLevel }) {
  if (level === "premium") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
        <Sparkles className="h-3 w-3" />
        Premium
      </span>
    );
  }
  if (level === "verified") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
        <BadgeCheck className="h-3 w-3" />
        Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
      New
    </span>
  );
}
