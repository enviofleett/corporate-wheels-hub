import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getRole, type AppRole } from "@/lib/role-store";

interface RequireRoleProps {
  /**
   * Roles allowed to view the wrapped content.
   * Pass multiple to allow shared screens (e.g. ["corporate", "host", "admin"]).
   */
  allow: AppRole[];
  children: ReactNode;
}

/**
 * UI-only route guard. Reads role from localStorage; if the current role
 * isn't allowed, redirects to /role to pick one. Renders nothing while
 * resolving to avoid a flash of protected content.
 */
export function RequireRole({ allow, children }: RequireRoleProps) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = getRole();
    if (role && allow.includes(role)) {
      setAuthorized(true);
    } else {
      navigate({ to: "/role" });
    }
    setReady(true);
  }, [allow, navigate]);

  if (!ready || !authorized) return null;
  return <>{children}</>;
}
