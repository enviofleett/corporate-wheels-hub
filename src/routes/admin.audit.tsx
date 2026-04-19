import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Filter, ScrollText } from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { listAuditLog } from "@/lib/admin-data";
import { formatRelativeTime } from "@/lib/format";

export const Route = createFileRoute("/admin/audit")({
  head: () => ({ meta: [{ title: "Audit log — Admin" }] }),
  component: AuditScreen,
});

const SEV = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "warn", label: "Warnings" },
  { id: "info", label: "Info" },
] as const;

function AuditScreen() {
  const [sev, setSev] = useState<(typeof SEV)[number]["id"]>("all");
  const items = listAuditLog().filter((a) => (sev === "all" ? true : a.severity === sev));

  return (
    <>
      <AdminTopBar title="Audit log" subtitle="All admin actions" backTo="/admin" />
      <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="flex flex-1 gap-1.5 overflow-x-auto">
            {SEV.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSev(s.id)}
                className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                  sev === s.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="space-y-2">
          {items.map((a) => (
            <li
              key={a.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 text-sm shadow-[var(--shadow-card)]"
            >
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  a.severity === "critical"
                    ? "bg-destructive"
                    : a.severity === "warn"
                      ? "bg-warning"
                      : "bg-success"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{a.action}</p>
                <p className="truncate text-[11px] text-muted-foreground">{a.target}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {a.actor} · {a.ip}
                </p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {formatRelativeTime(a.at)}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-card p-3 text-xs text-muted-foreground">
          <ScrollText className="h-4 w-4" />
          Audit entries retained for 7 years per platform policy.
        </div>
      </main>
    </>
  );
}
