# Supabase carpool backend setup

This branch is project-neutral. Do not point it at an unrelated Supabase project.

1. Create or identify the dedicated carpool Supabase project.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` locally. Never expose a secret/service-role key.
3. Review `supabase/blueprints/001_multi_tenant_carpool.sql` and `002_atomic_ride_rpcs.sql`.
4. Apply the reviewed schema to a staging project first.
5. Run Supabase security/performance advisors.
6. Create two Auth users and organization memberships: one driver and one passenger.
7. Seed one organization + event + verified driver vehicle.
8. In separate browser profiles, sign in as driver/passenger.
9. Driver publishes ride; passenger searches and requests; driver accepts.
10. Verify exactly one seat is decremented, participant is created, tenant isolation holds, and cancellation restores inventory.
11. Verify a second organization cannot read the first organization's events/rides/requests.

The frontend service boundary is `src/lib/carpool-api.ts`. The existing in-memory engine remains available until staging is configured, so UI work is not blocked.
