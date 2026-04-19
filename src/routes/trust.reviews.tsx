import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrustTopBar } from "@/components/trust/TrustTopBar";
import { ReviewableDealCard } from "@/components/trust/ReviewableDealCard";
import { listReviewableDeals } from "@/lib/trust-data";

export const Route = createFileRoute("/trust/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — FleetLink" },
      {
        name: "description",
        content: "Rate your completed rentals and build trust on FleetLink.",
      },
    ],
  }),
  component: ReviewsPage,
});

const TABS = [
  { id: "pending", label: "Pending" },
  { id: "submitted", label: "Submitted" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function ReviewsPage() {
  const all = listReviewableDeals();
  const [tab, setTab] = useState<TabId>("pending");

  const list = all.filter((d) => (tab === "pending" ? !d.reviewed : d.reviewed));

  return (
    <>
      <TrustTopBar
        title="Reviews"
        subtitle="Honest feedback unlocks better matches for everyone."
      />

      <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4 pb-24">
        <div className="flex rounded-full bg-muted p-1">
          {TABS.map((t) => {
            const active = t.id === tab;
            const count = all.filter((d) => (t.id === "pending" ? !d.reviewed : d.reviewed))
              .length;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                  active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active ? "bg-accent-soft text-accent" : "bg-background/60"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center">
            <p className="text-sm font-semibold text-foreground">
              {tab === "pending" ? "All caught up" : "No reviews yet"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {tab === "pending"
                ? "Completed rentals will show here."
                : "Submitted reviews will appear in this tab."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {list.map((d) => (
              <ReviewableDealCard key={d.id} deal={d} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
