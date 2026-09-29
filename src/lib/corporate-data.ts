// Mock data for the Corporate Dashboard (Phase 4).
// Active requests posted by the (signed-in) corporate, incoming offers per request,
// selected deals, and mock payment statuses.

export type PaymentStatus = "awaiting_funding" | "funded" | "in_escrow" | "released" | "failed";

export type RequestStatus = "live" | "negotiating" | "filled" | "closed" | "draft";

export type CorpRequestSummary = {
  id: string;
  title: string;
  vehicleType: string;
  quantity: number;
  budget: number;
  period: "week" | "month";
  durationWeeks: number;
  location: string;
  postedAt: string;
  status: RequestStatus;
  offersCount: number;
  newOffersCount: number;
  views: number;
  imageHue: number;
};

export type IncomingOffer = {
  id: string;
  requestId: string;
  hostHandle: string; // anonymous
  hostHue: number;
  hostRating: number;
  completedRentals: number;
  responseTimeMins: number;
  vehicle: {
    label: string;
    year: number;
    color: string;
    telematics: boolean;
    imageHue: number;
  };
  price: number;
  period: "week" | "month";
  notes?: string;
  driverIncluded: boolean;
  receivedAt: string;
  status: "new" | "shortlisted" | "rejected";
};

export type SelectedDeal = {
  id: string;
  requestId: string;
  hostHandle: string;
  hostHue: number;
  vehicleLabel: string;
  price: number;
  period: "week" | "month";
  durationWeeks: number;
  startDate: string; // ISO
  payment: PaymentStatus;
  telematics: "active" | "pending";
};

const NOW = new Date("2025-04-18T10:00:00Z").getTime();
const ago = (h: number) => new Date(NOW - h * 3_600_000).toISOString();
const inDays = (d: number) => new Date(NOW + d * 86_400_000).toISOString();

const REQUESTS: CorpRequestSummary[] = [
  {
    id: "creq_001",
    title: "Last-mile delivery fleet",
    vehicleType: "Cargo Van",
    quantity: 6,
    budget: 450_000,
    period: "week",
    durationWeeks: 8,
    location: "Lagos — Mainland",
    postedAt: ago(3),
    status: "negotiating",
    offersCount: 12,
    newOffersCount: 4,
    views: 248,
    imageHue: 220,
  },
  {
    id: "creq_002",
    title: "Executive transport",
    vehicleType: "Executive Sedan",
    quantity: 3,
    budget: 1_200_000,
    period: "month",
    durationWeeks: 24,
    location: "Abuja — Central",
    postedAt: ago(20),
    status: "live",
    offersCount: 7,
    newOffersCount: 2,
    views: 156,
    imageHue: 180,
  },
  {
    id: "creq_003",
    title: "Site vehicles (4x4)",
    vehicleType: "Pickup Truck",
    quantity: 4,
    budget: 600_000,
    period: "week",
    durationWeeks: 12,
    location: "Port Harcourt",
    postedAt: ago(48),
    status: "filled",
    offersCount: 9,
    newOffersCount: 0,
    views: 312,
    imageHue: 30,
  },
  {
    id: "creq_004",
    title: "Conference VIP transfers",
    vehicleType: "Luxury SUV",
    quantity: 2,
    budget: 900_000,
    period: "week",
    durationWeeks: 4,
    location: "Lagos — Island",
    postedAt: ago(6),
    status: "draft",
    offersCount: 0,
    newOffersCount: 0,
    views: 0,
    imageHue: 320,
  },
];

const OFFERS: IncomingOffer[] = [
  // creq_001 — last-mile delivery
  {
    id: "off_001",
    requestId: "creq_001",
    hostHandle: "Host #A2C9",
    hostHue: 210,
    hostRating: 4.9,
    completedRentals: 34,
    responseTimeMins: 12,
    vehicle: {
      label: "Mercedes Sprinter",
      year: 2021,
      color: "Silver",
      telematics: true,
      imageHue: 210,
    },
    price: 430_000,
    period: "week",
    notes: "6 vans available immediately. All have telematics + dashcams.",
    driverIncluded: true,
    receivedAt: ago(1),
    status: "shortlisted",
  },
  {
    id: "off_002",
    requestId: "creq_001",
    hostHandle: "Host #M11B",
    hostHue: 140,
    hostRating: 4.7,
    completedRentals: 18,
    responseTimeMins: 45,
    vehicle: {
      label: "Ford Transit",
      year: 2020,
      color: "White",
      telematics: true,
      imageHue: 140,
    },
    price: 410_000,
    period: "week",
    notes: "Can scale up to 8 vehicles within 48 hours.",
    driverIncluded: true,
    receivedAt: ago(2),
    status: "new",
  },
  {
    id: "off_003",
    requestId: "creq_001",
    hostHandle: "Host #K0Z2",
    hostHue: 280,
    hostRating: 4.5,
    completedRentals: 9,
    responseTimeMins: 130,
    vehicle: {
      label: "Hyundai H100",
      year: 2019,
      color: "White",
      telematics: false,
      imageHue: 280,
    },
    price: 380_000,
    period: "week",
    notes: "Lower price, no telematics yet — happy to add at your cost.",
    driverIncluded: false,
    receivedAt: ago(4),
    status: "new",
  },
  {
    id: "off_004",
    requestId: "creq_001",
    hostHandle: "Host #P881",
    hostHue: 30,
    hostRating: 4.95,
    completedRentals: 71,
    responseTimeMins: 8,
    vehicle: {
      label: "Mercedes Sprinter",
      year: 2023,
      color: "White",
      telematics: true,
      imageHue: 30,
    },
    price: 470_000,
    period: "week",
    notes: "Newest fleet on the platform. Premium service guarantee.",
    driverIncluded: true,
    receivedAt: ago(0.5),
    status: "new",
  },
  // creq_002 — executive
  {
    id: "off_005",
    requestId: "creq_002",
    hostHandle: "Host #B7F1",
    hostHue: 250,
    hostRating: 4.9,
    completedRentals: 41,
    responseTimeMins: 22,
    vehicle: {
      label: "Honda Accord",
      year: 2023,
      color: "Black",
      telematics: true,
      imageHue: 250,
    },
    price: 1_180_000,
    period: "month",
    notes: "Telematics already installed. Service records on file.",
    driverIncluded: true,
    receivedAt: ago(5),
    status: "shortlisted",
  },
  {
    id: "off_006",
    requestId: "creq_002",
    hostHandle: "Host #Q553",
    hostHue: 350,
    hostRating: 4.6,
    completedRentals: 22,
    responseTimeMins: 70,
    vehicle: {
      label: "Toyota Camry",
      year: 2022,
      color: "Pearl",
      telematics: true,
      imageHue: 350,
    },
    price: 1_250_000,
    period: "month",
    driverIncluded: true,
    receivedAt: ago(8),
    status: "new",
  },
];

const DEALS: SelectedDeal[] = [
  {
    id: "deal_001",
    requestId: "creq_003",
    hostHandle: "Host #E558",
    hostHue: 30,
    vehicleLabel: "Ford Ranger 2022 — Blue ×4",
    price: 580_000,
    period: "week",
    durationWeeks: 12,
    startDate: inDays(2),
    payment: "in_escrow",
    telematics: "active",
  },
  {
    id: "deal_002",
    requestId: "creq_002",
    hostHandle: "Host #B7F1",
    hostHue: 250,
    vehicleLabel: "Honda Accord 2023 — Black",
    price: 1_180_000,
    period: "month",
    durationWeeks: 24,
    startDate: inDays(5),
    payment: "awaiting_funding",
    telematics: "pending",
  },
];

export function listCorpRequests(): CorpRequestSummary[] {
  return [...REQUESTS].sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
  );
}

export function getCorpRequest(id: string): CorpRequestSummary | undefined {
  return REQUESTS.find((r) => r.id === id);
}

export function listIncomingOffers(): IncomingOffer[] {
  return [...OFFERS].sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
  );
}

export function listOffersForRequest(requestId: string): IncomingOffer[] {
  return OFFERS.filter((o) => o.requestId === requestId);
}

export function listSelectedDeals(): SelectedDeal[] {
  return [...DEALS];
}

export function corporateMetrics() {
  return {
    activeRequests: REQUESTS.filter((r) => r.status === "live" || r.status === "negotiating")
      .length,
    newOffers: OFFERS.filter((o) => o.status === "new").length,
    activeDeals: DEALS.length,
    inEscrow: DEALS.filter((d) => d.payment === "in_escrow").reduce((sum, d) => sum + d.price, 0),
  };
}

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  awaiting_funding: "Awaiting funding",
  funded: "Funded",
  in_escrow: "Held in escrow",
  released: "Released",
  failed: "Failed",
};

export const REQUEST_LABEL: Record<RequestStatus, string> = {
  live: "Live",
  negotiating: "Negotiating",
  filled: "Filled",
  closed: "Closed",
  draft: "Draft",
};
