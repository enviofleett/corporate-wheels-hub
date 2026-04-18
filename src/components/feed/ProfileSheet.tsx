// Anonymous corporate profile preview.
// All identifying info is masked — only reputation signals are shown.

import { X, Star, ShieldCheck, Briefcase, FileText } from "lucide-react";
import type { CorporateRequest } from "@/lib/mock-data";
import { CompanyAvatar } from "./CompanyAvatar";
import { VerifiedBadge } from "./VerifiedBadge";

type Props = {
  open: boolean;
  request: CorporateRequest | null;
  onClose: () => void;
};

export function ProfileSheet({ open, request, onClose }: Props) {
  if (!open || !request) return null;
  const { company } = request;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm md:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-sheet-title"
        className="w-full max-w-md animate-in slide-in-from-bottom rounded-t-3xl bg-background shadow-[var(--shadow-elevated)] md:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="profile-sheet-title" className="text-base font-semibold">
            Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="flex items-center gap-3">
            <CompanyAvatar hue={company.avatarHue} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-base font-semibold text-foreground">{company.handle}</span>
                <VerifiedBadge level={company.verification} />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{company.industry}</p>
            </div>
          </div>

          {/* Reputation grid */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ReputationStat
              icon={<Star className="h-4 w-4 fill-accent text-accent" />}
              label="Rating"
              value={company.rating > 0 ? company.rating.toFixed(1) : "—"}
            />
            <ReputationStat
              icon={<FileText className="h-4 w-4 text-primary" />}
              label="Requests"
              value={company.requestsPosted.toString()}
            />
            <ReputationStat
              icon={<ShieldCheck className="h-4 w-4 text-success" />}
              label="Status"
              value={company.verification === "premium" ? "Premium" : company.verification === "verified" ? "Verified" : "New"}
            />
          </div>

          {/* Anonymity notice */}
          <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Briefcase className="h-3.5 w-3.5" />
              Identity protected
            </div>
            <p className="mt-1 leading-relaxed">
              Real company name, contact, and address are revealed only after both parties accept
              an offer and escrow is funded.
            </p>
          </div>

          {/* History (mocked) */}
          <div className="mt-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recent activity
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Posted a request", meta: "2d ago" },
                { label: "Completed rental", meta: "Last month" },
                { label: "Joined platform", meta: "6 months ago" },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs"
                >
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted-foreground">{item.meta}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background text-sm font-medium text-foreground"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ReputationStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-2 py-2.5 text-center">
      <div className="flex justify-center">{icon}</div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
