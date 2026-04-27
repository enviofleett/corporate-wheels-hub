import { createFileRoute } from "@tanstack/react-router";
import { Plus, Star } from "lucide-react";
import { PaymentsTopBar } from "@/components/payments/PaymentsTopBar";
import { PaymentMethodRow } from "@/components/payments/PaymentMethodRow";
import { listPaymentMethods, listBankAccounts } from "@/lib/payments-data";
import { Button } from "@/components/ui/button";
import { withRole } from "@/components/auth/withRole";

export const Route = createFileRoute("/payments/methods")({
  head: () => ({
    meta: [
      { title: "Payment methods — FleetLink" },
      { name: "description", content: "Manage cards, bank transfer, USSD and payout accounts." },
    ],
  }),
  component: withRole(["corporate", "host", "admin"], MethodsPage),
});

function MethodsPage() {
  const corp = listPaymentMethods("corporate");
  const banks = listBankAccounts();

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <PaymentsTopBar
        title="Payment methods"
        subtitle="Used to fund escrow & receive payouts"
        backTo="/payments"
      />

      <main className="mx-auto w-full max-w-md space-y-5 px-5 pt-4">
        {/* Pay-in methods */}
        <section className="space-y-2">
          <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Pay-in (corporate)
          </h2>
          <div className="space-y-2">
            {corp.map((m) => (
              <PaymentMethodRow
                key={m.id}
                method={m}
                trailing={
                  m.isDefault ? (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                      <Star className="h-2.5 w-2.5" /> Default
                    </span>
                  ) : (
                    <button className="text-[11px] font-semibold text-primary hover:underline">
                      Set default
                    </button>
                  )
                }
              />
            ))}
          </div>
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4" />
            Add card
          </Button>
        </section>

        {/* Pay-out accounts */}
        <section className="space-y-2">
          <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Payout accounts (host)
          </h2>
          <div className="space-y-2">
            {banks.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary text-xs font-bold">
                  {b.bankName.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {b.bankName} {b.accountNumber}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {b.accountName}
                  </p>
                </div>
                {b.isDefault && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                    <Star className="h-2.5 w-2.5" /> Default
                  </span>
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4" />
            Add bank account
          </Button>
        </section>
      </main>
    </div>
  );
}
