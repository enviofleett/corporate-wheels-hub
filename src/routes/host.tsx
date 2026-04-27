import { createFileRoute, Outlet } from "@tanstack/react-router";
import { HostBottomNav } from "@/components/host/HostBottomNav";
import { hostMetrics } from "@/lib/host-data";
import { withRole } from "@/components/auth/withRole";

export const Route = createFileRoute("/host")({
  component: withRole(["host"], HostLayout),
});

function HostLayout() {
  const { pendingOffers } = hostMetrics();
  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <Outlet />
      <HostBottomNav pendingOffers={pendingOffers} />
    </div>
  );
}
