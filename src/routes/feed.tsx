import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Search, Sparkles } from "lucide-react";
import { fetchFeedPage, type CorporateRequest } from "@/lib/mock-data";
import { RequestCard } from "@/components/feed/RequestCard";
import { RequestCardSkeleton } from "@/components/feed/RequestCardSkeleton";
import { FeedFilters } from "@/components/feed/FeedFilters";
import { FeedComposer } from "@/components/feed/FeedComposer";
import { OfferSheet } from "@/components/feed/OfferSheet";
import { ProfileSheet } from "@/components/feed/ProfileSheet";
import { BottomNav } from "@/components/feed/BottomNav";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed — FleetLink" },
      {
        name: "description",
        content:
          "Live corporate vehicle rental requests. Browse, offer, and counter — anonymous until agreement.",
      },
    ],
  }),
  component: FeedPage,
});

type SheetState =
  | { kind: "none" }
  | { kind: "offer" | "counter" | "profile"; request: CorporateRequest };

function FeedPage() {
  const [items, setItems] = useState<CorporateRequest[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sheet, setSheet] = useState<SheetState>({ kind: "none" });
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadNext = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const { items: next, hasMore: more } = await fetchFeedPage(page);
    setItems((prev) => [...prev, ...next]);
    setHasMore(more);
    setPage((p) => p + 1);
    setLoading(false);
  }, [loading, hasMore, page]);

  // Initial load
  useEffect(() => {
    void loadNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadNext();
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadNext]);

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Top app bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between gap-2 px-5">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
            </span>
            <span className="text-base font-bold text-foreground">FleetLink</span>
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md px-5 pb-3">
          <FeedFilters />
        </div>
      </header>

      <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
        <FeedComposer onPost={() => { /* Phase 3 */ }} />

        {items.map((req) => (
          <RequestCard
            key={req.id}
            request={req}
            onOffer={(r) => setSheet({ kind: "offer", request: r })}
            onCounter={(r) => setSheet({ kind: "counter", request: r })}
            onViewProfile={(r) => setSheet({ kind: "profile", request: r })}
          />
        ))}

        {loading && (
          <>
            <RequestCardSkeleton />
            <RequestCardSkeleton />
          </>
        )}

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} aria-hidden className="h-1" />

        {!hasMore && !loading && (
          <div className="py-10 text-center">
            <p className="text-sm font-medium text-foreground">You're all caught up</p>
            <p className="mt-1 text-xs text-muted-foreground">
              New requests appear here in real time.
            </p>
          </div>
        )}
      </main>

      {/* Sheets */}
      <OfferSheet
        open={sheet.kind === "offer" || sheet.kind === "counter"}
        mode={sheet.kind === "counter" ? "counter" : "offer"}
        request={sheet.kind === "offer" || sheet.kind === "counter" ? sheet.request : null}
        onClose={() => setSheet({ kind: "none" })}
      />
      <ProfileSheet
        open={sheet.kind === "profile"}
        request={sheet.kind === "profile" ? sheet.request : null}
        onClose={() => setSheet({ kind: "none" })}
      />

      <BottomNav />
    </div>
  );
}
