import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HostTopBar } from "@/components/host/HostTopBar";
import { HostOfferCard } from "@/components/host/HostOfferCard";
import { listHostOffers, type HostOfferStatus } from "@/lib/host-data";
import { withRole } from "@/components/auth/withRole";

export const Route = createFileRoute("/host/offers")({
  head: () => ({
    meta: [
      { title: "My offers — FleetLink" },
      { name: "description", content: "Track offers you've sent to corporates." },
    ],
  }),
  component: withRole(["host"], OffersPage),
});

const TABS: { key: "all" | HostOfferStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "countered", label: "Countered" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

function OffersPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const all = listHostOffers();
  const filtered = tab === "all" ? all : all.filter((o) => o.status === tab);

  return (
    <>
      <HostTopBar title="My offers" subtitle="Track every offer you've sent" showAdd={false} />

      <div className="sticky top-[110px] z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md gap-1 overflow-x-auto px-5 py-2">
          {TABS.map((t) => {
            const isActive = tab === t.key;
            const count =
              t.key === "all" ? all.length : all.filter((o) => o.status === t.key).length;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] ${
                    isActive ? "bg-white/20" : "bg-background/60"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center">
            <p className="text-sm font-medium text-foreground">No offers here yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Browse the feed and send offers to corporates.
            </p>
          </div>
        ) : (
          filtered.map((o) => <HostOfferCard key={o.id} offer={o} />)
        )}
      </main>
    </>
  );
}
