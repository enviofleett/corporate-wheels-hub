import { useSyncExternalStore } from "react";
export type CommunityEventStatus = "carpool_open" | "published" | "completed";
export type CommunityEvent = {
  id: string;
  organizationId: string;
  campusId?: string;
  name: string;
  venue: string;
  dateLabel: string;
  arrivalLabel: string;
  description: string;
  bannerUrl: string;
  address: string;
  mapQuery: string;
  programmes: { label: string; time: string }[];
  rsvp: { name: string; phone: string; email?: string };
  instructions: string[];
  status: CommunityEventStatus;
  rides: number;
  seatsAvailable: number;
};
export const communityEvents: CommunityEvent[] = [
  {
    id: "general-assembly-2026",
    organizationId: "koinonia-global",
    campusId: "abuja",
    name: "General Assembly 2026",
    venue: "Koinonia Global, Abuja",
    dateLabel: "12–13 December 2026",
    arrivalLabel: "Recommended arrival by 8:00 AM",
    description:
      "Our annual gathering for worship, teaching and fellowship. Plan your journey early and travel with verified members of the Koinonia community.",
    bannerUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    address: "Koinonia Global, Abuja, Nigeria",
    mapQuery: "Koinonia Global Abuja Nigeria",
    programmes: [
      { label: "Day 1 programme", time: "Saturday · 8:00 AM" },
      { label: "Day 2 programme", time: "Sunday · 8:00 AM" },
    ],
    rsvp: { name: "Event Support Desk", phone: "08000000000", email: "events@example.org" },
    instructions: [
      "Arrive early enough to complete venue entry procedures.",
      "Use the carpool meeting point agreed with your driver.",
      "Keep your booking confirmation available on arrival.",
    ],
    status: "carpool_open",
    rides: 142,
    seatsAvailable: 76,
  },
  {
    id: "sunday-service-20-dec",
    organizationId: "koinonia-global",
    campusId: "abuja",
    name: "Sunday Service",
    venue: "Koinonia Global, Abuja",
    dateLabel: "20 December 2026",
    arrivalLabel: "Recommended arrival by 4:00 PM",
    description:
      "Join the Koinonia family for Sunday worship and fellowship. Find members travelling from your area or offer your available seats.",
    bannerUrl:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
    address: "Koinonia Global, Abuja, Nigeria",
    mapQuery: "Koinonia Global Abuja Nigeria",
    programmes: [{ label: "Sunday service", time: "Sunday · 5:00 PM" }],
    rsvp: { name: "Event Support Desk", phone: "08000000000" },
    instructions: [
      "Plan to arrive before the recommended arrival time.",
      "Confirm your ride before leaving for the pickup point.",
    ],
    status: "carpool_open",
    rides: 38,
    seatsAvailable: 24,
  },
  {
    id: "new-year-service-2027",
    organizationId: "koinonia-global",
    campusId: "abuja",
    name: "New Year Service 2027",
    venue: "Koinonia Global, Abuja",
    dateLabel: "1 January 2027",
    arrivalLabel: "Carpool opens 28 December",
    description:
      "Start the new year together with the Koinonia community. Ride sharing will open closer to the event date.",
    bannerUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    address: "Koinonia Global, Abuja, Nigeria",
    mapQuery: "Koinonia Global Abuja Nigeria",
    programmes: [{ label: "New Year service", time: "Friday · Time to be announced" }],
    rsvp: { name: "Event Support Desk", phone: "08000000000" },
    instructions: ["Programme details will be updated by the organization."],
    status: "published",
    rides: 0,
    seatsAvailable: 0,
  },
  {
    id: "november-miracle-service",
    organizationId: "koinonia-global",
    campusId: "abuja",
    name: "November Miracle Service",
    venue: "Koinonia Global, Abuja",
    dateLabel: "29 November 2026",
    arrivalLabel: "Event completed",
    description:
      "A completed community gathering. Your previous ride activity remains available in My Rides.",
    bannerUrl:
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80",
    address: "Koinonia Global, Abuja, Nigeria",
    mapQuery: "Koinonia Global Abuja Nigeria",
    programmes: [{ label: "Programme", time: "Completed" }],
    rsvp: { name: "Event Support Desk", phone: "08000000000" },
    instructions: [],
    status: "completed",
    rides: 91,
    seatsAvailable: 0,
  },
];
const KEY = "carpool-active-event";
let activeId =
  typeof window !== "undefined"
    ? localStorage.getItem(KEY) || communityEvents[0].id
    : communityEvents[0].id;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
export const eventStore = {
  getSnapshot: () => activeId,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  select(id: string) {
    if (!communityEvents.some((e) => e.id === id)) return;
    activeId = id;
    if (typeof window !== "undefined") localStorage.setItem(KEY, id);
    emit();
  },
};
export function useActiveEvent() {
  const id = useSyncExternalStore(
    eventStore.subscribe,
    eventStore.getSnapshot,
    eventStore.getSnapshot,
  );
  return communityEvents.find((e) => e.id === id) ?? communityEvents[0];
}
