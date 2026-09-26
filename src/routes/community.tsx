import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, CalendarDays, MapPinned, Search, Plus, UsersRound, CarFront, Armchair } from "lucide-react";
import { activeTenant } from "@/lib/tenant-data";
import { useActiveEvent } from "@/lib/community-events";
import { rideStats, useRideState } from "@/lib/rides-data";
import { RideCard } from "@/components/rides/RideCard";
import { CommunityBottomNav } from "@/components/community/CommunityBottomNav";

export const Route = createFileRoute("/community")({ component: CommunityHome });

function CommunityHome() {
  const {rides}=useRideState();
  const activeEvent=useActiveEvent();
  const eventRides=rides.filter(r=>r.organizationId===activeTenant.id&&r.eventId===activeEvent.id);
  return <div className="min-h-screen bg-muted/30 pb-24">
    <header className="bg-primary px-5 pb-7 pt-8 text-primary-foreground">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between">
          <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-white/60">{activeTenant.name}</p><h1 className="mt-1 text-2xl font-bold">{activeTenant.tagline}</h1></div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-black">KG</div>
        </div>
        <Link to="/events" className="mt-6 block rounded-2xl bg-white/10 p-4 backdrop-blur transition hover:bg-white/15">
          <div className="flex items-start gap-3"><CalendarDays className="mt-0.5 h-5 w-5 text-accent"/><div><p className="font-bold">{activeEvent.name}</p><p className="mt-1 text-xs text-white/70">{activeEvent.dateLabel}</p><p className="mt-1 flex items-center gap-1 text-xs text-white/70"><MapPinned className="h-3.5 w-3.5"/>{activeEvent.venue}</p></div></div>
        <p className="mt-3 flex items-center gap-1 text-[11px] font-bold text-accent">Switch event <ArrowRight className="h-3 w-3"/></p></Link>
      </div>
    </header>
    <main className="mx-auto max-w-md space-y-5 px-5 pt-5">
      <section>
        <h2 className="text-lg font-bold">How are you getting there?</h2>
        <p className="mt-1 text-xs text-muted-foreground">Connect with verified members travelling to the same event.</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link to="/find" className="rounded-2xl bg-accent p-4 text-accent-foreground shadow-[var(--shadow-accent)]"><Search className="h-6 w-6"/><p className="mt-6 font-bold">Find a Ride</p><p className="mt-1 text-[11px] opacity-80">Search available seats</p></Link>
          <Link to="/offer" className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-[var(--shadow-card)]"><Plus className="h-6 w-6"/><p className="mt-6 font-bold">Offer a Ride</p><p className="mt-1 text-[11px] opacity-70">Share your empty seats</p></Link>
        </div>
      </section>
      <section className="grid grid-cols-3 gap-2">
        <Stat icon={<UsersRound className="h-4 w-4"/>} value={rideStats.members} label="Carpooling"/>
        <Stat icon={<CarFront className="h-4 w-4"/>} value={rideStats.drivers} label="Drivers"/>
        <Stat icon={<Armchair className="h-4 w-4"/>} value={rideStats.seatsAvailable} label="Seats open"/>
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-bold">Rides near you</h2><Link to="/find" className="flex items-center gap-1 text-xs font-bold text-primary">View all <ArrowRight className="h-3 w-3"/></Link></div>
        <div className="space-y-3">{eventRides.slice(0,2).map(r => <RideCard key={r.id} ride={r}/>)}</div>
      </section>
    </main>
    <CommunityBottomNav/>
  </div>
}

function Stat({icon,value,label}:{icon:ReactNode;value:number;label:string}) {
  return <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"><div className="text-primary">{icon}</div><p className="mt-2 text-xl font-black">{value}</p><p className="text-[10px] text-muted-foreground">{label}</p></div>
}