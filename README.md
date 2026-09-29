# Corporate Wheels Hub

Build a mobile-first, responsive frontend UI/UX for a corporate vehicle rental marketplace with a strong social media experience.

IMPORTANT BUILD RULES:

- Build this project in PHASES (do NOT attempt everything at once)

- Focus ONLY on frontend UI/UX (no backend integration yet)

- Do NOT integrate Paystack, telematics devices, or any APIs yet

- Use mock data, placeholders, and simulated states where necessary

- Ensure clean, scalable component structure

- Optimize for mobile-first, but support desktop responsiveness

---

PRODUCT OVERVIEW:

This platform connects:

1. Corporate organizations (who request vehicles)

2. Hosts (vehicle owners who respond)

Core Idea:

- Corporates post rental requests (like social posts)

- Hosts see these on a feed and respond with offers

- Negotiation happens inside the platform

- Both parties remain anonymous until agreement

- Platform later handles escrow and telematics (UI only for now)

---

DESIGN SYSTEM:

- Primary Color: Deep Blue (#0B1F3A)

- Accent Color: Orange (#FF7A00)

- Background: White (#FFFFFF)

Style:

- Clean, modern, high-trust

- Card-based layout

- Soft shadows

- Rounded corners (8–12px)

- Bold orange CTAs

- Minimal clutter

---

PHASE 1: AUTHENTICATION & ONBOARDING UI

Build:

1. Welcome screen

2. Role selection (Corporate / Host)

3. Corporate signup flow:
   - Company Name

   - CAC Number (input only)

   - Business Address

   - Contact Person (Name, Phone, ID upload placeholder)

   - Bank Account details

4. Host signup flow:
   - Personal details

   - Vehicle details

   - ID upload placeholder

IMPORTANT:

- Include Terms & Conditions screen BEFORE account creation

- Include checkboxes:
  - Accept escrow usage

  - Accept telematics requirement

  - Accept platform rules

No real verification logic — just UI and state flow

---

PHASE 2: SOCIAL FEED (CORE EXPERIENCE)

Build a social feed similar to Instagram/Twitter:

Each POST = Corporate Request

Post Card should include:

- Company avatar (generic)

- “Verified Business” tag

- Vehicle type

- Quantity needed

- Budget (₦/week or month)

- Duration

- Optional image

- Location (general)

- Timestamp

Actions:

- Offer Vehicle (Primary CTA)

- Counter Offer

- View Profile

Scrolling:

- Infinite scroll UI (mocked)

---

PHASE 3: OFFER & NEGOTIATION UI

When host clicks:

- “Offer Vehicle” → modal/form

- “Counter Offer” → editable form

Fields:

- Vehicle selection

- Price

- Notes

Build a structured conversation UI:

- Threaded interaction (NOT free chat)

- Timeline of offers and counters

- Status indicators:
  - Pending

  - Accepted

  - Rejected

NO real messaging backend — simulate interactions

---

PHASE 4: CORPORATE DASHBOARD

Sections:

- Active Requests

- Incoming Offers

- Selected Deals

- Payment Status (UI only)

Offer Comparison UI:

- Card layout comparing:
  - Host rating

  - Vehicle details

  - Price

  - Reviews

Actions:

- Accept Offer

- Reject Offer

---

PHASE 5: HOST DASHBOARD

Sections:

- My Vehicles

- Active Offers

- Requests Engaged

- Earnings (UI only)

Show:

- Vehicles list

- Offer status

- Engagement activity

---

PHASE 6: PROFILES (ANONYMOUS TRUST SYSTEM)

Corporate Profile:

- Industry

- Verification badge

- Request history

- Rating

Host Profile:

- Vehicle list

- Ratings & reviews

- Completed rentals

- Performance score

IMPORTANT:

- No phone/email visibility

- Identity masked

---

PHASE 7: ESCROW & PAYMENT UI (NO INTEGRATION)

Simulate Paystack flow:

Build:

- Payment modal

- Escrow status tracker

- Payment history UI

States:

- Pending

- Funded

- Held in escrow

- Released

- Failed

Use mock data only

---

PHASE 8: TELEMATICS UI (NO DEVICE INTEGRATION)

Display only:

Vehicle card should show:

- Telematics status:
  - Active

  - Inactive

Optional UI:

- Last seen (mock)

- Alerts (mock)

---

PHASE 9: ADMIN DASHBOARD (DESKTOP-FIRST)

Build a professional admin panel with sidebar navigation:

Modules:

- Overview Dashboard

- Users (Corporate & Host)

- Corporate Verification

- Host Verification

- Vehicle Requests

- Offers & Negotiations

- Rentals

- Escrow & Payments

- Telematics Monitoring

- Inspections

- Disputes

- Reviews & Reports

- Content Moderation

- Notifications

- Analytics

- Settings

- Admin Roles

- Audit Logs

---

ADMIN OVERVIEW:

Show cards:

- Total Users

- Active Requests

- Active Rentals

- Pending Verifications

- Escrow Balance (mock)

- Open Disputes

- Failed Payments

- Flagged Accounts

---

USER MANAGEMENT:

Tables with:

- Filters

- Search

- Status

Actions:

- Approve

- Reject

- Suspend

- View profile

---

REQUEST MODERATION:

Admin can:

- Approve request

- Hide/remove request

- Flag suspicious content

---

OFFERS MONITORING:

Admin can:

- View all negotiations

- Detect suspicious patterns

- Freeze activity

---

RENTAL TRACKING:

Statuses:

- Pending

- Active

- Overdue

- Completed

- Disputed

---

ESCROW MANAGEMENT UI:

Show:

- Transactions

- Status

- Commission breakdown

Actions:

- Release (UI only)

- Hold

- Refund

---

DISPUTE CENTER:

Show:

- Case details

- Evidence

- Timeline

Actions:

- Resolve

- Escalate

- Close

---

ANALYTICS DASHBOARD:

Charts:

- Requests over time

- Conversion rate

- Revenue (mock)

- Dispute trends

---

UX PRINCIPLES:

- Mobile-first design

- Fast actions (max 2–3 steps)

- Clear CTAs

- No clutter

- Social + fintech hybrid feel

- Trust-driven UI (badges, reviews, states)

---

FINAL NOTE:

Do NOT build backend logic yet.

Do NOT integrate APIs.

Focus entirely on:

- UI components

- user flows

- interaction states

- clean design system

Build phase-by-phase and ensure each phase is complete before moving to the next.

This project was built phase-by-phase following the requirements.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
