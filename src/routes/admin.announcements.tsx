import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Megaphone, Plus, Send, Users } from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { listAnnouncements, type Announcement } from "@/lib/admin-data";
import { formatRelativeTime } from "@/lib/format";

export const Route = createFileRoute("/admin/announcements")({
  head: () => ({ meta: [{ title: "Announcements — Admin" }] }),
  component: AnnouncementsScreen,
});

function AnnouncementsScreen() {
  const [open, setOpen] = useState(false);
  const [audience, setAudience] = useState<Announcement["audience"]>("all");
  const items = listAnnouncements();

  return (
    <>
      <AdminTopBar
        title="Announcements"
        subtitle="Notify hosts and corporates"
        backTo="/admin"
        rightSlot={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-9 items-center gap-1 rounded-full bg-accent px-3 text-xs font-semibold text-accent-foreground shadow-[var(--shadow-accent)]"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        }
      />
      <main className="mx-auto w-full max-w-md space-y-3 px-5 pt-4">
        <div className="space-y-3">
          {items.map((a) => (
            <article
              key={a.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <header className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-foreground">{a.title}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {a.audience === "all" ? "Everyone" : a.audience}
                    {a.reach ? ` · reached ${a.reach}` : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    a.status === "sent"
                      ? "bg-success/10 text-success"
                      : a.status === "scheduled"
                        ? "bg-warning/15 text-warning-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {a.status}
                </span>
              </header>
              <p className="mt-2 text-sm text-foreground">{a.body}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {a.status === "sent" ? "Sent " : "Scheduled "}
                {formatRelativeTime(a.scheduledFor)}
              </p>
            </article>
          ))}
        </div>
      </main>

      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-foreground/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md space-y-3 rounded-t-2xl bg-background p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-bold text-foreground">New announcement</h3>
            </div>

            <input
              placeholder="Title"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
            <textarea
              placeholder="Message body…"
              className="h-24 w-full resize-none rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-1 focus:ring-ring"
            />

            <div>
              <p className="mb-1.5 text-xs font-semibold text-foreground">Audience</p>
              <div className="grid grid-cols-3 gap-2">
                {(["all", "hosts", "corporates"] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAudience(a)}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium capitalize ${
                      audience === a
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                className="h-11 rounded-xl border border-border text-sm font-semibold text-foreground"
                onClick={() => setOpen(false)}
              >
                Save draft
              </button>
              <button
                type="button"
                className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-accent text-sm font-semibold text-accent-foreground"
                onClick={() => setOpen(false)}
              >
                <Send className="h-4 w-4" /> Send now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
