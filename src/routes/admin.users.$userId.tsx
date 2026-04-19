import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Ban,
  Building2,
  Car,
  ChevronRight,
  Mail,
  MessageSquare,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  Wallet,
} from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import { getAdminUser, USER_STATUS_LABEL, type UserStatus } from "@/lib/admin-data";
import { formatNaira, formatRelativeTime } from "@/lib/format";

export const Route = createFileRoute("/admin/users/$userId")({
  loader: ({ params }) => {
    const user = getAdminUser(params.userId);
    if (!user) throw notFound();
    return user;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.handle ?? "User"} — Admin` }],
  }),
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <p>User not found</p>
      <Link to="/admin/users" className="text-accent">
        ← Back to users
      </Link>
    </div>
  ),
  component: UserDetail,
});

function UserDetail() {
  const user = Route.useLoaderData();
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [confirm, setConfirm] = useState<null | "suspend" | "ban" | "reinstate">(null);
  const [showMessage, setShowMessage] = useState(false);

  const apply = () => {
    if (confirm === "suspend") setStatus("suspended");
    if (confirm === "ban") setStatus("banned");
    if (confirm === "reinstate") setStatus("active");
    setConfirm(null);
  };

  return (
    <>
      <AdminTopBar title={user.handle} backTo="/admin/users" />

      <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4">
        {/* Identity card */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-3">
            <CompanyAvatar hue={user.hue} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-foreground">{user.handle}</span>
                {user.role === "hosts" ? (
                  <Car className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Joined {formatRelativeTime(user.joinedAt)} · last seen{" "}
                {formatRelativeTime(user.lastActiveAt)}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                <span
                  className={`rounded-full px-1.5 py-0.5 font-semibold ${
                    status === "active"
                      ? "bg-success/10 text-success"
                      : status === "pending"
                        ? "bg-warning/15 text-warning-foreground"
                        : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {USER_STATUS_LABEL[status]}
                </span>
                <span className="rounded-full bg-primary-soft px-1.5 py-0.5 font-semibold text-primary">
                  KYC {user.kycLevel}
                </span>
                <span className="rounded-full bg-accent/15 px-1.5 py-0.5 font-semibold text-accent">
                  Trust {user.trustScore}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <ContactCell icon={Mail} value={user.email} />
            <ContactCell icon={Phone} value={user.phone} />
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-2">
          <Stat
            label={user.role === "hosts" ? "Vehicles" : "Requests"}
            value={(user.role === "hosts" ? user.vehiclesCount ?? 0 : user.requestsCount ?? 0).toString()}
          />
          <Stat label="Deals" value={user.dealsCount.toString()} />
          <Stat label="Volume" value={formatNaira(user.lifetimeVolume)} />
        </section>

        {/* Open issues */}
        {user.openDisputes > 0 && (
          <Link
            to="/admin/disputes"
            className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm"
          >
            <ShieldAlert className="h-4 w-4 text-destructive" />
            <div className="flex-1">
              <p className="font-semibold text-destructive">
                {user.openDisputes} open dispute{user.openDisputes === 1 ? "" : "s"}
              </p>
              <p className="text-[11px] text-muted-foreground">Tap to review</p>
            </div>
            <ChevronRight className="h-4 w-4 text-destructive" />
          </Link>
        )}

        {/* Quick actions */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">Account actions</h2>
          <ActionRow
            icon={UserCheck}
            label="View KYC documents"
            to="/admin/kyc"
            tone="default"
          />
          <ActionRow
            icon={MessageSquare}
            label="Send a direct message"
            tone="default"
            onClick={() => setShowMessage(true)}
          />
          <ActionRow
            icon={Wallet}
            label="View transactions"
            to="/admin/finance/transactions"
            tone="default"
          />
          {status !== "active" && (
            <ActionRow
              icon={ShieldCheck}
              label="Reinstate account"
              tone="success"
              onClick={() => setConfirm("reinstate")}
            />
          )}
          {status !== "suspended" && status !== "banned" && (
            <ActionRow
              icon={Ban}
              label="Suspend account"
              tone="warning"
              onClick={() => setConfirm("suspend")}
            />
          )}
          {status !== "banned" && (
            <ActionRow
              icon={Trash2}
              label="Ban permanently"
              tone="danger"
              onClick={() => setConfirm("ban")}
            />
          )}
        </section>

        {/* Confirmation sheet */}
        {confirm && (
          <div
            className="fixed inset-0 z-40 flex items-end justify-center bg-foreground/40 backdrop-blur-sm"
            onClick={() => setConfirm(null)}
          >
            <div
              className="w-full max-w-md rounded-t-2xl bg-background p-5 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-foreground">
                {confirm === "ban"
                  ? "Ban this account?"
                  : confirm === "suspend"
                    ? "Suspend this account?"
                    : "Reinstate this account?"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {confirm === "ban"
                  ? "Permanent. The user can never sign in again. Active deals will be transferred for resolution."
                  : confirm === "suspend"
                    ? "User cannot post or accept offers. Existing deals continue. Reversible."
                    : "User regains full platform access."}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="h-11 flex-1 rounded-xl border border-border text-sm font-semibold text-foreground"
                  onClick={() => setConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`h-11 flex-1 rounded-xl text-sm font-semibold ${
                    confirm === "reinstate"
                      ? "bg-success text-success-foreground"
                      : "bg-destructive text-destructive-foreground"
                  }`}
                  onClick={apply}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message sheet */}
        {showMessage && (
          <div
            className="fixed inset-0 z-40 flex items-end justify-center bg-foreground/40 backdrop-blur-sm"
            onClick={() => setShowMessage(false)}
          >
            <div
              className="w-full max-w-md rounded-t-2xl bg-background p-5 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-foreground">Message {user.handle}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Sent via in-app inbox + email notification.
              </p>
              <textarea
                className="mt-3 h-28 w-full resize-none rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-1 focus:ring-ring"
                placeholder="Subject + message…"
              />
              <button
                type="button"
                className="mt-3 h-11 w-full rounded-xl bg-accent text-sm font-semibold text-accent-foreground"
                onClick={() => setShowMessage(false)}
              >
                Send message
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function ContactCell({ icon: Icon, value }: { icon: typeof Mail; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-2 text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-2.5 text-center shadow-[var(--shadow-card)]">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}

const TONE: Record<string, string> = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning-foreground",
  danger: "text-destructive",
};

function ActionRow({
  icon: Icon,
  label,
  tone = "default",
  to,
  onClick,
}: {
  icon: typeof Mail;
  label: string;
  tone?: "default" | "success" | "warning" | "danger";
  to?: "/admin/kyc" | "/admin/finance/transactions";
  onClick?: () => void;
}) {
  const inner = (
    <>
      <Icon className={`h-4 w-4 ${TONE[tone]}`} />
      <span className={`flex-1 text-sm font-medium ${TONE[tone]}`}>{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </>
  );
  if (to) {
    return (
      <Link
        to={to}
        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
      >
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left shadow-[var(--shadow-card)]"
    >
      {inner}
    </button>
  );
}
