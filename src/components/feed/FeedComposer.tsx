// Compact "create request" prompt shown at the top of the feed.

import { Plus } from "lucide-react";
import { CompanyAvatar } from "./CompanyAvatar";

export function FeedComposer({ onPost }: { onPost: () => void }) {
  return (
    <button
      type="button"
      onClick={onPost}
      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-[var(--shadow-card)] transition-colors hover:bg-muted/40"
    >
      <CompanyAvatar hue={258} size="sm" />
      <span className="flex-1 text-sm text-muted-foreground">Post a vehicle request…</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-accent)]">
        <Plus className="h-4 w-4" />
      </span>
    </button>
  );
}
