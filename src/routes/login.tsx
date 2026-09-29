import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, UsersRound, ChevronLeft, Mail, Lock } from "lucide-react";
import { setRole } from "@/lib/role-store";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const n = useNavigate();
  const [mode, setMode] = useState<"member" | "organization">("member");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (mode === "member") {
      setRole("member");
      n({ to: "/events" });
    } else {
      setRole("organization_admin");
      n({ to: "/org" });
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 flex items-center justify-center p-4 relative font-sans overflow-hidden">
      {/* Abstract Background Design */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full pointer-events-none"></div>

      <main className="w-full max-w-md relative z-10">
        <button onClick={() => window.history.back()} className="mb-6 flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition">
          <ChevronLeft className="h-5 w-5" /> Back to feed
        </button>

        <div className="bg-background/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20">
          <div className="text-center mb-8">
             <div className="h-16 w-16 bg-gradient-to-br from-primary to-accent rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg text-primary-foreground">
               <UsersRound className="h-8 w-8" />
             </div>
             <h1 className="text-3xl font-black tracking-tight mb-2">Welcome Back</h1>
             <p className="text-sm text-muted-foreground font-medium">Log in to book rides and join events</p>
          </div>

          <div className="mb-8 grid grid-cols-2 rounded-2xl bg-muted/50 p-1 text-xs font-bold border border-border">
            <button
              onClick={() => setMode("member")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                mode === "member"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UsersRound className="h-4 w-4" />
              Member
            </button>
            <button
              onClick={() => setMode("organization")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                mode === "organization"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Organization
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
               <input
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 type="email"
                 placeholder="Email Address"
                 className="h-14 w-full rounded-2xl border border-border bg-muted/40 pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
               />
            </div>
            <div className="relative">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
               <input
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 type="password"
                 placeholder="Password"
                 className="h-14 w-full rounded-2xl border border-border bg-muted/40 pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
               />
            </div>

            <button
              disabled={!email || !password}
              onClick={submit}
              className="h-14 w-full rounded-2xl bg-primary text-sm font-black text-primary-foreground shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:bg-primary/90 hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 disabled:hover:shadow-none mt-4"
            >
              Sign In
            </button>
          </div>

          {mode === "organization" && (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/20 p-5 text-center">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Want to launch a transport hub?</p>
              <Link
                to="/onboarding/organization"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Register your organization <ChevronLeft className="h-3 w-3 rotate-180" />
              </Link>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Secure Auth Simulation
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
