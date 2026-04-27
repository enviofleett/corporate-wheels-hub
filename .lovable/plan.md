
## Current problem

Right now `/feed`, `/offers`, `/payments/*`, and `/trust/*` are gated to **all three roles** (`["corporate","host","admin"]`). That's why a Corporate user can wander into Host-only screens (and vice versa) — only the four `/host/*` and `/corporate/*` and `/admin/*` shells are strictly role-locked. The `/role` screen also doesn't tell the user what they'll get, and it links Admins straight to `/admin` with no warning.

## Proposed roles → pages mapping

This is the contract I'll enforce in `withRole(...)` and surface on the `/role` screen.

### Corporate (books vehicles)
- `/corporate` — dashboard home
- `/corporate/requests` — my posted requests (list)
- `/corporate/requests/$requestId` — request detail + offers
- `/corporate/offers` — incoming offers inbox
- `/corporate/deals` — active/selected deals
- `/feed` — browse host vehicles / post a request *(shared, but corporate-flavored CTA)*
- `/offers` + `/offers/$negotiationId` — negotiation threads on requests they posted
- `/payments` — wallet home (corporate sees: fund escrow, methods, receipts)
- `/payments/methods` — cards & bank accounts
- `/payments/receipts` + `/payments/receipts/$txnId` — payment receipts
- `/trust` — trust hub
- `/trust/kyc` — corporate KYC
- `/trust/disputes`, `/trust/disputes/new`, `/trust/disputes/$id` — file/track disputes
- `/trust/reviews`, `/trust/review/$dealId` — leave reviews on hosts

**Corporate does NOT see:** `/payments/payouts` (payouts are a host concept), any `/host/*`, any `/admin/*`.

### Host (lists vehicles, earns)
- `/host` — dashboard home
- `/host/vehicles` — manage fleet
- `/host/offers` — offers I've sent
- `/host/engaged` — requests I'm engaged on
- `/host/earnings` — earnings + payout history
- `/feed` — browse open corporate requests *(shared, host-flavored CTA)*
- `/offers` + `/offers/$negotiationId` — negotiation threads on offers they sent
- `/payments` — wallet home (host sees: payouts, methods, receipts)
- `/payments/methods` — payout bank accounts
- `/payments/payouts` — request/track payouts
- `/payments/receipts` + `/payments/receipts/$txnId` — earnings receipts
- `/trust` — trust hub
- `/trust/kyc` — host KYC (driver license, vehicle docs)
- `/trust/disputes`, `/trust/disputes/new`, `/trust/disputes/$id`
- `/trust/reviews`, `/trust/review/$dealId` — leave reviews on corporates

**Host does NOT see:** any `/corporate/*`, any `/admin/*`.

### Admin (internal staff)
- All `/admin/*` routes (already locked)
- Read-only access to `/feed`, `/offers/*`, `/payments/*`, `/trust/*` so they can inspect what users see when investigating tickets.

**Admin does NOT see:** `/corporate/*` or `/host/*` user dashboards (those are role-specific UIs, not admin tools).

## Changes

### 1. Re-gate the "shared" routes more strictly

| Route | New `withRole` allow-list |
|---|---|
| `/feed` | `["corporate","host","admin"]` (unchanged — both sides browse) |
| `/offers`, `/offers/$negotiationId` | `["corporate","host","admin"]` (unchanged — negotiations are mutual) |
| `/payments`, `/payments/methods`, `/payments/receipts`, `/payments/receipts/$txnId` | `["corporate","host","admin"]` (unchanged) |
| `/payments/payouts` | **`["host","admin"]`** (was all three — corporates don't get paid out) |
| `/trust`, `/trust/kyc`, `/trust/disputes*`, `/trust/reviews`, `/trust/review/$dealId` | `["corporate","host","admin"]` (unchanged — both sides need trust) |

Most "shared" stays shared because feed/offers/trust are inherently cross-role surfaces. The one real leak is `/payments/payouts`, which is host-only.

### 2. Make `/payments` render role-aware tiles

`src/routes/payments.index.tsx` currently shows a "Payouts" tile to everyone. Hide that tile for `corporate` (read role from `useRole()`), and swap the headline copy ("Wallet" for corporate, "Earnings & wallet" for host).

### 3. Redesign `/role` screen

Update `src/routes/role.tsx` so each role card lists the dashboards it unlocks (a small bullet list under the description), e.g.:

```text
Corporate
  Post requests · Compare offers · Wallet · Trust hub
  → /corporate, /feed, /offers, /payments, /trust

Host
  Vehicles · Offers · Engaged · Earnings · Payouts
  → /host, /feed, /offers, /payments, /trust

Admin
  Users · KYC · Disputes · Finance · Audit
  → /admin (internal only)
```

Add a small "Currently signed in as: X · Switch" indicator at the top when a role is already set, so testers always know which role is active.

### 4. Remove cross-role link leaks

- `src/components/feed/BottomNav.tsx` is the generic feed nav with disabled "Vehicles"/"Profile" stubs and a "Post" button that goes nowhere meaningful. Make it role-aware: when role is `host`, the home/profile slots link to `/host`; when role is `corporate`, they link to `/corporate`. The "Post" button only shows for corporates (only they post requests).
- `src/routes/offers.tsx` shows a single inbox to both sides today. Keep the route shared, but filter the listed negotiations by role: corporates see negotiations on their requests, hosts see negotiations on their offers. (Data lives in `src/lib/negotiations.ts` — add a `forRole` filter.)
- `src/routes/host.index.tsx` "Browse requests" links to `/feed` — fine. No change.
- `src/routes/corporate.tsx` links to `/trust` — fine.

### 5. Friendlier blocked-access UX

`RequireRole` currently silently redirects to `/role`. Pass the attempted path as a search param (`?from=/host/vehicles`) and show a small banner on `/role`: *"You tried to open /host/vehicles — that page is for Hosts. Pick the matching role to continue."* This stops the "I clicked a link and got bounced with no explanation" confusion.

## Files to edit

- `src/routes/role.tsx` — redesigned cards with route lists + "from" banner + active-role indicator.
- `src/components/auth/RequireRole.tsx` — append `?from=<pathname>` when redirecting.
- `src/routes/payments.payouts.tsx` — change `withRole` to `["host","admin"]`.
- `src/routes/payments.index.tsx` — hide Payouts tile for corporate; tweak copy via `useRole()`.
- `src/components/feed/BottomNav.tsx` — role-aware home/profile/post slots.
- `src/routes/offers.tsx` + `src/lib/negotiations.ts` — filter listed negotiations by current role.

## Files NOT changing

All `/corporate/*`, `/host/*`, `/admin/*` routes already have correct strict gating — leaving them as-is.

## Out of scope

Real auth, server-side role enforcement, and a persistent in-app role switcher in the top bars (you previously chose "switch only via /role" — keeping that).
