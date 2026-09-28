import { useSyncExternalStore } from "react";
export type RideStatus = "open" | "full" | "boarding" | "active" | "completed" | "cancelled";
export type Direction = "outbound" | "return";
export type RequestStatus = "pending" | "accepted" | "declined" | "cancelled" | "waitlisted";
export type Ride = {
  id: string;
  organizationId: string;
  eventId: string;
  from: string;
  to: string;
  time: string;
  date: string;
  driver: string;
  driverId: string;
  vehicle: string;
  seats: number;
  seatsTotal: number;
  contribution: number;
  verified: boolean;
  direction: Direction;
  status: RideStatus;
  meetingPoint?: string;
};
export type SeatRequest = {
  id: string;
  rideId: string;
  passengerId: string;
  name: string;
  area: string;
  status: RequestStatus;
};
export type WaitlistEntry = {
  id: string;
  organizationId: string;
  eventId: string;
  userId: string;
  area: string;
  direction: Direction;
  status: "active" | "matched" | "cancelled";
};
type State = {
  rides: Ride[];
  requests: SeatRequest[];
  waitlist: WaitlistEntry[];
  checkins: Record<string, boolean>;
};
const initial: State = {
  rides: [
    {
      id: "ride-1",
      organizationId: "koinonia-global",
      eventId: "general-assembly-2026",
      from: "Gwarinpa",
      to: "General Assembly",
      time: "7:00 AM",
      date: "Sat, 12 Dec",
      driver: "Emmanuel A.",
      driverId: "current-member",
      vehicle: "Toyota Corolla · Silver",
      seats: 2,
      seatsTotal: 3,
      contribution: 1500,
      verified: true,
      direction: "outbound",
      status: "open",
      meetingPoint: "H-Medix, 3rd Avenue, Gwarinpa",
    },
    {
      id: "ride-2",
      organizationId: "koinonia-global",
      eventId: "general-assembly-2026",
      from: "Wuse 2",
      to: "General Assembly",
      time: "7:20 AM",
      date: "Sat, 12 Dec",
      driver: "Sarah O.",
      driverId: "driver-2",
      vehicle: "Honda Accord · Black",
      seats: 2,
      seatsTotal: 3,
      contribution: 1000,
      verified: true,
      direction: "outbound",
      status: "open",
      meetingPoint: "Banex Plaza, Wuse 2",
    },
    {
      id: "ride-3",
      organizationId: "koinonia-global",
      eventId: "general-assembly-2026",
      from: "Kubwa",
      to: "General Assembly",
      time: "6:40 AM",
      date: "Sat, 12 Dec",
      driver: "Daniel M.",
      driverId: "driver-3",
      vehicle: "Hyundai Elantra · Blue",
      seats: 1,
      seatsTotal: 1,
      contribution: 0,
      verified: true,
      direction: "outbound",
      status: "open",
      meetingPoint: "Kubwa Village Market",
    },
    {
      id: "ride-4",
      organizationId: "koinonia-global",
      eventId: "sunday-service-20-dec",
      from: "Jabi",
      to: "Sunday Service",
      time: "3:00 PM",
      date: "Sun, 20 Dec",
      driver: "Mercy I.",
      driverId: "driver-4",
      vehicle: "Kia Rio · White",
      seats: 2,
      seatsTotal: 3,
      contribution: 1000,
      verified: true,
      direction: "outbound",
      status: "open",
      meetingPoint: "Jabi Lake Mall",
    },
    {
      id: "ride-5",
      organizationId: "koinonia-global",
      eventId: "sunday-service-20-dec",
      from: "Gwarinpa",
      to: "Sunday Service",
      time: "3:15 PM",
      date: "Sun, 20 Dec",
      driver: "Peter N.",
      driverId: "driver-5",
      vehicle: "Toyota Camry · Grey",
      seats: 3,
      seatsTotal: 3,
      contribution: 0,
      verified: true,
      direction: "outbound",
      status: "open",
    },
  ],
  requests: [
    {
      id: "req-1",
      rideId: "ride-1",
      passengerId: "passenger-1",
      name: "David O.",
      area: "Gwarinpa",
      status: "pending",
    },
    {
      id: "req-2",
      rideId: "ride-2",
      passengerId: "current-member",
      name: "You",
      area: "Life Camp",
      status: "accepted",
    },
    {
      id: "req-3",
      rideId: "ride-1",
      passengerId: "passenger-3",
      name: "John E.",
      area: "Gwarinpa",
      status: "pending",
    },
  ],
  waitlist: [],
  checkins: { "current-member": true },
};
let state = initial;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (next: State) => {
  state = next;
  emit();
};
export const rideEngine = {
  snapshot: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  publish(input: Omit<Ride, "id" | "status">) {
    const r = { ...input, id: `ride-${Date.now()}`, status: "open" as RideStatus };
    set({ ...state, rides: [r, ...state.rides] });
    matchWaitlist(r);
    return r;
  },
  requestSeat(rideId: string, passenger = { id: "current-member", name: "You", area: "Gwarinpa" }) {
    const ride = state.rides.find((r) => r.id === rideId);
    if (!ride || ride.status !== "open" || ride.seats < 1)
      throw new Error("This ride has no available seats.");
    if (ride.driverId === passenger.id)
      throw new Error("You cannot request a seat on your own ride.");
    if (
      state.requests.some(
        (r) =>
          r.rideId === rideId &&
          r.passengerId === passenger.id &&
          ["pending", "accepted"].includes(r.status),
      )
    )
      return;
    set({
      ...state,
      requests: [
        ...state.requests,
        {
          id: `req-${Date.now()}`,
          rideId,
          passengerId: passenger.id,
          name: passenger.name,
          area: passenger.area,
          status: "pending",
        },
      ],
    });
  },
  decide(requestId: string, accept: boolean) {
    const req = state.requests.find((r) => r.id === requestId);
    if (!req || req.status !== "pending") return;
    const ride = state.rides.find((r) => r.id === req.rideId);
    if (!ride) return;
    if (accept && ride.seats < 1) throw new Error("No seats remain.");
    const requests = state.requests.map((r) =>
      r.id === requestId
        ? { ...r, status: (accept ? "accepted" : "declined") as RequestStatus }
        : r,
    );
    const rides = state.rides.map((r) =>
      r.id === ride.id && accept
        ? {
            ...r,
            seats: r.seats - 1,
            status: (r.seats - 1 === 0 ? "full" : r.status) as RideStatus,
          }
        : r,
    );
    set({ ...state, requests, rides });
  },
  cancelRequest(requestId: string) {
    const req = state.requests.find((r) => r.id === requestId);
    if (!req) return;
    const accepted = req.status === "accepted";
    set({
      ...state,
      requests: state.requests.map((r) => (r.id === requestId ? { ...r, status: "cancelled" } : r)),
      rides: state.rides.map((r) =>
        r.id === req.rideId && accepted
          ? {
              ...r,
              seats: Math.min(r.seats + 1, r.seatsTotal),
              status: r.status === "full" ? "open" : r.status,
            }
          : r,
      ),
    });
  },
  cancelRide(rideId: string) {
    const ride = state.rides.find((r) => r.id === rideId);
    if (!ride || ["completed", "cancelled"].includes(ride.status)) return;
    const acceptedIds = state.requests
      .filter((q) => q.rideId === rideId && q.status === "accepted")
      .map((q) => q.id);
    set({
      ...state,
      rides: state.rides.map((r) => (r.id === rideId ? { ...r, status: "cancelled" } : r)),
      requests: state.requests.map((q) =>
        acceptedIds.includes(q.id) ? { ...q, status: "cancelled" } : q,
      ),
    });
  },
  setRideStatus(rideId: string, status: RideStatus) {
    const ride = state.rides.find((r) => r.id === rideId);
    if (!ride) return;
    const allowed: Record<RideStatus, RideStatus[]> = {
      open: ["full", "boarding", "cancelled"],
      full: ["open", "boarding", "cancelled"],
      boarding: ["active", "cancelled"],
      active: ["completed"],
      completed: [],
      cancelled: [],
    };
    if (!allowed[ride.status].includes(status))
      throw new Error(`Cannot move ride from ${ride.status} to ${status}`);
    set({ ...state, rides: state.rides.map((r) => (r.id === rideId ? { ...r, status } : r)) });
  },
  checkIn(passengerId: string) {
    set({ ...state, checkins: { ...state.checkins, [passengerId]: true } });
  },
  joinWaitlist(entry: Omit<WaitlistEntry, "id" | "status">) {
    if (
      state.waitlist.some(
        (w) => w.userId === entry.userId && w.eventId === entry.eventId && w.status === "active",
      )
    )
      return;
    set({
      ...state,
      waitlist: [...state.waitlist, { ...entry, id: `wait-${Date.now()}`, status: "active" }],
    });
  },
};
function matchWaitlist(ride: Ride) {
  const match = state.waitlist.find(
    (w) =>
      w.organizationId === ride.organizationId &&
      w.eventId === ride.eventId &&
      w.direction === ride.direction &&
      w.area.toLowerCase() === ride.from.toLowerCase() &&
      w.status === "active",
  );
  if (match)
    set({
      ...state,
      waitlist: state.waitlist.map((w) => (w.id === match.id ? { ...w, status: "matched" } : w)),
    });
}
export function useRideState() {
  return useSyncExternalStore(rideEngine.subscribe, rideEngine.snapshot, rideEngine.snapshot);
}
export const rides = initial.rides;
export const rideStats = { members: 624, drivers: 142, seatsOffered: 387, seatsAvailable: 76 };
