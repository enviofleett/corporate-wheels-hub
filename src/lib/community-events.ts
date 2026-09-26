import {useSyncExternalStore} from "react";
export type CommunityEventStatus="carpool_open"|"published"|"completed";
export type CommunityEvent={id:string;organizationId:string;campusId?:string;name:string;venue:string;dateLabel:string;arrivalLabel:string;status:CommunityEventStatus;rides:number;seatsAvailable:number};
export const communityEvents:CommunityEvent[]=[
{id:"general-assembly-2026",organizationId:"koinonia-global",campusId:"abuja",name:"General Assembly 2026",venue:"Koinonia Global, Abuja",dateLabel:"12–13 December 2026",arrivalLabel:"Recommended arrival by 8:00 AM",status:"carpool_open",rides:142,seatsAvailable:76},
{id:"sunday-service-20-dec",organizationId:"koinonia-global",campusId:"abuja",name:"Sunday Service",venue:"Koinonia Global, Abuja",dateLabel:"20 December 2026",arrivalLabel:"Recommended arrival by 4:00 PM",status:"carpool_open",rides:38,seatsAvailable:24},
{id:"new-year-service-2027",organizationId:"koinonia-global",campusId:"abuja",name:"New Year Service 2027",venue:"Koinonia Global, Abuja",dateLabel:"1 January 2027",arrivalLabel:"Carpool opens 28 December",status:"published",rides:0,seatsAvailable:0},
{id:"november-miracle-service",organizationId:"koinonia-global",campusId:"abuja",name:"November Miracle Service",venue:"Koinonia Global, Abuja",dateLabel:"29 November 2026",arrivalLabel:"Event completed",status:"completed",rides:91,seatsAvailable:0}
];
const KEY="carpool-active-event";let activeId=typeof window!=="undefined"?localStorage.getItem(KEY)||communityEvents[0].id:communityEvents[0].id;const listeners=new Set<()=>void>();const emit=()=>listeners.forEach(l=>l());
export const eventStore={getSnapshot:()=>activeId,subscribe:(l:()=>void)=>{listeners.add(l);return()=>listeners.delete(l)},select(id:string){if(!communityEvents.some(e=>e.id===id))return;activeId=id;if(typeof window!=="undefined")localStorage.setItem(KEY,id);emit()}};
export function useActiveEvent(){const id=useSyncExternalStore(eventStore.subscribe,eventStore.getSnapshot,eventStore.getSnapshot);return communityEvents.find(e=>e.id===id)??communityEvents[0]}
