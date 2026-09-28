const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "");
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
export const supabaseConfigured = Boolean(url && key);
type Session = {
  access_token: string;
  refresh_token?: string;
  user: { id: string; email?: string };
};
const SESSION_KEY = "carpool-supabase-session";
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}
function headers(auth = true) {
  const session = getSession();
  return {
    "Content-Type": "application/json",
    apikey: key || "",
    ...(auth && session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
  };
}
async function request<T>(path: string, init: RequestInit = {}) {
  if (!url || !key)
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    );
  const res = await fetch(`${url}${path}`, {
    ...init,
    headers: { ...headers(), ...(init.headers || {}) },
  });
  const body = await res.text();
  const data = body ? JSON.parse(body) : null;
  if (!res.ok)
    throw new Error(
      data?.message ||
        data?.error_description ||
        data?.hint ||
        `Supabase request failed (${res.status})`,
    );
  return data as T;
}
export const supabase = {
  async signIn(email: string, password: string) {
    const s = await request<Session>("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    return s;
  },
  async signUp(email: string, password: string) {
    return request("/auth/v1/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  signOut() {
    localStorage.removeItem(SESSION_KEY);
  },
  from<T = unknown>(table: string) {
    return {
      select: async (query = "*", filters = "") =>
        request<T[]>(`/rest/v1/${table}?select=${encodeURIComponent(query)}${filters}`),
      insert: async (payload: unknown) =>
        request<T[]>(`/rest/v1/${table}`, {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(payload),
        }),
    };
  },
  rpc: <T = unknown>(fn: string, args: Record<string, unknown>) =>
    request<T>(`/rest/v1/rpc/${fn}`, { method: "POST", body: JSON.stringify(args) }),
};
