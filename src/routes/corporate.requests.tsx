// Corporate — Active Requests list.

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { listCorpRequests, type CorpRequestSummary } from "@/lib/corporate-data";
import { CorporateTopBar } from "@/components/corporate/CorporateTopBar";
import { CorporateBottomNav } from "@/components/corporate/CorporateBottomNav";
import { RequestSummaryCard } from "@/components/corporate/RequestSummaryCard";

export const Route = createFileRoute("/corporate/requests")({
  head: () => ({
    meta: [
      { title: "Active requests — FleetLink" },
      { name: "description", content: "All vehicle requests posted by your organization." },
    ],
  }),
  component: RequestsListPage,
});

const TABS: { id: "all" | CorpRequestSummary["status"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "negotiating", label: "Negotiating" },
  { id: "filled", label: "Filled" },
  { id: "draft", label: "Drafts" },
];

function RequestsListPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const all = listCorpRequests();
  const filtered = tab === "all" ? all : all.filter((r) => r.status === tab);

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <CorporateTopBar title="Active requests" subtitle={`${all.length} total`} />

      <main className="mx-auto w-full max-w-md px-5 pt-4">
        {/* Tab pills */}
        <div className="-mx-5 mb-3 overflow-x-auto px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-muted-foreground"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm font-semibold text-foreground">No requests here yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different tab, or post a new request.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((r) => (
              <RequestSummaryCard key={r.id} request={r} />
            ))}
          </div>
        )}

        <Link
          to="/corporate"
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-accent text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)]"
        >
          <Plus className="h-4 w-4" />
          Post a new request
        </Link>
      </main>

      <CorporateBottomNav />
    </div>
  );
}
