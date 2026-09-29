import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Building2, Globe2, Palette, ShieldCheck, ArrowRight } from "lucide-react";
import {
  orgAdminStore,
  type OrganizationProfile,
  type OrganizationType,
} from "@/lib/org-admin-store";
import { setRole } from "@/lib/role-store";
export const Route = createFileRoute("/onboarding/organization")({ component: Onboarding });
function Onboarding() {
  const n = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<OrganizationProfile>({
    name: "",
    type: "church",
    city: "Abuja",
    country: "Nigeria",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    slug: "",
  });
  const set = <K extends keyof OrganizationProfile>(k: K, v: OrganizationProfile[K]) =>
    setForm((x) => ({ ...x, [k]: v }));
  const finish = () => {
    const slug = (form.slug || form.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    orgAdminStore.register({ ...form, slug });
    setRole("organization_admin");
    n({ to: "/org" });
  };
  return (
    <main className="mx-auto min-h-screen max-w-lg px-5 py-8">
      <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
        Organization registration
      </p>
      <h1 className="mt-2 text-3xl font-black">Create your community rides workspace</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Register once, then manage events, drivers, policies and your public landing page from the
        organization console.
      </p>
      <div className="mt-6 flex gap-2">
        {[1, 2, 3].map((x) => (
          <div
            key={x}
            className={`h-1.5 flex-1 rounded-full ${x <= step ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>
      {step === 1 && (
        <section className="mt-6 space-y-3 rounded-2xl border bg-card p-4">
          <Header icon={<Building2 />} title="Organization details" />
          <Field
            label="Organization name"
            value={form.name}
            onChange={(v) => set("name", v)}
            placeholder="Koinonia Global"
          />
          <label className="block">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">
              Organization type
            </span>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value as OrganizationType)}
              className="mt-1 h-11 w-full rounded-xl border bg-background px-3 text-sm"
            >
              {[
                "church",
                "school",
                "company",
                "association",
                "conference",
                "community",
                "other",
              ].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Field label="City" value={form.city} onChange={(v) => set("city", v)} />
            <Field label="Country" value={form.country} onChange={(v) => set("country", v)} />
          </div>
        </section>
      )}
      {step === 2 && (
        <section className="mt-6 space-y-3 rounded-2xl border bg-card p-4">
          <Header icon={<Globe2 />} title="Primary contact" />
          <Field
            label="Contact name"
            value={form.contactName}
            onChange={(v) => set("contactName", v)}
          />
          <Field
            label="Email"
            value={form.contactEmail}
            onChange={(v) => set("contactEmail", v)}
            type="email"
          />
          <Field label="Phone" value={form.contactPhone} onChange={(v) => set("contactPhone", v)} />
          <Field
            label="Preferred portal slug"
            value={form.slug}
            onChange={(v) => set("slug", v)}
            placeholder="koinonia"
          />
        </section>
      )}
      {step === 3 && (
        <section className="mt-6 space-y-4 rounded-2xl border bg-card p-4">
          <Header icon={<ShieldCheck />} title="What happens next" />
          <Step
            icon={<Palette />}
            title="Customize your homepage"
            text="Set logo, colours, literature and support details."
          />
          <Step
            icon={<Building2 />}
            title="Create events"
            text="Publish event details, programme times and travel windows."
          />
          <Step
            icon={<ShieldCheck />}
            title="Set travel rules"
            text="Choose verification, driver approval, contribution and commission rules."
          />
        </section>
      )}
      <div className="mt-6 grid grid-cols-2 gap-2">
        {step > 1 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="h-12 rounded-xl border text-sm font-bold"
          >
            Back
          </button>
        ) : (
          <div />
        )}
        {step < 3 ? (
          <button
            disabled={
              (step === 1 && !form.name) ||
              (step === 2 && (!form.contactName || !form.contactEmail))
            }
            onClick={() => setStep((s) => s + 1)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={finish}
            className="h-12 rounded-xl bg-primary text-sm font-bold text-primary-foreground"
          >
            Create workspace
          </button>
        )}
      </div>
    </main>
  );
}
function Header({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="mb-1 flex items-center gap-2 text-sm font-black">
      <span className="text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {title}
    </div>
  );
}
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 h-11 w-full rounded-xl border bg-background px-3 text-sm"
      />
    </label>
  );
}
function Step({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl bg-muted/50 p-3">
      <span className="text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
