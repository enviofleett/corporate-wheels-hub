import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TrustTopBar } from "@/components/trust/TrustTopBar";
import { DisputeCard } from "@/components/trust/DisputeCard";
import { listDisputes, type DisputeStatus } from "@/lib/trust-data";

export const Route = createFileRoute("/trust/disputes")({
  head: () => ({
    meta: [
      { title: "Disputes — FleetLink" },
      { name: "description", content: "Track and resolve rental disputes." },
    ],
  }),
  component: DisputesPage,
});

const FILTERS: { id: "all" | DisputeStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "under_review", label: "In review" },
  { id: "resolved", label: "Resolved" },
];

function DisputesPage() {
  const all = listDisputes();
  const [filter, setFilter] = useState<"all" | DisputeStatus>("all");

  const list = filter === "all" ? all : all.filter((d) => d.status === filter);

  return (
    <>
      <TrustTopBar
        title="Disputes"
        subtitle="Issues raised on completed or active deals."
      />

      <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4 pb-24">
        <Link
          to="/trust/disputes/new"
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)]"
        >
          <Plus className="h-4 w-4" />
          Report a new dispute
        </Link>

        {/* Filter chips */}
        <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2">
            {FILTERS.map((f) => {
              const active = f.id === filter;
              const count =
                f.id === "all" ? all.length : all.filter((d) => d.status === f.id).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {f.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      active ? "bg-white/20" : "bg-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center">
            <p className="text-sm font-semibold text-foreground">No disputes here</p>
            <p className="mt-1 text-xs text-muted-foreground">
              You're all clear in this category.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {list.map((d) => (
              <DisputeCard key={d.id} dispute={d} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
