import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AdminUserRow } from "@/components/admin/AdminUserRow";
import { listAdminUsers, type AdminRole, type UserStatus } from "@/lib/admin-data";

type Search = { role?: AdminRole; status?: UserStatus | "all" };

export const Route = createFileRoute("/admin/users/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    role: (s.role as AdminRole) ?? undefined,
    status: (s.status as UserStatus | "all" | undefined) ?? "all",
  }),
  head: () => ({ meta: [{ title: "Users — Admin" }] }),
  component: UsersList,
});

const ROLE_TABS: { id: AdminRole | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "hosts", label: "Hosts" },
  { id: "corporates", label: "Corporates" },
];

const STATUS_TABS: { id: UserStatus | "all"; label: string }[] = [
  { id: "all", label: "Any status" },
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending" },
  { id: "suspended", label: "Suspended" },
];

function UsersList() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/users" });
  const [query, setQuery] = useState("");

  const role = search.role ?? "all";
  const status = search.status ?? "all";

  const all = useMemo(() => listAdminUsers(), []);
  const filtered = useMemo(() => {
    return all
      .filter((u) => (role === "all" ? true : u.role === role))
      .filter((u) => (status === "all" ? true : u.status === status))
      .filter((u) =>
        query.trim() ? u.handle.toLowerCase().includes(query.toLowerCase()) : true,
      );
  }, [all, role, status, query]);

  return (
    <>
      <AdminTopBar
        title="Users"
        subtitle={`${filtered.length} of ${all.length} accounts`}
      />

      <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 shadow-[var(--shadow-card)]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by handle…"
            className="h-10 flex-1 bg-transparent text-sm outline-none"
          />
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Role tabs */}
        <div className="flex gap-1 rounded-full bg-muted p-1">
          {ROLE_TABS.map((t) => {
            const active = (t.id === "all" && !search.role) || t.id === role;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  navigate({
                    search: {
                      role: t.id === "all" ? undefined : (t.id as AdminRole),
                      status: search.status,
                    },
                  })
                }
                className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Status pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {STATUS_TABS.map((t) => {
            const active = t.id === status;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  navigate({
                    search: { role: search.role, status: t.id === "all" ? undefined : t.id },
                  })
                }
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No users match your filters.
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((u) => (
              <AdminUserRow key={u.id} user={u} />
            ))}
          </div>
        )}

        <Link
          to="/admin"
          className="block py-3 text-center text-xs font-medium text-muted-foreground"
        >
          ← Back to overview
        </Link>
      </main>
    </>
  );
}
