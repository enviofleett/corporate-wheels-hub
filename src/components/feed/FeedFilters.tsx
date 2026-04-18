import { useState } from "react";

const FILTERS = ["All", "Nearby", "Cargo", "Executive", "Long-term", "Self-drive"] as const;

export function FeedFilters() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <div className="flex w-max gap-2 pb-1">
        {FILTERS.map((f) => {
          const isActive = active === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={`h-8 shrink-0 rounded-full px-3.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>
    </div>
  );
}
