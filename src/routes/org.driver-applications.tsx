import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  CarFront,
  CheckCircle2,
  Clock3,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { orgAdminStore, useOrgAdmin, type DriverApplicationStatus } from "@/lib/org-admin-store";
export const Route = createFileRoute("/org/driver-applications")({ component: DriverApplications });
function DriverApplications() {
  const state = useOrgAdmin();
  const [filter, setFilter] = useState<DriverApplicationStatus | "all">("pending");
  const [q, setQ] = useState("");
  const rows = state.driverApplications.filter(
    (a) =>
      (filter === "all" || a.status === filter) &&
      (!q ||
        [a.name, a.email, a.phone, a.vehicle, a.plate]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())),
  );
  const decide = (id: string, status: DriverApplicationStatus) =>
    orgAdminStore.decideDriver(id, status);
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background px-5 py-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-primary">
            Driver onboarding
          </p>
          <h1 className="mt-1 text-2xl font-black">Driver & vehicle applications</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Review people who want to list vehicles and offer rides for your organization.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-4 px-5 py-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="flex h-11 items-center gap-2 rounded-xl border bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search driver, vehicle or plate"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="grid grid-cols-4 rounded-xl bg-muted p-1 text-[10px] font-bold">
            {(["pending", "approved", "declined", "all"] as const).map((x) => (
              <button
                key={x}
                onClick={() => setFilter(x)}
                className={
                  filter === x
                    ? "rounded-lg bg-background px-3 py-2 shadow-sm"
                    : "px-3 py-2 text-muted-foreground"
                }
              >
                {x}
              </button>
            ))}
          </div>
        </div>
        <section className="grid gap-3 md:grid-cols-2">
          {rows.map((a) => (
            <article key={a.id} className="rounded-2xl border bg-card p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <CarFront className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-black">{a.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.email} · {a.phone}
                      </p>
                    </div>
                    <Status status={a.status} />
                  </div>
                  <div className="mt-4 rounded-xl bg-muted/50 p-3 text-xs">
                    <p className="font-bold">{a.vehicle}</p>
                    <p className="mt-1 text-muted-foreground">
                      Plate: {a.plate} · {a.seats} passenger seats
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock3 className="h-3 w-3" />
                      Submitted {a.submittedAt}
                    </p>
                  </div>
                  {a.notes && (
                    <p className="mt-3 text-[11px] text-muted-foreground">Review note: {a.notes}</p>
                  )}
                  {a.status === "pending" && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => decide(a.id, "declined")}
                        className="flex h-10 items-center justify-center gap-2 rounded-xl border text-xs font-bold text-destructive"
                      >
                        <XCircle className="h-4 w-4" />
                        Decline
                      </button>
                      <button
                        onClick={() => decide(a.id, "approved")}
                        className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
        {rows.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-card p-8 text-center">
            <ShieldAlert className="mx-auto h-7 w-7 text-muted-foreground" />
            <p className="mt-3 text-sm font-black">No applications in this view</p>
          </div>
        )}
      </main>
    </div>
  );
}
function Status({ status }: { status: DriverApplicationStatus }) {
  const cls =
    status === "approved"
      ? "bg-success/10 text-success"
      : status === "declined"
        ? "bg-destructive/10 text-destructive"
        : "bg-warning/10 text-warning";
  return (
    <span
      className={
        "flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold capitalize " + cls
      }
    >
      {status === "approved" ? (
        <BadgeCheck className="h-3 w-3" />
      ) : (
        <ShieldAlert className="h-3 w-3" />
      )}
      {status}
    </span>
  );
}
