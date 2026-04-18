// Anonymous, deterministic avatar for a corporate handle.
// No real branding is shown — identity stays masked until agreement.

import { Building2 } from "lucide-react";

type Props = {
  hue: number;
  size?: "sm" | "md";
};

export function CompanyAvatar({ hue, size = "md" }: Props) {
  const dim = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  return (
    <div
      className={`flex ${dim} shrink-0 items-center justify-center rounded-full text-white shadow-sm`}
      style={{
        background: `linear-gradient(135deg, oklch(0.55 0.15 ${hue}), oklch(0.35 0.12 ${hue}))`,
      }}
      aria-hidden
    >
      <Building2 className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
    </div>
  );
}
