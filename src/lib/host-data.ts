// Mock data for the Host Dashboard (Phase 5).
// My vehicles, active offers I've sent, requests I'm engaged with, and earnings.

export type VehicleStatus = "available" | "rented" | "maintenance" | "draft";

export type Vehicle = {
  id: string;
  label: string; // e.g. "Mercedes Sprinter 2021"
  type: string; // e.g. "Cargo Van"
  plate: string; // masked
  year: number;
  color: string;
  telematics: boolean;
  hasDriver: boolean;
  status: VehicleStatus;
  imageHue: number;
  basePrice: number;
  period: "week" | "month";
  rating: number;
  rentalsCompleted: number;
  utilizationPct: number; // 0-100
  nextAvailable?: string; // ISO when rented
};

export type HostOfferStatus = "pending" | "countered" | "accepted" | "rejected" | "withdrawn";

export type HostOffer = {
  id: string;
  requestTitle: string;
  corporateHandle: string;
  corporateHue: number;
  vehicleLabel: string;
  myPrice: number;
  theirBudget: number;
  period: "week" | "month";
  durationWeeks: number;
  location: string;
  sentAt: string;
  lastActivityAt: string;
  status: HostOfferStatus;
  unreadMessages: number;
  competingOffers: number;
};

export type EngagedRequest = {
  id: string;
  title: string;
  vehicleType: string;
  quantity: number;
  budget: number;
  period: "week" | "month";
  durationWeeks: number;
  location: string;
  postedAt: string;
  myStatus: "viewing" | "offered" | "shortlisted" | "selected";
  totalOffers: number;
  hue: number;
};

export type EarningEntry = {
  id: string;
  date: string; // ISO
  corporateHandle: string;
  vehicleLabel: string;
  amount: number;
  type: "rental" | "bonus" | "payout";
  status: "pending" | "in_escrow" | "released" | "paid_out";
};

const NOW = new Date("2025-04-18T10:00:00Z").getTime();
const ago = (h: number) => new Date(NOW - h * 3_600_000).toISOString();
const inDays = (d: number) => new Date(NOW + d * 86_400_000).toISOString();

const VEHICLES: Vehicle[] = [
  {
    id: "veh_001",
    label: "Mercedes Sprinter",
    type: "Cargo Van",
    plate: "LSD-•••-21",
    year: 2021,
    color: "Silver",
    telematics: true,
    hasDriver: true,
    status: "rented",
    imageHue: 210,
    basePrice: 430_000,
    period: "week",
    rating: 4.9,
    rentalsCompleted: 18,
    utilizationPct: 87,
    nextAvailable: inDays(14),
  },
  {
    id: "veh_002",
    label: "Toyota Hilux",
    type: "Pickup Truck (4x4)",
    plate: "ABJ-•••-08",
    year: 2022,
    color: "White",
    telematics: true,
    hasDriver: false,
    status: "available",
    imageHue: 30,
    basePrice: 580_000,
    period: "week",
    rating: 4.8,
    rentalsCompleted: 12,
    utilizationPct: 64,
  },
  {
    id: "veh_003",
    label: "Honda Accord",
    type: "Executive Sedan",
    plate: "LSD-•••-77",
    year: 2023,
    color: "Black",
    telematics: true,
    hasDriver: true,
    status: "available",
    imageHue: 250,
    basePrice: 1_180_000,
    period: "month",
    rating: 4.95,
    rentalsCompleted: 9,
    utilizationPct: 72,
  },
  {
    id: "veh_004",
    label: "Ford Transit",
    type: "Crew Van (12-seater)",
    plate: "PHC-•••-44",
    year: 2020,
    color: "White",
    telematics: false,
    hasDriver: true,
    status: "maintenance",
    imageHue: 140,
    basePrice: 350_000,
    period: "week",
    rating: 4.6,
    rentalsCompleted: 22,
    utilizationPct: 45,
  },
  {
    id: "veh_005",
    label: "Hyundai H100",
    type: "Cargo Van",
    plate: "LSD-•••-12",
    year: 2019,
    color: "White",
    telematics: false,
    hasDriver: false,
    status: "draft",
    imageHue: 280,
    basePrice: 280_000,
    period: "week",
    rating: 0,
    rentalsCompleted: 0,
    utilizationPct: 0,
  },
];

const HOST_OFFERS: HostOffer[] = [
  {
    id: "hoff_001",
    requestTitle: "Last-mile delivery fleet",
    corporateHandle: "Logistics Co. #4821",
    corporateHue: 220,
    vehicleLabel: "Mercedes Sprinter ×6",
    myPrice: 430_000,
    theirBudget: 450_000,
    period: "week",
    durationWeeks: 8,
    location: "Lagos — Mainland",
    sentAt: ago(1),
    lastActivityAt: ago(0.4),
    status: "pending",
    unreadMessages: 2,
    competingOffers: 11,
  },
  {
    id: "hoff_002",
    requestTitle: "Executive transport contract",
    corporateHandle: "FinTech Group #2210",
    corporateHue: 180,
    vehicleLabel: "Honda Accord 2023",
    myPrice: 1_180_000,
    theirBudget: 1_200_000,
    period: "month",
    durationWeeks: 24,
    location: "Abuja — Central",
    sentAt: ago(5),
    lastActivityAt: ago(2),
    status: "countered",
    unreadMessages: 1,
    competingOffers: 6,
  },
  {
    id: "hoff_003",
    requestTitle: "Site vehicles for project",
    corporateHandle: "Construction Ltd #1145",
    corporateHue: 30,
    vehicleLabel: "Toyota Hilux ×2",
    myPrice: 600_000,
    theirBudget: 600_000,
    period: "week",
    durationWeeks: 12,
    location: "Port Harcourt",
    sentAt: ago(48),
    lastActivityAt: ago(20),
    status: "accepted",
    unreadMessages: 0,
    competingOffers: 8,
  },
  {
    id: "hoff_004",
    requestTitle: "Production crew transport",
    corporateHandle: "Media House #5560",
    corporateHue: 350,
    vehicleLabel: "Ford Transit",
    myPrice: 360_000,
    theirBudget: 350_000,
    period: "week",
    durationWeeks: 3,
    location: "Lagos — Mainland",
    sentAt: ago(72),
    lastActivityAt: ago(60),
    status: "rejected",
    unreadMessages: 0,
    competingOffers: 8,
  },
];

const ENGAGED: EngagedRequest[] = [
  {
    id: "eng_001",
    title: "VIP guest transfers",
    vehicleType: "Luxury SUV",
    quantity: 2,
    budget: 900_000,
    period: "week",
    durationWeeks: 4,
    location: "Lagos — Island",
    postedAt: ago(8),
    myStatus: "viewing",
    totalOffers: 7,
    hue: 320,
  },
  {
    id: "eng_002",
    title: "Cold-chain transport",
    vehicleType: "Refrigerated Truck",
    quantity: 2,
    budget: 800_000,
    period: "week",
    durationWeeks: 6,
    location: "Ibadan",
    postedAt: ago(14),
    myStatus: "viewing",
    totalOffers: 1,
    hue: 140,
  },
  {
    id: "eng_003",
    title: "Field staff transport",
    vehicleType: "Minibus (15-seater)",
    quantity: 3,
    budget: 280_000,
    period: "week",
    durationWeeks: 16,
    location: "Kano",
    postedAt: ago(48),
    myStatus: "shortlisted",
    totalOffers: 6,
    hue: 200,
  },
];

const EARNINGS: EarningEntry[] = [
  {
    id: "earn_001",
    date: ago(2),
    corporateHandle: "Construction Ltd #1145",
    vehicleLabel: "Toyota Hilux ×2 — week 8",
    amount: 600_000,
    type: "rental",
    status: "in_escrow",
  },
  {
    id: "earn_002",
    date: ago(24 * 7),
    corporateHandle: "Construction Ltd #1145",
    vehicleLabel: "Toyota Hilux ×2 — week 7",
    amount: 600_000,
    type: "rental",
    status: "released",
  },
  {
    id: "earn_003",
    date: ago(24 * 8),
    corporateHandle: "FleetLink",
    vehicleLabel: "On-time host bonus",
    amount: 25_000,
    type: "bonus",
    status: "released",
  },
  {
    id: "earn_004",
    date: ago(24 * 14),
    corporateHandle: "Construction Ltd #1145",
    vehicleLabel: "Toyota Hilux ×2 — week 6",
    amount: 600_000,
    type: "rental",
    status: "paid_out",
  },
  {
    id: "earn_005",
    date: ago(24 * 21),
    corporateHandle: "Hospitality Brand #7733",
    vehicleLabel: "Mercedes Sprinter — final",
    amount: 430_000,
    type: "rental",
    status: "paid_out",
  },
  {
    id: "earn_006",
    date: ago(24 * 21),
    corporateHandle: "Bank transfer",
    vehicleLabel: "GTBank •••• 4421",
    amount: -1_055_000,
    type: "payout",
    status: "paid_out",
  },
];

export function listVehicles(): Vehicle[] {
  return [...VEHICLES];
}

export function listHostOffers(): HostOffer[] {
  return [...HOST_OFFERS].sort(
    (a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime(),
  );
}

export function listEngagedRequests(): EngagedRequest[] {
  return [...ENGAGED];
}

export function listEarnings(): EarningEntry[] {
  return [...EARNINGS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function hostMetrics() {
  const offers = HOST_OFFERS;
  const earnings = EARNINGS;
  const lifetime = earnings
    .filter((e) => e.type !== "payout" && (e.status === "released" || e.status === "paid_out"))
    .reduce((s, e) => s + e.amount, 0);
  const inEscrow = earnings
    .filter((e) => e.status === "in_escrow")
    .reduce((s, e) => s + e.amount, 0);
  const availableBalance = earnings
    .filter((e) => e.status === "released")
    .reduce((s, e) => s + e.amount, 0);
  return {
    activeVehicles: VEHICLES.filter((v) => v.status !== "draft").length,
    rentedNow: VEHICLES.filter((v) => v.status === "rented").length,
    pendingOffers: offers.filter((o) => o.status === "pending" || o.status === "countered").length,
    acceptedOffers: offers.filter((o) => o.status === "accepted").length,
    lifetimeEarnings: lifetime,
    inEscrow,
    availableBalance,
    avgRating:
      VEHICLES.filter((v) => v.rentalsCompleted > 0).reduce((s, v) => s + v.rating, 0) /
      Math.max(1, VEHICLES.filter((v) => v.rentalsCompleted > 0).length),
  };
}

export const VEHICLE_STATUS_LABEL: Record<VehicleStatus, string> = {
  available: "Available",
  rented: "Rented out",
  maintenance: "In maintenance",
  draft: "Draft",
};

export const OFFER_STATUS_LABEL: Record<HostOfferStatus, string> = {
  pending: "Pending",
  countered: "Counter offer",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const EARNING_STATUS_LABEL: Record<EarningEntry["status"], string> = {
  pending: "Pending",
  in_escrow: "In escrow",
  released: "Released",
  paid_out: "Paid out",
};
