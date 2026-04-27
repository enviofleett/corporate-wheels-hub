// Simple localStorage-backed role store for UI-only gating.
// Roles map to dashboards: corporate, host, admin.
// `feed`/`offers`/`payments`/`trust` are accessible by any signed-in role.

import { useEffect, useState } from "react";

export type AppRole = "corporate" | "host" | "admin";

const KEY = "fleetlink:role";
const EVT = "fleetlink:role-change";

export function getRole(): AppRole | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(KEY);
  return v === "corporate" || v === "host" || v === "admin" ? v : null;
}

export function setRole(role: AppRole | null) {
  if (typeof window === "undefined") return;
  if (role) window.localStorage.setItem(KEY, role);
  else window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(EVT));
}

export function useRole(): AppRole | null {
  const [role, setLocal] = useState<AppRole | null>(() => getRole());
  useEffect(() => {
    const sync = () => setLocal(getRole());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return role;
}
