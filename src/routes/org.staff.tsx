import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, UserPlus, X } from "lucide-react";
import { organizationStaff as seed, type StaffRole } from "@/lib/organization-data";
export const Route = createFileRoute("/org/staff")({ component: Staff });
function Staff() {
  const [staff, setStaff] = useState(seed);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [role, setRole] = useState<StaffRole>("event_manager");
  const invite = () => {
    if (!name || !email) return;
    setStaff((x) => [{ id: `stf-${Date.now()}`, name, email, role, status: "Invited" }, ...x]);
    setName("");
    setEmail("");
    setOpen(false);
  };
  return (
    <>
      <header className="border-b bg-background px-5 py-6">
        <div className="mx-auto max-w-md">
          <p className="text-[11px] font-bold uppercase text-muted-foreground">Organization</p>
          <div className="flex items-end justify-between">
            <h1 className="text-2xl font-black">Staff & permissions</h1>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 text-xs font-bold text-primary"
            >
              {open ? <X className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {open ? "Close" : "Invite"}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-md space-y-3 px-5 pt-4">
        {open && (
          <section className="rounded-2xl border bg-card p-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Staff name"
              className="h-11 w-full rounded-xl border px-3 text-sm"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as StaffRole)}
              className="mt-2 h-11 w-full rounded-xl border bg-background px-3 text-sm"
            >
              <option value="admin">Admin</option>
              <option value="event_manager">Event manager</option>
              <option value="safety_officer">Safety officer</option>
              <option value="ride_coordinator">Ride coordinator</option>
            </select>
            <button
              disabled={!name || !email}
              onClick={invite}
              className="mt-3 h-10 w-full rounded-xl bg-primary text-xs font-bold text-primary-foreground disabled:opacity-50"
            >
              Send invitation
            </button>
          </section>
        )}
        {staff.map((s) => (
          <div key={s.id} className="rounded-2xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-bold">{s.name}</span>
                <span className="block text-xs text-muted-foreground">{s.email}</span>
              </span>
              <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-bold">
                {s.role.replaceAll("_", " ")}
              </span>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">{s.status}</p>
          </div>
        ))}
      </main>
    </>
  );
}
