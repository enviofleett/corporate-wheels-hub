import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  CarFront,
  ChevronRight,
  ShieldCheck,
  UserRound,
  UsersRound,
  Camera,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  LogOut
} from "lucide-react";
import { withRole } from "@/components/auth/withRole";
import { useOrgAdmin } from "@/lib/org-admin-store";
import { CommunityBottomNav } from "@/components/community/CommunityBottomNav";
import { useTenant } from "@/components/tenant/TenantProvider";

export const Route = createFileRoute("/profile")({
  component: withRole(["member", "organization_staff", "organization_admin"], Profile),
});

function Profile() {
  const admin = useOrgAdmin();
  const tenant = useTenant();
  const app = admin.driverApplications.find((a) => a.userId === "current-member");

  return (
    <div className="min-h-screen bg-muted/10 pb-24 text-foreground font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-sm shadow-sm">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-black leading-tight">Profile</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                {tenant.shortName} Account
              </p>
            </div>
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-red-500/10 hover:text-red-500 transition text-muted-foreground">
             <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 pt-6">
        
        {/* AVATAR & BASIC INFO */}
        <section className="flex flex-col items-center justify-center bg-background rounded-3xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-border">
          <div className="relative group cursor-pointer">
            <div className="h-24 w-24 rounded-full border-4 border-background bg-muted shadow-md overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser&backgroundColor=e2e8f0" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera className="h-6 w-6 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full border-2 border-background flex items-center justify-center shadow-sm">
               <Camera className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          <h2 className="mt-4 text-lg font-black">Jane Doe</h2>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
            Community Member <BadgeCheck className="h-4 w-4 text-primary" />
          </p>
        </section>

        {/* PERSONAL INFORMATION (Editable) */}
        <section className="bg-background rounded-3xl p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-border">
           <h3 className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-4 px-1">Personal Information</h3>
           <div className="space-y-4">
              <div className="relative">
                 <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                 <input type="text" defaultValue="Jane Doe" className="w-full h-12 bg-muted/40 border border-border rounded-xl pl-10 pr-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
              </div>
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                 <input type="email" defaultValue="jane.doe@example.com" className="w-full h-12 bg-muted/40 border border-border rounded-xl pl-10 pr-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
              </div>
              <div className="relative">
                 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                 <input type="tel" defaultValue="+1 (555) 012-3456" className="w-full h-12 bg-muted/40 border border-border rounded-xl pl-10 pr-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
              </div>
              <button className="w-full h-12 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all">
                Save Changes
              </button>
           </div>
        </section>

        {/* SECURITY */}
        <section className="bg-background rounded-3xl p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-border">
           <h3 className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-4 px-1">Security</h3>
           <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Lock className="h-5 w-5 text-foreground" />
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-bold">Change Password</p>
                    <p className="text-xs text-muted-foreground">Update your account security</p>
                 </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
           </button>
        </section>

        {/* MY RIDES LINK */}
        <Link to="/rides" className="group flex items-center gap-4 rounded-3xl border border-border bg-background p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-primary/30 hover:shadow-md transition-all">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <CarFront className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <span className="block text-sm font-black">My Trips & Rides</span>
            <span className="block text-[11px] font-semibold text-muted-foreground mt-0.5">
              Passenger bookings and driver offers
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        {/* DRIVER VERIFICATION & ACCESS */}
        <section className="bg-background rounded-3xl p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-border">
          <div className="flex items-center gap-2 mb-4 px-1">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-black text-foreground">Driver KYC & Access</h3>
          </div>
          
          <div className="bg-muted/30 rounded-2xl p-4 border border-border mb-4">
            <div className="space-y-3 text-sm">
              <Row label="Member identity" value="Verified" highlight={false} />
              <Row
                label="Driver profile"
                value={
                  app?.status === "approved"
                    ? "Approved"
                    : app?.status === "pending"
                      ? "Pending approval"
                      : app?.status === "declined"
                        ? "Declined"
                        : "Not enabled"
                }
                highlight={app?.status === "approved"}
              />
              <Row
                label="Vehicle approval"
                value={
                  app?.status === "approved" ? "Approved" : app ? "Under review" : "Not submitted"
                }
                highlight={app?.status === "approved"}
              />
            </div>
          </div>

          <p className="text-xs font-medium leading-relaxed text-muted-foreground px-1">
            {app?.status === "approved"
              ? "Your driver and vehicle profile is approved! You can now offer rides to upcoming events."
              : app?.status === "pending"
                ? "Your application is waiting for organization review."
                : "Want to help out? Verified members can submit their driver and vehicle details to start offering rides."}
          </p>
          
          {app?.status !== "approved" && app?.status !== "pending" && (
            <Link
              to="/profile/driver-application"
              className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md hover:bg-primary/90 transition"
            >
              Apply to offer rides
            </Link>
          )}
        </section>
        
        {/* Footer spacer */}
        <div className="h-8"></div>
      </main>
      <CommunityBottomNav />
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string, highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground text-xs font-semibold">{label}</span>
      <span className={`text-xs font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</span>
    </div>
  );
}
