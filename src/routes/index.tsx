import {createFileRoute,Link,useNavigate} from "@tanstack/react-router";
import {ArrowRight,CalendarDays,CarFront,MapPin,Search,ShieldCheck,Sparkles,UsersRound} from "lucide-react";
import {useTenant} from "@/components/tenant/TenantProvider";
import {communityEvents,eventStore} from "@/lib/community-events";

export const Route=createFileRoute("/")({
 head:()=>({meta:[{title:"Community Rides — Organization Event Carpooling"},{name:"description",content:"Discover upcoming community events, find trusted rides and share empty seats."}]}),
 component:OrganizationHome
});

function OrganizationHome(){
 const tenant=useTenant();const nav=useNavigate();
 const events=communityEvents.filter(e=>e.organizationId===tenant.id&&e.status!=="completed");
 const featured=events[0];
 const openCount=events.filter(e=>e.status==="carpool_open").length;
 const seats=events.reduce((n,e)=>n+e.seatsAvailable,0);
 const openEvent=(id:string)=>{eventStore.select(id);nav({to:"/event/$eventId",params:{eventId:id}})};
 return <div className="min-h-screen bg-background">
   <header className="sticky top-0 z-30 border-b border-white/10 bg-primary/95 text-primary-foreground backdrop-blur">
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-black">{tenant.branding.logoText}</span>
        <span><span className="block text-sm font-black">{tenant.branding.portalName}</span><span className="block text-[10px] text-white/60">{tenant.name}</span></span>
      </Link>
      <Link to="/login" className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10">Sign in</Link>
    </div>
   </header>

   <main>
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 opacity-15" style={{backgroundImage:"radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",backgroundSize:"22px 22px"}}/>
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 pb-10 pt-10 sm:px-6 md:pb-14 md:pt-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-8 lg:py-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85"><Sparkles className="h-3.5 w-3.5 text-accent"/>Community event rides</div>
          <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">{tenant.tagline}</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base">Discover upcoming {tenant.shortName} events, find members travelling from your area, or share your empty seats with your community.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/events" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-accent px-5 text-sm font-black text-accent-foreground shadow-lg transition active:scale-[.98]"><CalendarDays className="h-4 w-4"/>Explore upcoming events</Link>
            <Link to="/rides" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 text-sm font-bold text-white transition hover:bg-white/15"><CarFront className="h-4 w-4"/>My rides</Link>
          </div>
        </div>
        {featured&&<button onClick={()=>openEvent(featured.id)} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 text-left shadow-2xl">
          <img src={featured.bannerUrl} alt="" className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-72"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"/>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold backdrop-blur">{featured.status==="carpool_open"?"Rides open":"Upcoming"}</span>
            <h2 className="mt-3 text-2xl font-black">{featured.name}</h2>
            <p className="mt-2 flex items-center gap-2 text-xs text-white/75"><CalendarDays className="h-3.5 w-3.5"/>{featured.dateLabel}</p>
            <p className="mt-1 flex items-center gap-2 text-xs text-white/75"><MapPin className="h-3.5 w-3.5"/>{featured.venue}</p>
          </div>
        </button>}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-3 gap-2 sm:max-w-xl">
        <Stat n={events.length} label="Upcoming events"/>
        <Stat n={openCount} label="Rides open"/>
        <Stat n={seats} label="Seats available"/>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-[11px] font-bold uppercase tracking-[.14em] text-primary">What’s happening</p><h2 className="mt-1 text-2xl font-black">Upcoming events</h2><p className="mt-1 text-sm text-muted-foreground">Tap an event to see programme details, venue information and ride options.</p></div>
        <Link to="/events" className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex">See all <ArrowRight className="h-4 w-4"/></Link>
      </div>
      {events.length>0?<div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{events.slice(0,3).map(e=><button key={e.id} onClick={()=>openEvent(e.id)} className="group overflow-hidden rounded-3xl border border-border bg-card text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-lg">
        <div className="relative h-44 overflow-hidden bg-muted"><img src={e.bannerUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"/><div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"/><span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-black text-foreground backdrop-blur">{e.status==="carpool_open"?"Rides open":"Coming soon"}</span></div>
        <div className="p-4"><h3 className="text-lg font-black">{e.name}</h3><div className="mt-3 space-y-1.5 text-xs text-muted-foreground"><p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5"/>{e.dateLabel}</p><p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5"/>{e.venue}</p></div><p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{e.description}</p><div className="mt-4 flex items-center justify-between border-t border-border pt-3"><span className="text-xs font-bold text-primary">{e.status==="carpool_open"?e.seatsAvailable+" seats available":e.arrivalLabel}</span><ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary"/></div></div>
      </button>)}</div>:<div className="mt-5 rounded-3xl border border-dashed bg-muted/30 p-8 text-center"><CalendarDays className="mx-auto h-7 w-7 text-muted-foreground"/><p className="mt-3 text-sm font-bold">No upcoming events yet</p><p className="mt-1 text-xs text-muted-foreground">New events from {tenant.shortName} will appear here.</p></div>}
      <Link to="/events" className="mt-5 flex h-11 items-center justify-center gap-2 rounded-2xl border text-sm font-bold sm:hidden">Browse all events <ArrowRight className="h-4 w-4"/></Link>
    </section>

    <section className="border-y bg-muted/35">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
        <Feature icon={<Search/>} title="Find people going your way" text="Browse available rides by event, pickup area and departure time."/>
        <Feature icon={<UsersRound/>} title="Share your empty seats" text="Offer a ride for an event and manage passengers from My Rides."/>
        <Feature icon={<ShieldCheck/>} title="Travel with your community" text="Ride information stays connected to the organization and event you’re attending."/>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-primary p-6 text-primary-foreground sm:flex sm:items-center sm:justify-between sm:p-8">
        <div><p className="text-xs font-bold uppercase tracking-[.14em] text-white/60">Already a member?</p><h2 className="mt-2 text-2xl font-black">Your rides, bookings and driver requests in one place.</h2></div>
        <Link to="/login" className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-background px-5 text-sm font-black text-foreground sm:mt-0 sm:w-auto">Sign in to your account</Link>
      </div>
    </section>
   </main>

   <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">Powered for {tenant.name} · Community event carpooling</footer>
 </div>
}
function Stat({n,label}:{n:number;label:string}){return <div className="rounded-2xl border bg-card p-3"><p className="text-xl font-black">{n}</p><p className="mt-1 text-[10px] text-muted-foreground">{label}</p></div>}
function Feature({icon,title,text}:{icon:React.ReactNode;title:string;text:string}){return <div className="rounded-3xl border bg-background p-5"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</span><h3 className="mt-4 text-sm font-black">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p></div>}
