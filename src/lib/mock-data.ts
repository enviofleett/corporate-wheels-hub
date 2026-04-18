// Mock data for the social feed (Phase 2). Replace with real API data later.

export type VerificationLevel = "verified" | "premium" | "new";

export type CorporateRequest = {
  id: string;
  company: {
    handle: string; // anonymous handle (no real name shown)
    industry: string;
    avatarHue: number; // for generated avatar gradient
    verification: VerificationLevel;
    rating: number;
    requestsPosted: number;
  };
  vehicle: {
    type: string; // e.g. "SUV", "Pickup truck"
    quantity: number;
  };
  budget: {
    amount: number; // NGN
    period: "week" | "month";
  };
  durationWeeks: number;
  location: string; // general area
  postedAt: string; // ISO string
  description: string;
  imageUrl?: string;
  offersCount: number;
  needsDriver: boolean;
};

const NOW = new Date("2025-04-18T10:00:00Z").getTime();

const minutes = (m: number) => new Date(NOW - m * 60_000).toISOString();
const hours = (h: number) => new Date(NOW - h * 3_600_000).toISOString();
const days = (d: number) => new Date(NOW - d * 86_400_000).toISOString();

const POOL: CorporateRequest[] = [
  {
    id: "req_001",
    company: {
      handle: "Logistics Co. #4821",
      industry: "Logistics & Supply Chain",
      avatarHue: 220,
      verification: "verified",
      rating: 4.8,
      requestsPosted: 24,
    },
    vehicle: { type: "Cargo Van", quantity: 6 },
    budget: { amount: 450_000, period: "week" },
    durationWeeks: 8,
    location: "Lagos — Mainland",
    postedAt: minutes(12),
    description:
      "Need cargo vans for last-mile delivery routes across Lagos Mainland. Daily mileage ~120km. Drivers preferred.",
    offersCount: 3,
    needsDriver: true,
  },
  {
    id: "req_002",
    company: {
      handle: "FinTech Group #2210",
      industry: "Financial Services",
      avatarHue: 180,
      verification: "premium",
      rating: 4.9,
      requestsPosted: 51,
    },
    vehicle: { type: "Executive Sedan", quantity: 3 },
    budget: { amount: 1_200_000, period: "month" },
    durationWeeks: 24,
    location: "Abuja — Central",
    postedAt: hours(2),
    description:
      "Long-term executive transport contract. Late-model Camry / Accord / similar. Telematics required.",
    offersCount: 12,
    needsDriver: true,
  },
  {
    id: "req_003",
    company: {
      handle: "Construction Ltd #1145",
      industry: "Construction",
      avatarHue: 30,
      verification: "verified",
      rating: 4.6,
      requestsPosted: 8,
    },
    vehicle: { type: "Pickup Truck (4x4)", quantity: 4 },
    budget: { amount: 600_000, period: "week" },
    durationWeeks: 12,
    location: "Port Harcourt",
    postedAt: hours(5),
    description:
      "Site vehicles for ongoing project. Hilux / Ranger preferred. Heavy off-road use expected.",
    offersCount: 5,
    needsDriver: false,
  },
  {
    id: "req_004",
    company: {
      handle: "Hospitality Brand #7733",
      industry: "Hospitality",
      avatarHue: 320,
      verification: "verified",
      rating: 4.7,
      requestsPosted: 17,
    },
    vehicle: { type: "Luxury SUV", quantity: 2 },
    budget: { amount: 900_000, period: "week" },
    durationWeeks: 4,
    location: "Lagos — Island",
    postedAt: hours(8),
    description:
      "VIP guest transfers for an inbound conference. Prado / Highlander / GLE. Chauffeur uniform required.",
    offersCount: 7,
    needsDriver: true,
  },
  {
    id: "req_005",
    company: {
      handle: "AgroTech #3398",
      industry: "Agriculture",
      avatarHue: 140,
      verification: "new",
      rating: 0,
      requestsPosted: 1,
    },
    vehicle: { type: "Refrigerated Truck", quantity: 2 },
    budget: { amount: 800_000, period: "week" },
    durationWeeks: 6,
    location: "Ibadan",
    postedAt: hours(14),
    description:
      "Cold-chain transport for produce. Need working refrigeration unit and driver familiar with the route.",
    offersCount: 1,
    needsDriver: true,
  },
  {
    id: "req_006",
    company: {
      handle: "Energy Corp #0091",
      industry: "Oil & Gas",
      avatarHue: 260,
      verification: "premium",
      rating: 4.95,
      requestsPosted: 88,
    },
    vehicle: { type: "Armored SUV", quantity: 1 },
    budget: { amount: 2_500_000, period: "month" },
    durationWeeks: 52,
    location: "Lagos — Island",
    postedAt: days(1),
    description:
      "Long-term armored vehicle for executive use. B6 minimum. Verified hosts only — escrow mandatory.",
    offersCount: 4,
    needsDriver: false,
  },
  {
    id: "req_007",
    company: {
      handle: "Media House #5560",
      industry: "Media & Entertainment",
      avatarHue: 350,
      verification: "verified",
      rating: 4.5,
      requestsPosted: 6,
    },
    vehicle: { type: "Crew Van (12-seater)", quantity: 2 },
    budget: { amount: 350_000, period: "week" },
    durationWeeks: 3,
    location: "Lagos — Mainland",
    postedAt: days(1),
    description:
      "Production crew + equipment transport. Need clean cargo area and AC. Short-term shoot.",
    offersCount: 9,
    needsDriver: false,
  },
  {
    id: "req_008",
    company: {
      handle: "Health NGO #1207",
      industry: "Healthcare",
      avatarHue: 200,
      verification: "verified",
      rating: 4.8,
      requestsPosted: 14,
    },
    vehicle: { type: "Minibus (15-seater)", quantity: 3 },
    budget: { amount: 280_000, period: "week" },
    durationWeeks: 16,
    location: "Kano",
    postedAt: days(2),
    description:
      "Field staff transport for a vaccination campaign. Reliability and fuel efficiency are top priority.",
    offersCount: 6,
    needsDriver: true,
  },
];

// Simulated paginated fetch.
export function fetchFeedPage(
  page: number,
  pageSize = 4,
): Promise<{ items: CorporateRequest[]; hasMore: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = page * pageSize;
      const slice = POOL.slice(start, start + pageSize);
      // Loop the pool to simulate "infinite" scroll for the demo.
      let items = slice;
      if (slice.length === 0) {
        const loopStart = (page * pageSize) % POOL.length;
        items = POOL.slice(loopStart, loopStart + pageSize).map((r, idx) => ({
          ...r,
          id: `${r.id}_p${page}_${idx}`,
        }));
      }
      // Stop after 4 pages to demo an "end of feed" state.
      const hasMore = page < 3;
      resolve({ items, hasMore });
    }, 700);
  });
}

export function getRequestById(id: string): CorporateRequest | undefined {
  // Strip any pagination suffix for lookup.
  const baseId = id.split("_p")[0];
  return POOL.find((r) => r.id === baseId || r.id === id);
}
