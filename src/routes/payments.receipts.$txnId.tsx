import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Download, Share2, ArrowLeft } from "lucide-react";
import { PaymentsTopBar } from "@/components/payments/PaymentsTopBar";
import { ReceiptCard } from "@/components/payments/ReceiptCard";
import { Button } from "@/components/ui/button";
import { getTransaction } from "@/lib/payments-data";

export const Route = createFileRoute("/payments/receipts/$txnId")({
  head: ({ params }) => ({
    meta: [
      { title: `Receipt ${params.txnId} — FleetLink` },
      { name: "description", content: "Transaction receipt detail." },
    ],
  }),
  loader: ({ params }) => {
    const txn = getTransaction(params.txnId);
    if (!txn) throw notFound();
    return { txn };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="text-sm font-semibold text-foreground">Receipt not found</p>
      <Link
        to="/payments/receipts"
        className="text-xs font-semibold text-primary hover:underline"
      >
        ← Back to receipts
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="text-sm font-semibold text-destructive">{error.message}</p>
      <Link to="/payments/receipts" className="text-xs font-semibold text-primary">
        Back
      </Link>
    </div>
  ),
  component: ReceiptDetail,
});

function ReceiptDetail() {
  const { txn } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <PaymentsTopBar title="Receipt" backTo="/payments/receipts" />

      <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
        <ReceiptCard txn={txn} />

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        <Link
          to="/payments/receipts"
          className="mt-2 flex items-center justify-center gap-1 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All receipts
        </Link>
      </main>
    </div>
  );
}
