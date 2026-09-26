export type Tenant = {
  id: string; name: string; shortName: string; tagline: string;
  primary: string; accent: string; support: string;
};

export const activeTenant: Tenant = {
  id: "koinonia-global",
  name: "Koinonia Global",
  shortName: "Koinonia",
  tagline: "Travel together. Arrive together.",
  primary: "#132f28",
  accent: "#d8a84e",
  support: "Community Mobility",
};

export const activeEvent = {
  id: "general-assembly-2026",
  name: "General Assembly 2026",
  venue: "Koinonia Global, Abuja",
  dateLabel: "12–13 December 2026",
  arrivalLabel: "Recommended arrival by 8:00 AM",
};