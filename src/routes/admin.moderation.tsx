import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Car,
  Check,
  FileText,
  MessageSquareWarning,
  Star,
  Truck,
  X,
} from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { listModeration, type ModerationKind } from "@/lib/admin-data";
import { formatRelativeTime } from "@/lib/format";

export const Route = createFileRoute("/admin/moderation")({
  head: () => ({ meta: [{ title: "Moderation — Admin" }] }),
  component: ModerationScreen,
});

const KIND_ICON: Record<ModerationKind, typeof FileText> = {
  request: FileText,
  offer: FileText,
  review: Star,
  vehicle: Car,
  message: MessageSquareWarning,
};

const KIND_LABEL: Record<ModerationKind, string> = {
  request: "Request",
  offer: "Offer",
  review: "Review",
  vehicle: "Vehicle listing",
  message: "Message",
};

const TABS: { id: ModerationKind | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "request", label: "Requests" },
  { id: "review", label: "Reviews" },
  { id: "vehicle", label: "Vehicles" },
  { id: "message", label: "Messages" },
];

function ModerationScreen() {
  const [tab, setTab] = useState<ModerationKind | "all">("all");
  const [decisions, setDecisions] = useState<Record<string, "approved" | "rejected">>({});

  const items = listModeration();
  const filtered = tab === "all" ? items : items.filter((i) => i.kind === tab);

  return (
    <>
      <AdminTopBar
        title="Moderation"
        subtitle={`${items.filter((i) => i.status === "pending").length} reports pending`}
      />
      <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
        <Link
          to="/admin/disputes"
          className="flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm"
        >
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-destructive" />
            <span className="font-semibold text-destructive">Open disputes</span>
          </div>
          <span className="text-xs text-destructive">View →</span>
        </Link>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                tab === t.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((m) => {
            const Icon = KIND_ICON[m.kind];
            const decision = decisions[m.id];
            return (
              <article
                key={m.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <header className="flex items-start gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {KIND_LABEL[m.kind]} · {m.reason}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Reported by {m.reportedBy} · target {m.reportedHandle} ·{" "}
                      {formatRelativeTime(m.reportedAt)}
                    </p>
                  </div>
                </header>

                <p className="mt-3 rounded-lg bg-muted/50 p-2.5 text-[12px] italic text-muted-foreground">
                  &ldquo;{m.excerpt}&rdquo;
                </p>

                {decision ? (
                  <p
                    className={`mt-3 rounded-lg px-3 py-2 text-center text-xs font-semibold ${
                      decision === "approved"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {decision === "approved" ? "Kept · marked safe" : "Removed · user notified"}
                  </p>
                ) : (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDecisions((d) => ({ ...d, [m.id]: "rejected" }))
                      }
                      className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-destructive/40 text-xs font-semibold text-destructive"
                    >
                      <X className="h-3.5 w-3.5" /> Remove
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDecisions((d) => ({ ...d, [m.id]: "approved" }))
                      }
                      className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-success text-xs font-semibold text-success-foreground"
                    >
                      <Check className="h-3.5 w-3.5" /> Keep
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}
