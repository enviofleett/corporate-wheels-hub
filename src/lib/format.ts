// Formatting helpers used across the feed.

export function formatNaira(amount: number): string {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return `₦${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(0)}k`;
  }
  return `₦${amount}`;
}

export function formatDuration(weeks: number): string {
  if (weeks >= 52) {
    const y = weeks / 52;
    return `${y % 1 === 0 ? y.toFixed(0) : y.toFixed(1)} year${y === 1 ? "" : "s"}`;
  }
  if (weeks >= 4) {
    const m = Math.round(weeks / 4);
    return `${m} month${m === 1 ? "" : "s"}`;
  }
  return `${weeks} week${weeks === 1 ? "" : "s"}`;
}

// Stable, deterministic relative time so SSR and client agree.
// The mock data uses fixed timestamps relative to a fixed "now",
// so we compute against the same anchor on both server and client.
const FEED_NOW = new Date("2025-04-18T10:00:00Z").getTime();

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.floor((FEED_NOW - then) / 1000));
  if (diffSec < 60) return "just now";
  const m = Math.floor(diffSec / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  return `${w}w`;
}
