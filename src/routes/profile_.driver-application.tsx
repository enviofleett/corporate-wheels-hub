import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CarFront, CheckCircle2 } from "lucide-react";
import { withRole } from "@/components/auth/withRole";
import { orgAdminStore } from "@/lib/org-admin-store";
export const Route = createFileRoute("/profile/driver-application")({
  component: withRole(["member", "organization_staff", "organization_admin"], DriverApplication),
});
function DriverApplication() {
  const nav = useNavigate();
  const [name, setName] = useState(""),
    [phone, setPhone] = useState(""),
    [email, setEmail] = useState(""),
    [vehicle, setVehicle] = useState(""),
    [plate, setPlate] = useState(""),
    [seats, setSeats] = useState(3),
    [done, setDone] = useState(false);
  const submit = () => {
    orgAdminStore.submitDriver({ name, phone, email, vehicle, plate, seats });
    setDone(true);
  };
  if (done)
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" />
        <h1 className="mt-4 text-2xl font-black">Application submitted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your organization can now review your driver and vehicle application.
        </p>
        <button
          onClick={() => nav({ to: "/profile" })}
          className="mt-6 h-11 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
        >
          Back to profile
        </button>
      </main>
    );
  return (
    <main className="mx-auto min-h-screen max-w-md px-5 py-6">
      <Link
        to="/profile"
        className="flex items-center gap-2 text-xs font-bold text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Profile
      </Link>
      <div className="mt-5">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-primary">
          Driver access
        </p>
        <h1 className="mt-1 text-2xl font-black">Apply to offer rides</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Submit your driver and vehicle details for organization approval.
        </p>
      </div>
      <section className="mt-6 space-y-3 rounded-2xl border bg-card p-4">
        <CarFront className="h-5 w-5 text-primary" />
        <Field label="Full name" value={name} set={setName} />
        <Field label="Phone" value={phone} set={setPhone} />
        <Field label="Email" value={email} set={setEmail} type="email" />
        <Field
          label="Vehicle"
          value={vehicle}
          set={setVehicle}
          placeholder="Toyota Corolla · Silver"
        />
        <Field label="Plate number" value={plate} set={setPlate} />
        <label className="block">
          <span className="text-[10px] font-bold uppercase text-muted-foreground">
            Passenger seats
          </span>
          <input
            type="number"
            min="1"
            max="8"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="mt-1 h-11 w-full rounded-xl border bg-background px-3 text-sm"
          />
        </label>
      </section>
      <button
        disabled={!name || !phone || !vehicle || !plate}
        onClick={submit}
        className="mt-5 h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-50"
      >
        Submit application
      </button>
    </main>
  );
}
function Field({
  label,
  value,
  set,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        className="mt-1 h-11 w-full rounded-xl border bg-background px-3 text-sm"
      />
    </label>
  );
}
