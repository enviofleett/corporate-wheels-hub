import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { HostTopBar } from "@/components/host/HostTopBar";
import { VehicleCard } from "@/components/host/VehicleCard";
import { listVehicles, type VehicleStatus } from "@/lib/host-data";
import { withRole } from "@/components/auth/withRole";

export const Route = createFileRoute("/host/vehicles")({
  head: () => ({
    meta: [
      { title: "My vehicles — FleetLink" },
      { name: "description", content: "Manage your fleet of rental vehicles." },
    ],
  }),
  component: withRole(["host"], VehiclesPage),
});

const TABS: { key: "all" | VehicleStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "available", label: "Available" },
  { key: "rented", label: "Rented" },
  { key: "maintenance", label: "Maintenance" },
  { key: "draft", label: "Drafts" },
];

function VehiclesPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const all = listVehicles();
  const filtered = tab === "all" ? all : all.filter((v) => v.status === tab);

  return (
    <>
      <HostTopBar title="My vehicles" subtitle={`${all.length} in your fleet`} />

      <div className="sticky top-[110px] z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md gap-1 overflow-x-auto px-5 py-2">
          {TABS.map((t) => {
            const isActive = tab === t.key;
            const count =
              t.key === "all" ? all.length : all.filter((v) => v.status === t.key).length;
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
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-accent/50 bg-accent-soft/40 p-3 text-sm font-semibold text-accent transition active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" />
          List a new vehicle
        </button>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center">
            <p className="text-sm font-medium text-foreground">No vehicles in this category</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try another tab or list a new vehicle.
            </p>
          </div>
        ) : (
          filtered.map((v) => <VehicleCard key={v.id} vehicle={v} />)
        )}
      </main>
    </>
  );
}
