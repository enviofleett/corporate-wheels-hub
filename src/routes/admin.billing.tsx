import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Banknote, Building2, CreditCard, AlertTriangle } from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { platformStats } from "@/lib/platform-data";
export const Route = createFileRoute("/admin/billing")({ component: Billing });
function Billing() {
  return (
    <>
      <AdminTopBar title="Billing" subtitle="Organization subscriptions and platform billing" />
      <main className="mx-auto max-w-3xl space-y-4 px-5 pt-4">
        <section className="grid grid-cols-2 gap-3">
          <Metric icon={<Building2 />} n={platformStats.organizations} l="Organizations" />
          <Metric icon={<CreditCard />} n={21} l="Active subscriptions" />
          <Metric icon={<AlertTriangle />} n={2} l="Past due" />
          <Metric icon={<Banknote />} n={1} l="Trials" />
        </section>
        <section className="rounded-2xl border bg-card p-4">
          <h2 className="text-sm font-black">Billing model</h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Subscription plans, invoices, payment provider reconciliation and tenant suspension will
            connect here during backend integration. Driver contribution commissions remain
            organization-level policy, not platform billing.
          </p>
        </section>
      </main>
    </>
  );
}
function Metric({ icon, n, l }: { icon: ReactNode; n: number; l: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <span className="text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <p className="mt-3 text-2xl font-black">{n}</p>
      <p className="text-[10px] text-muted-foreground">{l}</p>
    </div>
  );
}
