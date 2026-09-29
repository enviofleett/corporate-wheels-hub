import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Search,
  MapPin,
  CalendarDays,
  Heart,
  MessageCircle,
  Share2,
  Car,
  User,
  MoreHorizontal
} from "lucide-react";
import { useTenant } from "@/components/tenant/TenantProvider";
import { communityEvents, eventStore } from "@/lib/community-events";
import { useOrgHomepageConfig } from "@/lib/org-homepage-store";
import { CommunityBottomNav } from "@/components/community/CommunityBottomNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Community Rides — Organization Event Carpooling" },
      {
        name: "description",
        content: "Discover upcoming community events, find trusted rides and share empty seats.",
      },
    ],
  }),
  component: OrganizationHome,
});

function OrganizationHome() {
  const tenant = useTenant();
  const config = useOrgHomepageConfig(tenant.id);
  const navigate = useNavigate();
  const events = communityEvents.filter((e) => e.organizationId === tenant.id);

  const openEvent = (id: string) => {
    eventStore.select(id);
    navigate({ to: "/event/$eventId", params: { eventId: id } });
  };

  return (
    <div className="min-h-screen bg-muted/10 pb-24 text-foreground font-sans">
      {/* HEADER (PWA Style - No Nav Links) */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-md">
              {config.logoText}
            </div>
            <div>
              <h1 className="text-sm font-black leading-tight">{config.portalName}</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Community Feed</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted transition text-foreground">
              <Search className="h-5 w-5" />
            </button>
            <button className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted transition text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background"></span>
            </button>
            <Link to="/profile" className="h-10 w-10 ml-1 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border transition hover:ring-2 ring-primary/20">
               <User className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-6">
        {/* STORIES SECTION (Campuses/Groups) */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-muted-foreground">Active Hubs & Campuses</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x hide-scroll">
            <style>{`
              .hide-scroll::-webkit-scrollbar { display: none; }
              .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            
            {tenant.campuses.map((campus) => (
              <div key={campus.id} className="flex flex-col items-center gap-2 shrink-0 snap-start cursor-pointer group">
                <div className="h-16 w-16 rounded-full p-0.5 bg-gradient-to-tr from-primary to-accent shadow-sm group-hover:scale-105 transition-transform">
                  <div className="h-full w-full rounded-full border-2 border-background bg-muted overflow-hidden flex items-center justify-center text-[10px] font-black text-muted-foreground">
                    {campus.city.substring(0, 3).toUpperCase()}
                  </div>
                </div>
                <span className="text-[11px] font-bold max-w-[70px] truncate text-center group-hover:text-primary transition-colors">{campus.city}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FEED SECTION (Events Only) */}
        <div className="space-y-6">
          {events.length > 0 ? (
            events.map((e, idx) => (
              <article key={e.id} className="bg-background rounded-3xl p-5 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-border/60 transition hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                       <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold leading-tight">{tenant.shortName} Events</h3>
                      <p className="text-[11px] text-muted-foreground font-medium">Posted just now • {e.status === "carpool_open" ? "Booking Open" : "Upcoming"}</p>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>

                {/* Post Content */}
                <div 
                  className="cursor-pointer group"
                  onClick={() => openEvent(e.id)}
                >
                  <p className="text-sm mb-3 line-clamp-2 leading-relaxed text-foreground/90">{e.description}</p>
                  
                  {/* Rich Media Card */}
                  <div className="relative rounded-2xl overflow-hidden bg-muted mb-4 aspect-[4/3] sm:aspect-video shadow-inner">
                    <img src={e.bannerUrl} alt={e.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <h2 className="text-xl sm:text-2xl font-black leading-tight mb-2">{e.name}</h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs font-semibold text-white/90">
                         <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-lg"><MapPin className="h-3.5 w-3.5"/> {e.venue}</span>
                         <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-lg"><CalendarDays className="h-3.5 w-3.5"/> {e.dateLabel}</span>
                      </div>
                    </div>
                    {/* Floating Badge */}
                    <div className="absolute top-4 left-4 rounded-full bg-background/95 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-black text-foreground shadow-lg border border-white/10">
                      {e.seatsAvailable > 0 ? `${e.seatsAvailable} seats available` : 'Community Event'}
                    </div>
                  </div>
                </div>

                {/* Social Proof (Faces) */}
                {e.status === "carpool_open" && (
                   <div className="flex items-center gap-3 mb-4 px-1">
                     <div className="flex -space-x-2">
                       <img className="h-7 w-7 rounded-full border-2 border-background bg-muted" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=e2e8f0" alt=""/>
                       <img className="h-7 w-7 rounded-full border-2 border-background bg-muted" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=e2e8f0" alt=""/>
                       <img className="h-7 w-7 rounded-full border-2 border-background bg-muted" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=e2e8f0" alt=""/>
                     </div>
                     <p className="text-[11px] text-muted-foreground font-medium">
                       <strong className="text-foreground">David, Sarah</strong> and {e.rides * 4 + 12} others are going
                     </p>
                   </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-5 pt-3.5 border-t border-border/60">
                   <button className="flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground hover:text-red-500 transition group">
                     <Heart className="h-5 w-5 group-active:scale-90 transition-transform" /> <span>{e.rides * 12 + 4}</span>
                   </button>
                   <button className="flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground hover:text-blue-500 transition group">
                     <MessageCircle className="h-5 w-5 group-active:scale-90 transition-transform" /> <span>{idx === 0 ? 3 : 0}</span>
                   </button>
                   <button className="flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground hover:text-green-500 transition group">
                     <Share2 className="h-5 w-5 group-active:scale-90 transition-transform" />
                   </button>
                   <div className="flex-1"></div>
                   <button 
                     onClick={() => openEvent(e.id)}
                     className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-black shadow-md hover:bg-primary/90 active:scale-95 transition-all"
                   >
                     View & Book Rides
                   </button>
                </div>
              </article>
            ))
          ) : (
             <div className="p-10 text-center bg-background rounded-3xl border border-dashed border-border mt-10 shadow-sm">
               <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                 <CalendarDays className="h-7 w-7 text-muted-foreground" />
               </div>
               <h3 className="font-black text-lg text-foreground">No updates yet</h3>
               <p className="text-sm text-muted-foreground mt-2 leading-relaxed">When {tenant.shortName} creates new events, they will appear right here in your feed.</p>
             </div>
          )}

          {/* End of feed spacer */}
          <div className="h-10 w-full flex items-center justify-center">
             <div className="h-1.5 w-1.5 rounded-full bg-border"></div>
          </div>
        </div>
      </main>

      <CommunityBottomNav />
    </div>
  );
}
