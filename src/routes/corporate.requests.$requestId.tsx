// Corporate — Request detail with offer comparison UI.

import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Check, X, ArrowUpDown } from "lucide-react";
import {
  getCorpRequest,
  listOffersForRequest,
  REQUEST_LABEL,
  type IncomingOffer,
} from "@/lib/corporate-data";
import { CorporateBottomNav } from "@/components/corporate/CorporateBottomNav";
import { OfferComparison } from "@/components/corporate/OfferComparison";
import { IncomingOfferCard } from "@/components/corporate/IncomingOfferCard";
import { formatNaira, formatDuration, formatRelativeTime } from "@/lib/format";

export const Route = createFileRoute("/corporate/requests/$requestId")({
  loader: ({ params }) => {
    const request = getCorpRequest(params.requestId);
    if (!request) throw notFound();
    return { request };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.request.title} — FleetLink`
          : "Request — FleetLink",
      },
    ],
  }),
  component: RequestDetailPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-5 py-16 text-center">
      <h1 className="text-base font-semibold">Request not found</h1>
      <Link to="/corporate/requests" className="mt-4 inline-block text-sm text-primary">
        Back to requests
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-md px-5 py-16 text-center">
      <p className="text-sm text-destructive">Error: {error.message}</p>
      <Link to="/corporate/requests" className="mt-4 inline-block text-sm text-primary">
        Back to requests
      </Link>
    </div>
  ),
});

type SortKey = "best" | "price" | "rating" | "recent";

function RequestDetailPage() {
  const { request } = Route.useLoaderData();
  const offers = listOffersForRequest(request.id);
  const [sort, setSort] = useState<SortKey>("best");
  const [confirm, setConfirm] = useState<IncomingOffer | null>(null);
  const [accepted, setAccepted] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const copy = [...offers];
    switch (sort) {
      case "price":
        return copy.sort((a, b) => a.price - b.price);
      case "rating":
        return copy.sort((a, b) => b.hostRating - a.hostRating);
      case "recent":
        return copy.sort(
          (a, b) =>
            new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
        );
      case "best":
      default:
        // Composite: shortlisted first, then rating-weighted lower price.
        return copy.sort((a, b) => {
          const aScore =
            (a.status === "shortlisted" ? 1000 : 0) + a.hostRating * 10 - a.price / 100_000;
          const bScore =
            (b.status === "shortlisted" ? 1000 : 0) + b.hostRating * 10 - b.price / 100_000;
          return bScore - aScore;
        });
    }
  }, [offers, sort]);

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* App bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-md items-center gap-2 px-5">
          <Link
            to="/corporate/requests"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="truncate text-sm font-bold text-foreground">{request.title}</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4">
        {/* Request hero */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div
            className="h-2"
            style={{
              background: `linear-gradient(90deg, oklch(0.55 0.15 ${request.imageHue}), oklch(0.72 0.19 49))`,
            }}
            aria-hidden
          />
          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {REQUEST_LABEL[request.status]}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Posted {formatRelativeTime(request.postedAt)} ago
              </p>
            </div>
            <h2 className="mt-1 text-base font-bold text-foreground">
              {request.quantity}× {request.vehicleType}
            </h2>
            <p className="text-xs text-muted-foreground">{request.location}</p>

            <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-muted/50 p-2.5 text-center">
              <Mini label="Budget" value={formatNaira(request.budget)} suffix={`/ ${request.period}`} />
              <Mini label="Duration" value={formatDuration(request.durationWeeks)} />
              <Mini label="Offers" value={String(request.offersCount)} />
            </div>
          </div>
        </section>

        {/* Comparison strip */}
        {sorted.length > 0 && (
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Compare offers</h3>
              <p className="text-[11px] text-muted-foreground">Swipe to see more</p>
            </div>
            <OfferComparison
              offers={sorted}
              onAccept={(o) => setConfirm(o)}
              onReject={() => { /* Phase 4 mock */ }}
            />
          </section>
        )}

        {/* Sort + list */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">All offers ({sorted.length})</h3>
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
              <ArrowUpDown className="h-3 w-3" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="bg-transparent text-foreground focus:outline-none"
              >
                <option value="best">Best match</option>
                <option value="price">Lowest price</option>
                <option value="rating">Top rated</option>
                <option value="recent">Most recent</option>
              </select>
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
              <p className="text-sm font-semibold text-foreground">No offers yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                We'll notify you the moment a host responds.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sorted.map((o) => (
                <IncomingOfferCard
                  key={o.id}
                  offer={o}
                  onAccept={(off) => setConfirm(off)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Accept confirm modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm md:items-center">
          <div className="w-full max-w-md animate-in slide-in-from-bottom rounded-t-3xl bg-background shadow-[var(--shadow-elevated)] md:rounded-3xl">
            {accepted === confirm.id ? (
              <div className="px-5 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold">Offer accepted</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  We'll guide you to fund escrow next. (Phase 7)
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setConfirm(null);
                    setAccepted(null);
                  }}
                  className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4 px-5 py-5">
                <h3 className="text-base font-semibold">Accept this offer?</h3>
                <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
                  <p className="font-semibold text-foreground">
                    {confirm.vehicle.label} {confirm.vehicle.year}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {confirm.hostHandle} · {formatNaira(confirm.price)} / {confirm.period}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  By accepting you commit to fund escrow within 24 hours. The host's identity
                  will be revealed once funded.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirm(null)}
                    className="flex h-11 items-center justify-center gap-1 rounded-xl border border-border bg-background text-sm font-semibold text-foreground"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccepted(confirm.id)}
                    className="flex h-11 items-center justify-center gap-1 rounded-xl bg-accent text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)]"
                  >
                    <Check className="h-4 w-4" />
                    Accept
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <CorporateBottomNav />
    </div>
  );
}

function Mini({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div>
      <p className="truncate text-xs font-bold text-foreground">
        {value}
        {suffix && (
          <span className="text-[10px] font-normal text-muted-foreground"> {suffix}</span>
        )}
      </p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
