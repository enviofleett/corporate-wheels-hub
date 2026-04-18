import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { HostTopBar } from "@/components/host/HostTopBar";
import { EngagedCard } from "@/components/host/EngagedCard";
import { listEngagedRequests } from "@/lib/host-data";

export const Route = createFileRoute("/host/engaged")({
  head: () => ({
    meta: [
      { title: "Requests engaged — FleetLink" },
      { name: "description", content: "Requests you've saved or are negotiating on." },
    ],
  }),
  component: EngagedPage,
});

function EngagedPage() {
  const items = listEngagedRequests();
  return (
    <>
      <HostTopBar
        title="Engaged requests"
        subtitle="Requests you're tracking or negotiating"
        showAdd={false}
      />

      <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center">
            <Compass className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-foreground">Nothing here yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Save requests from the feed to track them here.
            </p>
            <Link
              to="/feed"
              className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground"
            >
              Browse feed
            </Link>
          </div>
        ) : (
          items.map((r) => <EngagedCard key={r.id} request={r} />)
        )}
      </main>
    </>
  );
}
