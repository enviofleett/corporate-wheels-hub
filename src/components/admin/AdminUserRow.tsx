import { Link } from "@tanstack/react-router";
import { ChevronRight, Flag } from "lucide-react";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import { formatNaira } from "@/lib/format";
import type { AdminUser } from "@/lib/admin-data";
import { USER_STATUS_LABEL } from "@/lib/admin-data";

const STATUS_CLASS: Record<AdminUser["status"], string> = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/15 text-warning-foreground",
  suspended: "bg-destructive/10 text-destructive",
  banned: "bg-destructive/15 text-destructive",
};

export function AdminUserRow({ user }: { user: AdminUser }) {
  return (
    <Link
      to="/admin/users/$userId"
      params={{ userId: user.id }}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] active:scale-[0.99]"
    >
      <CompanyAvatar hue={user.hue} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-foreground">{user.handle}</span>
          {user.flagged && <Flag className="h-3 w-3 text-destructive" />}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className={`rounded-full px-1.5 py-0.5 font-medium ${STATUS_CLASS[user.status]}`}>
            {USER_STATUS_LABEL[user.status]}
          </span>
          <span>·</span>
          <span>Trust {user.trustScore}</span>
          <span>·</span>
          <span>{formatNaira(user.lifetimeVolume)}</span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
