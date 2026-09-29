import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Plus, X } from "lucide-react";
import { useTenant } from "@/components/tenant/TenantProvider";
export const Route = createFileRoute("/org/campuses")({ component: Campuses });
function Campuses() {
  const tenant = useTenant();
  const [campuses, setCampuses] = useState(tenant.campuses);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""),
    [city, setCity] = useState("");
  const add = () => {
    if (!name || !city) return;
    setCampuses((x) => [{ id: `campus-${Date.now()}`, name, city }, ...x]);
    setName("");
    setCity("");
    setOpen(false);
  };
  return (
    <>
      <header className="border-b bg-background px-5 py-6">
        <div className="mx-auto max-w-md">
          <p className="text-[11px] font-bold uppercase text-muted-foreground">Organization</p>
          <div className="flex items-end justify-between">
            <h1 className="text-2xl font-black">Campuses</h1>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 text-xs font-bold text-primary"
            >
              {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {open ? "Close" : "Add campus"}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-md space-y-3 px-5 pt-4">
        <p className="text-xs text-muted-foreground">
          Campuses are optional. Events and pickup hubs can be assigned to a campus without creating
          separate organizations.
        </p>
        {open && (
          <section className="rounded-2xl border bg-card p-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Campus name"
              className="h-11 w-full rounded-xl border px-3 text-sm"
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
            />
            <button
              disabled={!name || !city}
              onClick={add}
              className="mt-3 h-10 w-full rounded-xl bg-primary text-xs font-bold text-primary-foreground disabled:opacity-50"
            >
              Add campus
            </button>
          </section>
        )}
        {campuses.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-2xl border bg-card p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Building2 className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold">{c.name}</span>
              <span className="block text-xs text-muted-foreground">{c.city}</span>
            </span>
          </div>
        ))}
      </main>
    </>
  );
}
