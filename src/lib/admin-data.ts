// Mock data for the Admin Dashboard (Phase 8).
// Users (hosts & corporates), KYC queue, disputes, vehicle approvals,
// payouts approvals, refunds, transactions, audit log, announcements.

export type AdminRole = "hosts" | "corporates";
export type UserStatus = "active" | "pending" | "suspended" | "banned";
export type KycLevel = "new" | "verified" | "premium";

export type AdminUser = {
  id: string;
  handle: string;
  role: AdminRole;
  status: UserStatus;
  kycLevel: KycLevel;
  trustScore: number; // 0-100
  hue: number;
  joinedAt: string;
  lastActiveAt: string;
  vehiclesCount?: number; // hosts
  requestsCount?: number; // corporates
  dealsCount: number;
  lifetimeVolume: number; // NGN
  openDisputes: number;
  flagged: boolean;
  email: string;
  phone: string;
  city: string;
};

export type KycQueueStatus = "in_review" | "needs_info" | "auto_flagged";
export type KycQueueItem = {
  id: string;
  userId: string;
  userHandle: string;
  userRole: AdminRole;
  hue: number;
  step: "id" | "business" | "address" | "bank";
  submittedAt: string;
  status: KycQueueStatus;
  riskScore: number; // 0-100
  notes?: string;
};

export type AdminDisputeStatus = "open" | "under_review" | "needs_admin" | "resolved";
export type AdminDispute = {
  id: string;
  dealId: string;
  vehicleLabel: string;
  hostHandle: string;
  corporateHandle: string;
  reason: string;
  amount: number;
  status: AdminDisputeStatus;
  createdAt: string;
  ageHours: number;
  priority: "low" | "med" | "high";
};

export type ModerationKind = "request" | "offer" | "review" | "vehicle" | "message";
export type ModerationItem = {
  id: string;
  kind: ModerationKind;
  reportedBy: string;
  reportedHandle: string;
  reason: string;
  excerpt: string;
  reportedAt: string;
  status: "pending" | "approved" | "rejected";
};

export type AdminPayoutStatus = "awaiting_approval" | "approved" | "rejected" | "completed";
export type AdminPayout = {
  id: string;
  hostHandle: string;
  hostId: string;
  amount: number;
  bank: string;
  requestedAt: string;
  status: AdminPayoutStatus;
  riskFlag?: string;
};

export type AdminTxn = {
  id: string;
  ref: string;
  kind: "escrow_funding" | "escrow_release" | "refund" | "payout" | "fee";
  amount: number;
  fee?: number;
  date: string;
  payer: string;
  payee: string;
  status: "successful" | "pending" | "failed" | "refunded";
};

export type AuditEntry = {
  id: string;
  actor: string; // admin handle
  action: string;
  target: string;
  at: string;
  ip: string;
  severity: "info" | "warn" | "critical";
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: "all" | "hosts" | "corporates";
  scheduledFor: string;
  status: "draft" | "scheduled" | "sent";
  reach?: number;
};

const NOW = new Date("2025-04-18T10:00:00Z").getTime();
const ago = (h: number) => new Date(NOW - h * 3_600_000).toISOString();
const fmtAge = (h: number) => h;

// ─── Users ──────────────────────────────────────────────────────────────────
const USERS: AdminUser[] = [
  {
    id: "usr_h_001",
    handle: "Host #E558",
    role: "hosts",
    status: "active",
    kycLevel: "premium",
    trustScore: 96,
    hue: 30,
    joinedAt: ago(24 * 180),
    lastActiveAt: ago(2),
    vehiclesCount: 8,
    dealsCount: 24,
    lifetimeVolume: 18_400_000,
    openDisputes: 0,
    flagged: false,
    email: "host_e558@masked.fleet",
    phone: "+234 ••• •• 4421",
    city: "Lagos",
  },
  {
    id: "usr_h_002",
    handle: "Host #B7F1",
    role: "hosts",
    status: "active",
    kycLevel: "verified",
    trustScore: 84,
    hue: 210,
    joinedAt: ago(24 * 90),
    lastActiveAt: ago(8),
    vehiclesCount: 3,
    dealsCount: 11,
    lifetimeVolume: 6_120_000,
    openDisputes: 1,
    flagged: false,
    email: "host_b7f1@masked.fleet",
    phone: "+234 ••• •• 9087",
    city: "Abuja",
  },
  {
    id: "usr_h_003",
    handle: "Host #A2C9",
    role: "hosts",
    status: "pending",
    kycLevel: "new",
    trustScore: 38,
    hue: 140,
    joinedAt: ago(36),
    lastActiveAt: ago(1),
    vehiclesCount: 1,
    dealsCount: 0,
    lifetimeVolume: 0,
    openDisputes: 0,
    flagged: true,
    email: "host_a2c9@masked.fleet",
    phone: "+234 ••• •• 2210",
    city: "Port Harcourt",
  },
  {
    id: "usr_h_004",
    handle: "Host #X914",
    role: "hosts",
    status: "suspended",
    kycLevel: "verified",
    trustScore: 41,
    hue: 350,
    joinedAt: ago(24 * 240),
    lastActiveAt: ago(24 * 4),
    vehiclesCount: 4,
    dealsCount: 9,
    lifetimeVolume: 3_440_000,
    openDisputes: 2,
    flagged: true,
    email: "host_x914@masked.fleet",
    phone: "+234 ••• •• 5560",
    city: "Lagos",
  },
  {
    id: "usr_c_001",
    handle: "Logistics Co. #4821",
    role: "corporates",
    status: "active",
    kycLevel: "verified",
    trustScore: 88,
    hue: 220,
    joinedAt: ago(24 * 120),
    lastActiveAt: ago(0.5),
    requestsCount: 24,
    dealsCount: 14,
    lifetimeVolume: 22_900_000,
    openDisputes: 1,
    flagged: false,
    email: "ops@logistics4821.masked",
    phone: "+234 ••• •• 4821",
    city: "Lagos",
  },
  {
    id: "usr_c_002",
    handle: "FinTech Group #2210",
    role: "corporates",
    status: "active",
    kycLevel: "premium",
    trustScore: 95,
    hue: 180,
    joinedAt: ago(24 * 320),
    lastActiveAt: ago(3),
    requestsCount: 51,
    dealsCount: 38,
    lifetimeVolume: 64_500_000,
    openDisputes: 0,
    flagged: false,
    email: "procure@fintech2210.masked",
    phone: "+234 ••• •• 2210",
    city: "Abuja",
  },
  {
    id: "usr_c_003",
    handle: "AgroTech #3398",
    role: "corporates",
    status: "pending",
    kycLevel: "new",
    trustScore: 22,
    hue: 140,
    joinedAt: ago(20),
    lastActiveAt: ago(0.2),
    requestsCount: 1,
    dealsCount: 0,
    lifetimeVolume: 0,
    openDisputes: 0,
    flagged: true,
    email: "ops@agro3398.masked",
    phone: "+234 ••• •• 3398",
    city: "Ibadan",
  },
  {
    id: "usr_c_004",
    handle: "Energy Corp #0091",
    role: "corporates",
    status: "active",
    kycLevel: "premium",
    trustScore: 99,
    hue: 260,
    joinedAt: ago(24 * 540),
    lastActiveAt: ago(6),
    requestsCount: 88,
    dealsCount: 71,
    lifetimeVolume: 184_200_000,
    openDisputes: 0,
    flagged: false,
    email: "fleet@energy0091.masked",
    phone: "+234 ••• •• 0091",
    city: "Lagos",
  },
];

const KYC_QUEUE: KycQueueItem[] = [
  {
    id: "kyc_q_001",
    userId: "usr_h_003",
    userHandle: "Host #A2C9",
    userRole: "hosts",
    hue: 140,
    step: "id",
    submittedAt: ago(2),
    status: "auto_flagged",
    riskScore: 78,
    notes: "ID photo unreadable; auto-OCR confidence below threshold.",
  },
  {
    id: "kyc_q_002",
    userId: "usr_c_003",
    userHandle: "AgroTech #3398",
    userRole: "corporates",
    hue: 140,
    step: "business",
    submittedAt: ago(6),
    status: "in_review",
    riskScore: 24,
  },
  {
    id: "kyc_q_003",
    userId: "usr_h_001",
    userHandle: "Host #E558",
    userRole: "hosts",
    hue: 30,
    step: "bank",
    submittedAt: ago(18),
    status: "needs_info",
    riskScore: 12,
    notes: "Account name mismatch; awaiting clarification.",
  },
  {
    id: "kyc_q_004",
    userId: "usr_h_002",
    userHandle: "Host #B7F1",
    userRole: "hosts",
    hue: 210,
    step: "address",
    submittedAt: ago(30),
    status: "in_review",
    riskScore: 8,
  },
];

const ADMIN_DISPUTES: AdminDispute[] = [
  {
    id: "DSP-2041",
    dealId: "DEAL-119",
    vehicleLabel: "Mercedes Sprinter 2021",
    hostHandle: "Host #E558",
    corporateHandle: "Logistics Co. #4821",
    reason: "Vehicle condition",
    amount: 145_000,
    status: "needs_admin",
    createdAt: ago(48),
    ageHours: fmtAge(48),
    priority: "high",
  },
  {
    id: "DSP-2032",
    dealId: "DEAL-104",
    vehicleLabel: "Toyota Hilux 2020",
    hostHandle: "Host #B7F1",
    corporateHandle: "Bright Anchor FMCG",
    reason: "Late delivery",
    amount: 80_000,
    status: "under_review",
    createdAt: ago(20),
    ageHours: fmtAge(20),
    priority: "med",
  },
  {
    id: "DSP-2055",
    dealId: "DEAL-131",
    vehicleLabel: "Ford Transit 2019",
    hostHandle: "Host #X914",
    corporateHandle: "Stellar Field Ops",
    reason: "No-show",
    amount: 230_000,
    status: "open",
    createdAt: ago(4),
    ageHours: fmtAge(4),
    priority: "high",
  },
];

const MOD_QUEUE: ModerationItem[] = [
  {
    id: "mod_001",
    kind: "request",
    reportedBy: "usr_h_002",
    reportedHandle: "AgroTech #3398",
    reason: "Suspected fake budget",
    excerpt: "Need 10 refrigerated trucks for ₦50k/week …",
    reportedAt: ago(3),
    status: "pending",
  },
  {
    id: "mod_002",
    kind: "review",
    reportedBy: "usr_h_004",
    reportedHandle: "Logistics Co. #4821",
    reason: "Personal attack",
    excerpt: "The driver was completely useless, what a waste …",
    reportedAt: ago(8),
    status: "pending",
  },
  {
    id: "mod_003",
    kind: "vehicle",
    reportedBy: "system",
    reportedHandle: "Host #X914",
    reason: "Plate number invalid",
    excerpt: "Toyota Hilux — plate format does not match LSD/ABJ pattern.",
    reportedAt: ago(14),
    status: "pending",
  },
  {
    id: "mod_004",
    kind: "message",
    reportedBy: "usr_c_001",
    reportedHandle: "Host #X914",
    reason: "Off-platform contact",
    excerpt: "WhatsApp me on 0803••• …",
    reportedAt: ago(22),
    status: "pending",
  },
];

const PAYOUT_APPROVALS: AdminPayout[] = [
  {
    id: "po_a_001",
    hostHandle: "Host #E558",
    hostId: "usr_h_001",
    amount: 1_055_000,
    bank: "GTBank •••• 4421",
    requestedAt: ago(1),
    status: "awaiting_approval",
  },
  {
    id: "po_a_002",
    hostHandle: "Host #B7F1",
    hostId: "usr_h_002",
    amount: 480_000,
    bank: "Access •••• 9087",
    requestedAt: ago(5),
    status: "awaiting_approval",
    riskFlag: "First payout to this account",
  },
  {
    id: "po_a_003",
    hostHandle: "Host #X914",
    hostId: "usr_h_004",
    amount: 220_000,
    bank: "Zenith •••• 0312",
    requestedAt: ago(12),
    status: "awaiting_approval",
    riskFlag: "Account suspended — open disputes",
  },
  {
    id: "po_a_004",
    hostHandle: "Host #E558",
    hostId: "usr_h_001",
    amount: 850_000,
    bank: "GTBank •••• 4421",
    requestedAt: ago(72),
    status: "completed",
  },
];

const TXNS: AdminTxn[] = [
  {
    id: "atxn_001",
    ref: "FLK-ESC-2025-0418-001",
    kind: "escrow_funding",
    amount: 6_960_000,
    fee: 34_800,
    date: ago(2),
    payer: "Construction Ltd #1145",
    payee: "Host #E558",
    status: "successful",
  },
  {
    id: "atxn_002",
    ref: "FLK-REL-2025-0417-014",
    kind: "escrow_release",
    amount: 600_000,
    date: ago(18),
    payer: "Escrow",
    payee: "Host #E558",
    status: "successful",
  },
  {
    id: "atxn_003",
    ref: "FLK-PO-2025-0411-001",
    kind: "payout",
    amount: 1_055_000,
    date: ago(24 * 7),
    payer: "FleetLink",
    payee: "Host #E558",
    status: "successful",
  },
  {
    id: "atxn_004",
    ref: "FLK-REF-2025-0410-007",
    kind: "refund",
    amount: 145_000,
    date: ago(24 * 8),
    payer: "Escrow",
    payee: "Logistics Co. #4821",
    status: "successful",
  },
  {
    id: "atxn_005",
    ref: "FLK-ESC-2025-0416-002",
    kind: "escrow_funding",
    amount: 28_320_000,
    fee: 141_600,
    date: ago(48),
    payer: "FinTech Group #2210",
    payee: "Host #B7F1",
    status: "pending",
  },
];

const AUDIT: AuditEntry[] = [
  {
    id: "aud_001",
    actor: "admin@fleetlink",
    action: "Approved KYC step",
    target: "Host #E558 / bank",
    at: ago(0.3),
    ip: "102.89.•••.12",
    severity: "info",
  },
  {
    id: "aud_002",
    actor: "admin@fleetlink",
    action: "Suspended user",
    target: "Host #X914",
    at: ago(2),
    ip: "102.89.•••.12",
    severity: "warn",
  },
  {
    id: "aud_003",
    actor: "ops@fleetlink",
    action: "Released escrow",
    target: "DEAL-119 — ₦600,000",
    at: ago(18),
    ip: "41.58.•••.74",
    severity: "info",
  },
  {
    id: "aud_004",
    actor: "ops@fleetlink",
    action: "Refunded transaction",
    target: "FLK-REF-2025-0410-007",
    at: ago(24 * 8),
    ip: "41.58.•••.74",
    severity: "warn",
  },
  {
    id: "aud_005",
    actor: "system",
    action: "Auto-flagged login",
    target: "Host #A2C9 — new device, foreign IP",
    at: ago(36),
    ip: "185.220.•••.4",
    severity: "critical",
  },
];

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann_001",
    title: "Scheduled maintenance — Sun 02:00",
    body: "Brief downtime for payment gateway upgrade. ~15 min window.",
    audience: "all",
    scheduledFor: ago(-24),
    status: "scheduled",
  },
  {
    id: "ann_002",
    title: "New payout schedule for hosts",
    body: "Payouts now process Mon, Wed, Fri at 10:00 WAT.",
    audience: "hosts",
    scheduledFor: ago(48),
    status: "sent",
    reach: 1240,
  },
  {
    id: "ann_003",
    title: "Q2 procurement guide",
    body: "New corporate playbook for fleet sourcing — open in app.",
    audience: "corporates",
    scheduledFor: ago(120),
    status: "sent",
    reach: 388,
  },
];

// ─── Public API ─────────────────────────────────────────────────────────────
export function listAdminUsers(role?: AdminRole): AdminUser[] {
  return role ? USERS.filter((u) => u.role === role) : [...USERS];
}

export function getAdminUser(id: string): AdminUser | undefined {
  return USERS.find((u) => u.id === id);
}

export function listKycQueue(): KycQueueItem[] {
  return [...KYC_QUEUE].sort(
    (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
  );
}

export function listAdminDisputes(): AdminDispute[] {
  return [...ADMIN_DISPUTES];
}

export function listModeration(): ModerationItem[] {
  return [...MOD_QUEUE];
}

export function listPayoutApprovals(): AdminPayout[] {
  return [...PAYOUT_APPROVALS];
}

export function listAdminTxns(): AdminTxn[] {
  return [...TXNS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function listAuditLog(): AuditEntry[] {
  return [...AUDIT].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export function listAnnouncements(): Announcement[] {
  return [...ANNOUNCEMENTS];
}

export function adminMetrics() {
  const activeUsers = USERS.filter((u) => u.status === "active").length;
  const pendingKyc = KYC_QUEUE.length;
  const openDisputes = ADMIN_DISPUTES.filter((d) => d.status !== "resolved").length;
  const pendingPayouts = PAYOUT_APPROVALS.filter((p) => p.status === "awaiting_approval").length;
  const pendingMod = MOD_QUEUE.filter((m) => m.status === "pending").length;
  const grossVolume = TXNS.filter((t) => t.kind === "escrow_funding" && t.status === "successful")
    .reduce((s, t) => s + t.amount, 0);
  const platformRevenue = TXNS.reduce((s, t) => s + (t.fee ?? 0), 0);
  const escrowHeld = 34_500_000;
  return {
    activeUsers,
    totalUsers: USERS.length,
    hostsCount: USERS.filter((u) => u.role === "hosts").length,
    corporatesCount: USERS.filter((u) => u.role === "corporates").length,
    pendingKyc,
    openDisputes,
    pendingPayouts,
    pendingMod,
    grossVolume,
    platformRevenue,
    escrowHeld,
    flaggedUsers: USERS.filter((u) => u.flagged).length,
  };
}

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
  banned: "Banned",
};

export const KYC_QUEUE_LABEL: Record<KycQueueStatus, string> = {
  in_review: "In review",
  needs_info: "Needs info",
  auto_flagged: "Flagged",
};

export const DISPUTE_LABEL: Record<AdminDisputeStatus, string> = {
  open: "Open",
  under_review: "Under review",
  needs_admin: "Needs admin",
  resolved: "Resolved",
};

export const PAYOUT_LABEL: Record<AdminPayoutStatus, string> = {
  awaiting_approval: "Awaiting approval",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
};
