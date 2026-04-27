import type { FC } from "react";
import { RequireRole } from "@/components/auth/RequireRole";
import type { AppRole } from "@/lib/role-store";

/**
 * Wraps a route component with a role gate. Use as the `component` value
 * passed to `createFileRoute`.
 */
export function withRole<P extends object>(
  allow: AppRole[],
  Component: FC<P>,
): FC<P> {
  const Gated: FC<P> = (props) => (
    <RequireRole allow={allow}>
      <Component {...props} />
    </RequireRole>
  );
  Gated.displayName = `withRole(${Component.displayName || Component.name || "Component"})`;
  return Gated;
}
