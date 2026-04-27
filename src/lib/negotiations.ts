// Mock negotiation data for Phase 3.
// Threaded offer/counter history per request, with status indicators.

import { getRequestById, type CorporateRequest } from "@/lib/mock-data";

export type OfferStatus = "pending" | "accepted" | "rejected" | "countered" | "withdrawn";
export type Party = "host" | "corporate";

export type TimelineEntry = {
  id: string;
  party: Party;
  hostHandle: string; // anonymous label e.g. "Host #A2C9"
  vehicleLabel: string;
  price: number;
  period: "week" | "month";
  notes?: string;
  createdAt: string; // ISO
  status: OfferStatus;
  isCounter?: boolean;
};

export type Negotiation = {
  id: string;
  requestId: string;
  hostHandle: string;
  status: OfferStatus; // overall thread status
  unread: boolean;
  lastActivityAt: string;
  timeline: TimelineEntry[];
};

const NOW = new Date("2025-04-18T10:00:00Z").getTime();
const ago = (m: number) => new Date(NOW - m * 60_000).toISOString();

// Seed negotiations against existing mock requests.
const SEED: Negotiation[] = [
  {
    id: "neg_001",
    requestId: "req_001",
    hostHandle: "Host #A2C9",
    status: "pending",
    unread: true,
    lastActivityAt: ago(8),
    timeline: [
      {
        id: "t_1",
        party: "host",
        hostHandle: "Host #A2C9",
        vehicleLabel: "Mercedes Sprinter 2021 — Silver",
        price: 430_000,
        period: "week",
        notes: "Available immediately. Driver included with 6 yrs route experience.",
        createdAt: ago(180),
        status: "countered",
      },
      {
        id: "t_2",
        party: "corporate",
        hostHandle: "Host #A2C9",
        vehicleLabel: "Mercedes Sprinter 2021 — Silver",
        price: 400_000,
        period: "week",
        notes: "Can you match ₦400k/week? We have 6 routes and prefer longer commitment.",
        createdAt: ago(45),
        status: "pending",
        isCounter: true,
      },
    ],
  },
  {
    id: "neg_002",
    requestId: "req_002",
    hostHandle: "Host #B7F1",
    status: "accepted",
    unread: false,
    lastActivityAt: ago(60 * 6),
    timeline: [
      {
        id: "t_3",
        party: "host",
        hostHandle: "Host #B7F1",
        vehicleLabel: "Honda Accord 2023 — Black",
        price: 1_200_000,
        period: "month",
        notes: "Telematics already installed. Service records on file.",
        createdAt: ago(60 * 30),
        status: "accepted",
      },
      {
        id: "t_4",
        party: "corporate",
        hostHandle: "Host #B7F1",
        vehicleLabel: "Honda Accord 2023 — Black",
        price: 1_200_000,
        period: "month",
        notes: "Accepted. Proceeding to escrow funding.",
        createdAt: ago(60 * 6),
        status: "accepted",
      },
    ],
  },
  {
    id: "neg_003",
    requestId: "req_004",
    hostHandle: "Host #D331",
    status: "rejected",
    unread: false,
    lastActivityAt: ago(60 * 20),
    timeline: [
      {
        id: "t_5",
        party: "host",
        hostHandle: "Host #D331",
        vehicleLabel: "Toyota Prado 2020 — White",
        price: 1_100_000,
        period: "week",
        createdAt: ago(60 * 24),
        status: "rejected",
      },
      {
        id: "t_6",
        party: "corporate",
        hostHandle: "Host #D331",
        vehicleLabel: "Toyota Prado 2020 — White",
        price: 0,
        period: "week",
        notes: "Outside our budget range — declining for now.",
        createdAt: ago(60 * 20),
        status: "rejected",
      },
    ],
  },
  {
    id: "neg_004",
    requestId: "req_003",
    hostHandle: "Host #E558",
    status: "pending",
    unread: true,
    lastActivityAt: ago(60 * 2),
    timeline: [
      {
        id: "t_7",
        party: "host",
        hostHandle: "Host #E558",
        vehicleLabel: "Ford Ranger 2022 — Blue",
        price: 580_000,
        period: "week",
        notes: "4x4 in great condition. Can deliver to PH on Monday.",
        createdAt: ago(60 * 2),
        status: "pending",
      },
    ],
  },
];

const store: Negotiation[] = [...SEED];

export function listNegotiations(role?: "corporate" | "host" | "admin"): Negotiation[] {
  const filtered =
    role === "host"
      ? // Hosts only see threads they initiated (their offers).
        store.filter((n) => n.timeline[0]?.party === "host")
      : role === "corporate"
        ? // Corporates only see threads on their requests.
          store.filter((n) => n.timeline.some((t) => t.party === "corporate"))
        : store;
  return [...filtered].sort(
    (a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime(),
  );
}

export function getNegotiationById(id: string): Negotiation | undefined {
  return store.find((n) => n.id === id);
}

export function getNegotiationsForRequest(requestId: string): Negotiation[] {
  return store.filter((n) => n.requestId === requestId);
}

export function getRequestForNegotiation(neg: Negotiation): CorporateRequest | undefined {
  return getRequestById(neg.requestId);
}

// Mutation helpers used by the timeline UI (optimistic, in-memory).
export function appendCounter(
  negotiationId: string,
  entry: Omit<TimelineEntry, "id" | "createdAt" | "status">,
): Negotiation | undefined {
  const neg = store.find((n) => n.id === negotiationId);
  if (!neg) return undefined;
  const t: TimelineEntry = {
    ...entry,
    id: `t_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    isCounter: true,
  };
  // Mark previous entry as countered.
  const last = neg.timeline[neg.timeline.length - 1];
  if (last) last.status = "countered";
  neg.timeline.push(t);
  neg.status = "pending";
  neg.lastActivityAt = t.createdAt;
  neg.unread = true;
  return neg;
}

export function setNegotiationStatus(
  negotiationId: string,
  status: OfferStatus,
): Negotiation | undefined {
  const neg = store.find((n) => n.id === negotiationId);
  if (!neg) return undefined;
  neg.status = status;
  const last = neg.timeline[neg.timeline.length - 1];
  if (last) last.status = status;
  neg.lastActivityAt = new Date().toISOString();
  neg.unread = false;
  return neg;
}

export function markRead(negotiationId: string): void {
  const neg = store.find((n) => n.id === negotiationId);
  if (neg) neg.unread = false;
}

export function unreadCount(role?: "corporate" | "host" | "admin"): number {
  return listNegotiations(role).filter((n) => n.unread).length;
}
