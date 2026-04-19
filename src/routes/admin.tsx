import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminBottomNav } from "@/components/admin/AdminBottomNav";
import { adminMetrics } from "@/lib/admin-data";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { pendingMod, pendingPayouts } = adminMetrics();
  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <Outlet />
      <AdminBottomNav pendingMod={pendingMod} pendingPayouts={pendingPayouts} />
    </div>
  );
}
