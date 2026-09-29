import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Armchair,
  ArrowLeft,
  BadgeCheck,
  Banknote,
  CarFront,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  UsersRound,
  WalletCards,
} from "lucide-react";
import type { ReactNode } from "react";
import { useOrgAdmin } from "@/lib/org-admin-store";
import {
  useRideState,
  type PaymentStatus,
  type RequestStatus,
  type RideStatus,
} from "@/lib/rides-data";

export const Route = createFileRoute("/org/events_/$eventId")({
  component: EventDashboard,
});

function EventDashboard() {
  const { eventId } = Route.useParams();
  const admin = useOrgAdmin();
  const state = useRideState();
  const event = admin.events.find((item) => item.id === eventId);

  if (!event) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p className="font-black">Event not found.</p>
        <Link to="/org/events" className="mt-3 inline-block text-sm font-bold text-primary">
          Back to events
        </Link>
      </main>
    );
  }

  const rides = state.rides.filter((ride) => ride.eventId === eventId);
  const rideIds = new Set(rides.map((ride) => ride.id));
  const bookings = state.requests.filter((request) => rideIds.has(request.rideId));
  const confirmed = bookings.filter((booking) => booking.status === "accepted");
  const pending = bookings.filter((booking) => booking.status === "pending");
  const totalSeats = rides.reduce((sum, ride) => sum + ride.seatsTotal, 0);
  const openSeats = rides.reduce((sum, ride) => sum + ride.seats, 0);
  const grossFees = confirmed.reduce((sum, booking) => {
    const ride = rides.find((item) => item.id === booking.rideId);
    return sum + (ride?.contribution ?? 0);
  }, 0);
  const collectedFees = confirmed.reduce((sum, booking) => {
    const ride = rides.find((item) => item.id === booking.rideId);
    return sum + (booking.paymentStatus === "paid" ? (ride?.contribution ?? 0) : 0);
  }, 0);
  const commissionRate =
    admin.policy.commissionMode === "percentage" ? admin.policy.commissionPercent : 0;
  const organizationCommission = Math.round((collectedFees * commissionRate) / 100);
  const driverEarnings = collectedFees - organizationCommission;

  return (
    <div className="min-h-screen bg-muted/20 pb-24">
      <header className="bg-primary px-5 pb-7 pt-7 text-primary-foreground">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/org/events"
            className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-white/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Events
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/60">
            {event.status} event
          </p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black">{event.name}</h1>
              <p className="mt-2 text-sm text-white/70">
                {event.date} · {event.venue}, {event.city}
              </p>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-white/60">{event.description}</p>
            </div>
            <span className="w-fit rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold">
              Event operations
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-5 pt-5">
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric icon={<CarFront />} value={rides.length} label="Drivers / ride offers" />
          <Metric icon={<UsersRound />} value={confirmed.length} label="Confirmed bookings" />
          <Metric
            icon={<Armchair />}
            value={`${totalSeats - openSeats}/${totalSeats}`}
            label="Seats booked"
          />
          <Metric icon={<Clock3 />} value={pending.length} label="Pending requests" />
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <MoneyMetric
            label="Confirmed passenger fees"
            value={grossFees}
            detail="Fees attached to confirmed bookings"
          />
          <MoneyMetric
            label="Collected payments"
            value={collectedFees}
            detail="Paid passenger contributions"
          />
          <MoneyMetric
            label="Organization commission"
            value={organizationCommission}
            detail={
              commissionRate > 0
                ? `${commissionRate}% of collected fees`
                : "No commission configured"
            }
          />
        </section>

        <section className="rounded-2xl border bg-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                <WalletCards className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black">Driver earnings after commission</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Based on payments currently marked as paid.
                </p>
              </div>
            </div>
            <p className="text-2xl font-black">{formatNaira(driverEarnings)}</p>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">
                Drivers
              </p>
              <h2 className="text-lg font-black">Ride offers for this event</h2>
            </div>
            <span className="text-xs font-bold text-muted-foreground">{rides.length} total</span>
          </div>

          <div className="space-y-3">
            {rides.map((ride) => {
              const rideBookings = bookings.filter((booking) => booking.rideId === ride.id);
              const accepted = rideBookings.filter((booking) => booking.status === "accepted");
              const gross = accepted.length * ride.contribution;
              const paid = accepted.filter((booking) => booking.paymentStatus === "paid").length;
              return (
                <article key={ride.id} className="rounded-2xl border bg-card p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-black text-primary">
                        {initials(ride.driver)}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-black">{ride.driver}</p>
                          {ride.verified && <BadgeCheck className="h-4 w-4 text-success" />}
                          <StatusBadge status={ride.status} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{ride.vehicle}</p>
                        <div className="mt-3 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
                          <p className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {ride.from}
                            {ride.meetingPoint ? ` · ${ride.meetingPoint}` : ""}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />
                            {ride.date} · {ride.time}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[430px]">
                      <DriverStat label="Booked" value={accepted.length} />
                      <DriverStat label="Seats open" value={ride.seats} />
                      <DriverStat label="Fee / seat" value={formatNaira(ride.contribution)} />
                      <DriverStat label="Gross fees" value={formatNaira(gross)} />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t pt-3 text-[11px]">
                    <span className="rounded-full bg-muted px-2.5 py-1 font-bold">
                      {rideBookings.length} booking request{rideBookings.length === 1 ? "" : "s"}
                    </span>
                    <span className="rounded-full bg-success/10 px-2.5 py-1 font-bold text-success">
                      {paid} paid
                    </span>
                    <Link
                      to="/ride-requests/$rideId"
                      params={{ rideId: ride.id }}
                      className="rounded-full border px-2.5 py-1 font-bold text-primary"
                    >
                      Open seat requests
                    </Link>
                  </div>
                </article>
              );
            })}

            {rides.length === 0 && (
              <EmptyState text="No drivers have offered rides for this event yet." />
            )}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">
                Passenger bookings
              </p>
              <h2 className="text-lg font-black">Customers and booking status</h2>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {bookings.length} requests
            </span>
          </div>

          <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Passenger</th>
                  <th className="px-4 py-3">Driver / ride</th>
                  <th className="px-4 py-3">Pickup</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Booking</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Check-in</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((booking) => {
                  const ride = rides.find((item) => item.id === booking.rideId);
                  return (
                    <tr key={booking.id}>
                      <td className="px-4 py-3">
                        <p className="font-bold">{booking.name}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {booking.requestedAt ?? "Request time unavailable"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{ride?.driver ?? "Unknown driver"}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {ride?.vehicle ?? "Vehicle unavailable"}
                        </p>
                      </td>
                      <td className="px-4 py-3">{booking.area}</td>
                      <td className="px-4 py-3 font-bold">
                        {formatNaira(ride?.contribution ?? 0)}
                      </td>
                      <td className="px-4 py-3">
                        <BookingBadge status={booking.status} />
                      </td>
                      <td className="px-4 py-3">
                        <PaymentBadge status={booking.paymentStatus ?? "pending"} />
                      </td>
                      <td className="px-4 py-3">
                        {state.checkins[booking.passengerId] ? (
                          <span className="inline-flex items-center gap-1 font-bold text-success">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Checked in
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Not checked in</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {bookings.map((booking) => {
              const ride = rides.find((item) => item.id === booking.rideId);
              return (
                <article key={booking.id} className="rounded-2xl border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black">{booking.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {booking.area} · {ride?.driver ?? "Unknown driver"}
                      </p>
                    </div>
                    <BookingBadge status={booking.status} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <DriverStat label="Fee" value={formatNaira(ride?.contribution ?? 0)} />
                    <DriverStat
                      label="Payment"
                      value={paymentLabel(booking.paymentStatus ?? "pending")}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t pt-3 text-[11px] text-muted-foreground">
                    <span>{booking.requestedAt ?? "Request time unavailable"}</span>
                    <span
                      className={
                        state.checkins[booking.passengerId] ? "font-bold text-success" : ""
                      }
                    >
                      {state.checkins[booking.passengerId] ? "Checked in" : "Not checked in"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {bookings.length === 0 && <EmptyState text="No passenger bookings for this event yet." />}
        </section>

        <section className="rounded-2xl border bg-card p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-black">Safety & verification</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Driver and vehicle approval rules follow your organization policy. Booking, payment,
                check-in and commission fields shown here are already structured for backend
                persistence later.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({ icon, value, label }: { icon: ReactNode; value: ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <span className="text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <p className="mt-3 text-2xl font-black">{value}</p>
      <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function MoneyMetric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <Banknote className="h-5 w-5 text-primary" />
      <p className="mt-3 text-xl font-black">{formatNaira(value)}</p>
      <p className="mt-1 text-xs font-bold">{label}</p>
      <p className="mt-1 text-[10px] text-muted-foreground">{detail}</p>
    </div>
  );
}

function DriverStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-muted/50 p-3">
      <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: RideStatus }) {
  const classes =
    status === "completed"
      ? "bg-success/10 text-success"
      : status === "cancelled"
        ? "bg-destructive/10 text-destructive"
        : status === "active" || status === "boarding"
          ? "bg-warning/15 text-warning-foreground"
          : "bg-primary-soft text-primary";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold capitalize ${classes}`}>
      {status}
    </span>
  );
}

function BookingBadge({ status }: { status: RequestStatus }) {
  const classes =
    status === "accepted"
      ? "bg-success/10 text-success"
      : status === "pending" || status === "waitlisted"
        ? "bg-warning/15 text-warning-foreground"
        : status === "cancelled" || status === "declined"
          ? "bg-destructive/10 text-destructive"
          : "bg-muted text-muted-foreground";
  return (
    <span className={`rounded-full px-2 py-1 text-[9px] font-bold capitalize ${classes}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const classes =
    status === "paid"
      ? "bg-success/10 text-success"
      : status === "refunded"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground";
  return (
    <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${classes}`}>
      {paymentLabel(status)}
    </span>
  );
}

function paymentLabel(status: PaymentStatus) {
  if (status === "waived") return "Free / waived";
  if (status === "refunded") return "Refunded";
  if (status === "paid") return "Paid";
  return "Pending";
}

function formatNaira(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card p-6 text-center text-xs text-muted-foreground">
      {text}
    </div>
  );
}
