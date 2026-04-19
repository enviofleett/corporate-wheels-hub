import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }] }),
  component: SettingsScreen,
});

function SettingsScreen() {
  const [platformFee, setPlatformFee] = useState(5);
  const [gatewayFee, setGatewayFee] = useState(1.5);
  const [escrowAuto, setEscrowAuto] = useState(true);
  const [requireKyc, setRequireKyc] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <>
      <AdminTopBar
        title="Platform settings"
        subtitle="Fees, policy, feature flags"
        backTo="/admin/more"
      />
      <main className="mx-auto w-full max-w-md space-y-4 px-5 pt-4">
        <Section title="Fees">
          <Slider
            label="Platform take rate"
            unit="%"
            value={platformFee}
            min={0}
            max={15}
            step={0.5}
            onChange={setPlatformFee}
          />
          <Slider
            label="Payment gateway fee"
            unit="%"
            value={gatewayFee}
            min={0}
            max={5}
            step={0.1}
            onChange={setGatewayFee}
          />
          <p className="rounded-lg bg-muted/50 p-2.5 text-[11px] text-muted-foreground">
            Effective rate users see: <strong>{(platformFee + gatewayFee).toFixed(1)}%</strong>
          </p>
        </Section>

        <Section title="Policy">
          <Toggle
            label="Auto-release escrow on milestone"
            hint="Disable to require manual approval per milestone"
            value={escrowAuto}
            onChange={setEscrowAuto}
          />
          <Toggle
            label="KYC required before posting"
            hint="Hosts and corporates must complete required steps"
            value={requireKyc}
            onChange={setRequireKyc}
          />
          <Toggle
            label="Maintenance mode"
            hint="Blocks new requests and offers; existing deals unaffected"
            value={maintenance}
            onChange={setMaintenance}
            danger
          />
        </Section>

        <Section title="Limits">
          <RowInput label="Min request budget" prefix="₦" defaultValue="50,000" />
          <RowInput label="Max payout per request" prefix="₦" defaultValue="5,000,000" />
          <RowInput label="Daily payout cap (per host)" prefix="₦" defaultValue="2,000,000" />
        </Section>

        <button
          type="button"
          className="h-11 w-full rounded-xl bg-accent text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)]"
        >
          Save changes
        </button>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Slider({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-bold text-foreground">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full accent-accent"
      />
    </div>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
  danger,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-start gap-3 rounded-lg p-1 text-left"
    >
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${danger ? "text-destructive" : "text-foreground"}`}>
          {label}
        </p>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      </div>
      <span
        className={`flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          value ? (danger ? "bg-destructive" : "bg-success") : "bg-muted"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-background shadow transition-transform ${
            value ? "translate-x-4" : ""
          }`}
        />
      </span>
    </button>
  );
}

function RowInput({
  label,
  prefix,
  defaultValue,
}: {
  label: string;
  prefix?: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="mt-1 flex h-10 items-center rounded-lg border border-input bg-background px-3">
        {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
        <input
          defaultValue={defaultValue}
          className="ml-1 flex-1 bg-transparent text-sm outline-none"
        />
      </div>
    </div>
  );
}
