# Corporate Wheels Hub — Master Carpool Build Plan

## Product Direction

Corporate Wheels Hub is a multi-tenant event and organization carpooling platform.

The platform hierarchy is:

**Platform → Organization → optional Campus → Event → Ride → Participants**

Organizations such as companies, churches, communities, schools, associations, and event organizers can run branded carpool communities where members can offer rides or request seats for events and recurring journeys.

The current event-carpool architecture is the source of truth. The older corporate vehicle-rental marketplace description in the root README is legacy product direction and should be replaced once the implementation reaches the documentation cleanup phase.

---

## Core Roles

### Member / Attendee
- Join an organization.
- View upcoming events.
- Find available rides.
- Request a seat.
- Join a waitlist where applicable.
- View their ride status and trip details.
- Report incidents or safety issues.

### Driver
A member can become a driver after the required organization verification.

Drivers can:
- Register/select a vehicle.
- Offer a ride for an event.
- Choose outbound or return direction.
- Set origin, pickup hub, departure time, seats, and optional contribution.
- Review seat requests.
- Accept or decline passengers.
- Move the ride through the permitted trip lifecycle.

### Organization Staff
- Operational access within their own organization.
- Support events, members, rides, pickup hubs, and driver/vehicle verification based on assigned privileges.

### Organization Admin
- Manage organization profile and branding.
- Manage members and staff.
- Configure campuses and pickup hubs.
- Create and publish events.
- Configure carpool policies.
- Set contribution/commission rules where enabled.
- Approve drivers and vehicles.
- Monitor rides, participants, incidents, and event performance.

### Platform Admin
- Manage all organizations.
- Review platform-level safety and moderation issues.
- View payments, payouts, commissions, disputes, audit logs, and system metrics.
- Suspend or restrict accounts/organizations when necessary.

---

## Main User Journey

### Organization setup
1. Organization is created.
2. Branding and portal settings are configured.
3. Optional custom domain/campus configuration is added.
4. Members are invited or onboarded.
5. Driver and vehicle verification policies are configured.

### Event creation
1. Organization admin creates an event.
2. Event details, venue, date/time, campus, and carpool window are set.
3. Pickup hubs are assigned where applicable.
4. Event is published.

### Driver offers a ride
1. Driver opens an event.
2. Selects **Offer a Ride**.
3. Selects vehicle.
4. Selects outbound or return trip.
5. Sets origin/pickup information.
6. Sets departure time.
7. Sets available seats.
8. Sets permitted contribution if organization policy allows it.
9. Publishes ride.

### Passenger requests a ride
1. Member opens an event.
2. Selects **Find a Ride / Hitch a Ride**.
3. Filters or browses available rides.
4. Opens ride details.
5. Requests a seat.
6. Driver accepts or declines.
7. On acceptance, seat allocation must happen atomically.
8. Passenger becomes a ride participant.

### Ride lifecycle
The target ride lifecycle is:

**Draft → Open → Full → Boarding → Active → Completed**

A ride may also be **Cancelled** subject to policy and current trip state.

Seat availability must never be decremented from the browser alone. Acceptance must use a database transaction/RPC that locks the ride row and guarantees that seats cannot be overbooked.

---

## Event Lifecycle

Target event states:

**Draft → Published → Carpool Open → Live → Completed → Archived**

Organization admins control event publishing, while carpool opening/closing can be time-driven or manually controlled according to organization policy.

---

## Multi-Tenant Security Requirement

Every tenant-owned record must be scoped to `organization_id`.

The database, not only the frontend, must enforce tenant isolation using Supabase Row Level Security.

Key requirements:
- A member can only see permitted data for organizations they belong to.
- Organization admins/staff can only administer their own organizations.
- A driver cannot manage another driver's ride.
- A passenger cannot manage another passenger's request.
- Cross-organization access must fail even if a user manually changes a URL or request payload.
- Platform-admin capabilities must be implemented separately from ordinary organization membership.

---

## Production Backend Work

The existing Supabase SQL files under `supabase/blueprints` are design blueprints, not production migrations.

Production work must include:

1. Versioned Supabase migrations.
2. Complete tables and constraints.
3. RLS on every tenant-sensitive table.
4. Explicit insert/update/delete policies.
5. Atomic ride/seat RPCs.
6. Audit logging for privileged actions.
7. Storage policies for verification documents.
8. Real authentication and profile provisioning.
9. Organization membership/role resolution.
10. Platform-admin authorization.

---

## Core Data Domains

Production schema should cover:

- users/profiles
- organizations
- organization memberships
- organization branding
- organization domains
- campuses
- organization policies
- pickup hubs
- events
- vehicles
- driver applications / verification
- rides
- seat requests
- ride participants
- waitlists
- payments
- payouts
- platform commissions
- organization commissions/contributions
- disputes
- incidents / safety reports
- notifications
- audit logs

---

## Payment & Contribution Model

Payments must remain decoupled from seat assignment so the platform can support both free and paid carpool communities.

Where an organization enables rider contributions:
- Organization controls whether contributions are permitted.
- Organization can configure its permitted amount/rule.
- Platform commission can be configured separately.
- Passenger-facing pricing should show the final amount payable.
- Backend ledger must retain gross amount, processor fees, organization/platform shares, refunds, and payout state.
- Payouts must only occur after the relevant ride/payment settlement rule is satisfied.

---

## Safety & Trust

Required safety capabilities:
- Driver verification status.
- Vehicle verification status.
- Member verification where enabled.
- Ride participant manifest.
- Incident reporting.
- Organization-level safety management.
- Platform-level safety escalation.
- Audit trail for sensitive administrative actions.

Live location can be added after the production identity, ride, and authorization layers are stable.

---

## Organization Portal

Each organization should have a branded portal with:
- logo and organization identity
- welcome message
- upcoming events only on the primary member experience
- event details pages
- Offer a Ride CTA
- Find/Hitch a Ride CTA
- pickup information
- organization-specific policies
- optional custom domain

Expired/completed events should move out of the default upcoming-events experience but remain available through history/admin views.

---

## Admin Experience

### Organization Admin
Must provide drill-down visibility from:

**Event → Rides → Driver → Vehicle → Passengers → Requests → Payments/Contribution → Incident history**

Admin must be able to clearly see:
- number of drivers
- passengers requesting seats
- confirmed passengers
- available seats
- contribution/fee information
- approvals
- ride status
- issues requiring intervention

### Platform Admin
Must provide:
- organizations
- users
- verification/KYC
- rides
- safety
- disputes
- finance
- payouts
- transactions
- announcements/moderation
- audit logs
- platform settings

---

## Notifications

Production notifications should be event-driven.

Initial notification events:
- organization invitation
- driver approved/rejected
- vehicle approved/rejected
- event carpool opened
- seat requested
- request accepted
- request declined
- ride changed
- ride cancelled
- boarding reminder
- ride completed
- payment/refund/payout events where relevant

Notification transport should be abstracted so WhatsApp, email, push, and SMS can be added without rewriting core ride logic.

---

## Implementation Phases

### Phase 1 — Production foundation
- Replace simulated authentication with Supabase Auth.
- Create versioned production schema migrations.
- Implement profiles, organizations, memberships, roles, campuses, policies, hubs, events, vehicles, rides, requests, participants, waitlist, incidents, and audit logs.
- Complete RLS.
- Implement atomic ride creation/request acceptance/lifecycle RPCs.
- Connect the existing frontend to real data.

### Phase 2 — Organization operations
- Organization onboarding.
- Member management.
- Staff roles.
- Driver and vehicle approval.
- Event management.
- Pickup hubs.
- Organization branding and policy settings.

### Phase 3 — Member and driver experience
- Upcoming events.
- Event detail.
- Offer a Ride.
- Find/Hitch a Ride.
- Seat requests.
- Driver request management.
- Ride manifest.
- Boarding/active/completion flow.
- Waitlist.

### Phase 4 — Payments and finance
- Finalize contribution rules.
- Payment provider integration.
- Transaction ledger.
- Commission accounting.
- Refunds.
- Payouts.
- Finance dashboards.

### Phase 5 — Notifications and safety
- Notification event system.
- WhatsApp/email/push/SMS adapters.
- Incident workflow.
- Admin safety escalation.
- Optional live-location sharing.

### Phase 6 — Platform administration
- Organization oversight.
- User oversight.
- Finance oversight.
- Disputes.
- Moderation.
- Audit logs.
- Platform configuration.

### Phase 7 — Production hardening
- Automated tests.
- RLS security tests.
- Concurrency tests for seat allocation.
- End-to-end tests.
- Error monitoring.
- Rate limiting.
- CI on `main` and pull requests.
- Deployment checks.
- Production readiness audit.

---

## Definition of Done

The product is production-ready when a new organization can be onboarded, configure its own portal, create an event, onboard members, approve drivers/vehicles, receive ride offers, match passengers to seats without race conditions, run the complete trip lifecycle, enforce organization isolation in the database, handle applicable payments/commissions, send operational notifications, manage incidents, and expose correct organization/platform admin reporting without mocked state or localStorage-based authorization.
