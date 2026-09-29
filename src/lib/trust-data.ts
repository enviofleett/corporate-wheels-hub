// Mock data for the Trust & Safety surface (Phase 6).
// KYC steps, disputes, and reviewable completed deals.

export type KycStepStatus = "complete" | "in_review" | "pending" | "rejected";

export type KycStep = {
  id: string;
  title: string;
  description: string;
  status: KycStepStatus;
  required: boolean;
  updatedAt?: string;
  rejectionReason?: string;
};

export type KycProfile = {
  level: "new" | "verified" | "premium";
  trustScore: number; // 0-100
  steps: KycStep[];
};

export type DisputeStatus = "open" | "under_review" | "resolved" | "rejected";
export type DisputeReason =
  | "vehicle_condition"
  | "late_delivery"
  | "no_show"
  | "payment"
  | "behavior"
  | "other";

export type Dispute = {
  id: string;
  dealId: string;
  vehicleLabel: string;
  counterparty: string;
  counterpartyHue: number;
  reason: DisputeReason;
  summary: string;
  status: DisputeStatus;
  createdAt: string;
  lastUpdateAt: string;
  evidenceCount: number;
  unread: number;
  amountInDispute: number;
};

export type ReviewableDeal = {
  id: string;
  vehicleLabel: string;
  counterparty: string;
  counterpartyHue: number;
  completedAt: string;
  durationWeeks: number;
  amount: number;
  reviewed: boolean;
};

export const REASON_LABELS: Record<DisputeReason, string> = {
  vehicle_condition: "Vehicle condition",
  late_delivery: "Late delivery / pickup",
  no_show: "No-show",
  payment: "Payment issue",
  behavior: "Behavior / conduct",
  other: "Other",
};

export function getKycProfile(): KycProfile {
  const steps: KycStep[] = [
    {
      id: "email",
      title: "Email address",
      description: "Verified via confirmation link.",
      status: "complete",
      required: true,
      updatedAt: "2025-03-02T10:00:00Z",
    },
    {
      id: "phone",
      title: "Phone number",
      description: "OTP confirmed.",
      status: "complete",
      required: true,
      updatedAt: "2025-03-02T10:05:00Z",
    },
    {
      id: "id",
      title: "Government ID",
      description: "NIN or international passport.",
      status: "complete",
      required: true,
      updatedAt: "2025-03-04T14:00:00Z",
    },
    {
      id: "business",
      title: "Driver profile",
      description: "Driver details and emergency contact.",
      status: "in_review",
      required: true,
      updatedAt: "2025-04-15T09:30:00Z",
    },
    {
      id: "address",
      title: "Vehicle verification",
      description: "Vehicle plate and ownership details.",
      status: "pending",
      required: true,
    },
    {
      id: "bank",
      title: "Contribution payout account",
      description: "Optional for organizations that allow ride contributions.",
      status: "rejected",
      required: false,
      updatedAt: "2025-04-10T08:00:00Z",
      rejectionReason: "Account name needs to match the verified member profile.",
    },
  ];

  const completed = steps.filter((s) => s.status === "complete").length;
  const trustScore = Math.round((completed / steps.length) * 100);
  const level: KycProfile["level"] =
    trustScore >= 90 ? "premium" : trustScore >= 50 ? "verified" : "new";

  return { level, trustScore, steps };
}

export function listDisputes(): Dispute[] {
  return [
    {
      id: "DSP-2041",
      dealId: "DEAL-119",
      vehicleLabel: "Mercedes Sprinter 2021",
      counterparty: "Quiet Harbor Logistics",
      counterpartyHue: 12,
      reason: "vehicle_condition",
      summary: "Two tyres returned worn beyond fair use; awaiting inspection report.",
      status: "under_review",
      createdAt: "2025-04-12T09:20:00Z",
      lastUpdateAt: "2025-04-17T15:00:00Z",
      evidenceCount: 6,
      unread: 2,
      amountInDispute: 145000,
    },
    {
      id: "DSP-2032",
      dealId: "DEAL-104",
      vehicleLabel: "Toyota Hilux 2020",
      counterparty: "Bright Anchor FMCG",
      counterpartyHue: 196,
      reason: "late_delivery",
      summary: "Vehicle delivered 4 days after agreed start date.",
      status: "open",
      createdAt: "2025-04-16T08:00:00Z",
      lastUpdateAt: "2025-04-16T08:00:00Z",
      evidenceCount: 2,
      unread: 0,
      amountInDispute: 80000,
    },
    {
      id: "DSP-1987",
      dealId: "DEAL-077",
      vehicleLabel: "Ford Transit 2019",
      counterparty: "Cobalt Field Services",
      counterpartyHue: 240,
      reason: "payment",
      summary: "Resolved in host's favour. Escrow released in full.",
      status: "resolved",
      createdAt: "2025-03-22T11:00:00Z",
      lastUpdateAt: "2025-03-30T17:00:00Z",
      evidenceCount: 4,
      unread: 0,
      amountInDispute: 220000,
    },
  ];
}

export function listReviewableDeals(): ReviewableDeal[] {
  return [
    {
      id: "DEAL-128",
      vehicleLabel: "Toyota Hiace 2022",
      counterparty: "Stellar Field Ops",
      counterpartyHue: 28,
      completedAt: "2025-04-15T17:00:00Z",
      durationWeeks: 4,
      amount: 720000,
      reviewed: false,
    },
    {
      id: "DEAL-122",
      vehicleLabel: "Mercedes Sprinter 2021",
      counterparty: "Northwind Cargo",
      counterpartyHue: 156,
      completedAt: "2025-04-08T17:00:00Z",
      durationWeeks: 2,
      amount: 480000,
      reviewed: false,
    },
    {
      id: "DEAL-110",
      vehicleLabel: "Ford Transit 2019",
      counterparty: "Bright Anchor FMCG",
      counterpartyHue: 196,
      completedAt: "2025-03-29T17:00:00Z",
      durationWeeks: 8,
      amount: 1240000,
      reviewed: true,
    },
  ];
}

export function getReviewableDeal(id: string): ReviewableDeal | undefined {
  return listReviewableDeals().find((d) => d.id === id);
}

export function getDispute(id: string): Dispute | undefined {
  return listDisputes().find((d) => d.id === id);
}
