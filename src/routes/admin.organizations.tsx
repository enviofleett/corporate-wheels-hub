import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Building2, Globe2, UsersRound, CalendarDays } from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { tenants } from "@/lib/platform-data";
export const Route = createFileRoute("/admin/organizations")({ component: Organizations });
function Organizations() {
  return (
    <>
      <AdminTopBar title="Organizations" subtitle="Tenant accounts and portal status" />
      <main className="mx-auto max-w-3xl space-y-3 px-5 pt-4">
        {tenants.map((t) => (
          <article key={t.name} className="rounded-2xl border bg-card p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Building2 className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-black">{t.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.type}</p>
                  </div>
                  <span className="rounded-full bg-success/10 px-2 py-1 text-[10px] font-bold text-success">
                    {t.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Mini icon={<CalendarDays />} n={t.events} l="Events" />
                  <Mini icon={<UsersRound />} n={t.members} l="Members" />
                  <Mini icon={<Globe2 />} n={1} l="Domain" />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{t.domain}</p>
              </div>
            </div>
          </article>
        ))}
      </main>
    </>
  );
}
function Mini({ icon, n, l }: { icon: ReactNode; n: number; l: string }) {
  return (
    <div className="rounded-xl bg-muted/55 p-2">
      <span className="text-primary [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
      <p className="mt-1 text-sm font-black">{n.toLocaleString()}</p>
      <p className="text-[9px] text-muted-foreground">{l}</p>
    </div>
  );
}
