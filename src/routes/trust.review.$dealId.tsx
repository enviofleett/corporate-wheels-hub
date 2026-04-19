import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { TrustTopBar } from "@/components/trust/TrustTopBar";
import { StarRating } from "@/components/trust/StarRating";
import { CompanyAvatar } from "@/components/feed/CompanyAvatar";
import { getReviewableDeal } from "@/lib/trust-data";
import { formatNaira, formatDuration } from "@/lib/format";

export const Route = createFileRoute("/trust/review/$dealId")({
  loader: ({ params }) => {
    const deal = getReviewableDeal(params.dealId);
    if (!deal) throw notFound();
    return { deal };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData ? `Review ${loaderData.deal.counterparty}` : "Review — FleetLink",
      },
      { name: "description", content: "Submit your post-rental review." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Error: {error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md p-8 text-center">
      <p className="text-sm font-semibold text-foreground">Deal not found</p>
      <Link to="/trust/reviews" className="mt-3 inline-block text-xs font-semibold text-accent">
        Back to reviews
      </Link>
    </div>
  ),
  component: ReviewPage,
});

const TAGS = [
  "Communication",
  "On-time",
  "Vehicle clean",
  "Professional",
  "Good condition",
  "Fair pricing",
  "Easy handover",
  "Responsive",
];

const RATING_COPY = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

function ReviewPage() {
  const { deal } = Route.useLoaderData();
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const valid = rating > 0 && recommend !== null;

  function toggleTag(t: string) {
    setTags((arr) => (arr.includes(t) ? arr.filter((x) => x !== t) : [...arr, t]));
  }

  if (submitted) {
    return (
      <>
        <TrustTopBar title="Review submitted" back={false} />
        <main className="mx-auto w-full max-w-md px-5 pt-10">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-foreground">Thanks for your feedback</h2>
            <p className="mt-2 max-w-xs text-xs text-muted-foreground">
              Your review helps the community match better and earns you a trust score boost.
            </p>
            <div className="mt-6 flex w-full flex-col gap-2">
              <button
                type="button"
                onClick={() => router.navigate({ to: "/trust/reviews" })}
                className="flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
              >
                Back to reviews
              </button>
              <button
                type="button"
                onClick={() => router.navigate({ to: "/trust" })}
                className="flex h-11 items-center justify-center rounded-xl border border-border bg-background text-sm font-semibold text-foreground"
              >
                Trust dashboard
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <TrustTopBar title="Rate this rental" subtitle={deal.id} />

      <main className="mx-auto w-full max-w-md space-y-5 px-5 pt-4 pb-32">
        {/* Counterparty card */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <CompanyAvatar hue={deal.counterpartyHue} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{deal.counterparty}</p>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {deal.vehicleLabel}
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-muted/40 p-3 text-center">
            <Stat label="Duration" value={formatDuration(deal.durationWeeks)} />
            <Stat label="Amount" value={formatNaira(deal.amount)} />
          </div>
        </section>

        {/* Star rating */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Overall experience
          </p>
          <div className="mt-3 flex justify-center">
            <StarRating value={rating} onChange={setRating} size={36} />
          </div>
          <p className="mt-2 text-center text-sm font-bold text-foreground">
            {rating > 0 ? RATING_COPY[rating] : "Tap to rate"}
          </p>
        </section>

        {/* Tags */}
        <section>
          <p className="mb-2 text-xs font-semibold text-foreground">
            What stood out? <span className="font-normal text-muted-foreground">(optional)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => {
              const active = tags.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </section>

        {/* Comment */}
        <section>
          <p className="mb-1.5 text-xs font-semibold text-foreground">
            Add a comment{" "}
            <span className="font-normal text-muted-foreground">(optional, private to admin)</span>
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 400))}
            rows={4}
            placeholder="Share specifics that help others choose well."
            className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-1 text-right text-[10px] text-muted-foreground">
            {400 - comment.length} characters left
          </p>
        </section>

        {/* Recommend */}
        <section>
          <p className="mb-2 text-xs font-semibold text-foreground">
            Would you transact with them again?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { val: true, label: "Yes, recommend" },
              { val: false, label: "No, wouldn't" },
            ].map((opt) => {
              const active = recommend === opt.val;
              return (
                <button
                  key={String(opt.val)}
                  type="button"
                  onClick={() => setRecommend(opt.val)}
                  className={`rounded-xl border px-3 py-3 text-xs font-semibold transition-colors ${
                    active
                      ? opt.val
                        ? "border-success bg-success/10 text-success"
                        : "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex items-start gap-2 rounded-xl bg-accent-soft p-3">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          <p className="text-[11px] leading-relaxed text-foreground">
            Reviews are anonymous to the public — only your trust score and aggregate rating are
            shown.
          </p>
        </div>
      </main>

      {/* Sticky submit */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md gap-2 px-5 py-3">
          <button
            type="button"
            onClick={() => router.history.back()}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-border bg-background text-sm font-semibold text-foreground"
          >
            Skip
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => setSubmitted(true)}
            className="flex h-11 flex-[1.4] items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit review
          </button>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}
