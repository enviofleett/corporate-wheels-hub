export type Ride = {
  id: string; from: string; to: string; time: string; date: string;
  driver: string; vehicle: string; seats: number; contribution: number; verified: boolean;
};

export const rides: Ride[] = [
  { id: "ride-1", from: "Gwarinpa", to: "General Assembly", time: "7:00 AM", date: "Sat, 12 Dec", driver: "Emmanuel A.", vehicle: "Toyota Corolla · Silver", seats: 2, contribution: 1500, verified: true },
  { id: "ride-2", from: "Wuse 2", to: "General Assembly", time: "7:20 AM", date: "Sat, 12 Dec", driver: "Sarah O.", vehicle: "Honda Accord · Black", seats: 3, contribution: 1000, verified: true },
  { id: "ride-3", from: "Kubwa", to: "General Assembly", time: "6:40 AM", date: "Sat, 12 Dec", driver: "Daniel M.", vehicle: "Hyundai Elantra · Blue", seats: 1, contribution: 0, verified: true },
];

export const rideStats = { members: 624, drivers: 142, seatsOffered: 387, seatsAvailable: 76 };