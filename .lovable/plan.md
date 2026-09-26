# Multi-Tenant Church Event Carpooling SaaS — Product & Architecture Contract

## Product
A white-label carpooling SaaS for churches and other membership organizations. The platform is not Koinonia-specific. Koinonia Global is Tenant #1 and General Assembly 2026 is one event.

## Hierarchy
Platform → Organization → optional Campus → Event → Ride → Participants.

## Experiences
1. Member Portal — organization-branded event discovery, find/offer rides, requests, trips, profile and verification.
2. Organization Console — events, rides, members, verification, safety, analytics, branding, domains, staff and settings.
3. Platform Admin — organizations, subscriptions, domains, events, users, safety, billing, analytics, audit and platform settings.

## Identity & roles
Permanent roles: member, organization_staff, organization_admin, platform_admin.
Driver and passenger are per-ride participation modes, never permanent account roles.
A person may drive outbound and ride as a passenger on the return journey.

## Multi-tenancy
Every tenant-owned record MUST carry organization_id. Event-owned operational records MUST also carry event_id. Campus is optional.
Organization users MUST never read/write another organization's records. Backend enforcement must use database RLS; frontend hiding is insufficient. Platform admins use separately authorized cross-tenant access.

Core entities:
- organizations
- organization_branding
- organization_domains
- organization_policies
- campuses
- organization_memberships
- organization_staff_permissions
- events
- event_memberships
- vehicles
- member_verifications
- vehicle_verifications
- rides
- seat_requests
- ride_participants
- waitlist_entries
- incidents
- notifications
- subscriptions
- audit_logs

## Tenant resolution
Resolve request hostname → organization_domains → organization. Load tenant branding/policy before rendering.
Each organization receives a default platform subdomain and may connect custom domains.
Unknown/inactive domains must not fall back to another tenant.

## White label
Tenant theme controls logo, favicon, portal name, primary/accent colors, welcome copy and support details. UI must use semantic tokens via a TenantProvider, not hard-coded Koinonia styling.

## Organization onboarding
Create account → create organization → optional campuses → branding → domain → verification rules → carpool policies → first event → invite staff/members → publish.

## Events
Fields: organization_id, optional campus_id, name, description, image, venue, location, dates, arrival/departure windows, expected attendance, carpool open/close, status.
Lifecycle: draft → published → carpool_open → live → completed → archived.
Organizations can configure approved pickup hubs.

## Member journey
Join organization portal → lightweight member profile → browse event → Find a Ride or Offer a Ride.
Progressive verification: browsing can be lighter; requesting/offering follows organization policy.
Member verification may include phone/email, organization membership, identity, emergency contact. Driver verification may add driver licence and vehicle verification.

## Ride journey
Offer ride with event, direction (outbound/return), broad origin, optional approved meeting point, departure time, vehicle, seats, free/contribution.
Passenger searches by origin/landmark, time window, seats and direction.
Request states: pending → accepted/declined/cancelled/expired/waitlisted.
Acceptance must transactionally reserve a seat.
Ride lifecycle: draft → open → full → boarding → active → completed/cancelled.
Passenger lifecycle includes accepted, at_meeting_point, boarded, arrived, no_show, cancelled.
Return journeys are independent rides.

## Changes & cancellations
Material driver edits (time, origin/meeting point, vehicle/date) notify accepted passengers and may require reconfirmation.
Passenger cancellation reopens inventory. Driver cancellation notifies all participants and offers alternatives/waitlist matching.

## Waitlist & matching
Match by organization, event, direction, broad area/approved hub, departure window, seat availability and policy/verification eligibility. Exact residential addresses are not required.

## Safety
Emergency contact, incident reporting, member/driver suspension, vehicle blocking, organization-level moderation and platform escalation. Organizations only see their own incidents.

## Notifications
Design for in-app plus configurable email, WhatsApp, SMS and push. Events include request/accept/decline, changes, cancellation, driver arrival, ride start, waitlist match and event reminders.

## Organization staff
Support organization owner/admin/staff with granular permissions: events, members, verification, rides, safety, analytics, branding/domain, billing and staff administration.

## SaaS billing
Subscription states: trial, active, past_due, suspended, cancelled. Plan/limits are platform-configurable. Suspension must preserve historical tenant data.

## Analytics
Organization: drivers, passengers, seats offered/used, utilization, unmatched demand, waitlist, cancellations, no-shows, completed rides, popular origins.
Platform: organizations, active tenants, events, members, rides, cities, retention, subscription usage/revenue.

## Audit
Log sensitive administrative actions including verification overrides, suspensions, event publication/closure, manual ride cancellation, domain/branding changes and staff permission changes.

## Current implementation rule
Frontend may use mock data until backend integration begins, but mock structures MUST reflect this architecture. Do not introduce new Corporate/Host/FleetLink concepts.

## Backend phase
Supabase integration must implement Auth, normalized tenant schema, RLS, transactional seat inventory, storage policies, audit logging and tenant-safe RPCs. External providers (identity/NIN, payments, maps, WhatsApp/SMS/email, custom-domain provisioning, live GPS) remain adapter interfaces until selected.

## Release proof
Before production, test at least three tenants concurrently. Tenant A cannot access B/C data; tenant members cannot discover cross-tenant rides/events; platform admin can access authorized cross-tenant administration; each hostname renders only its resolved tenant branding/data.
