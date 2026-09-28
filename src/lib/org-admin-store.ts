import {useSyncExternalStore} from "react";
export type OrganizationType="church"|"school"|"company"|"association"|"conference"|"community"|"other";
export type CommissionMode="none"|"percentage";
export type OrganizationProfile={name:string;type:OrganizationType;city:string;country:string;contactName:string;contactEmail:string;contactPhone:string;slug:string};
export type CarpoolPolicy={requireMemberVerification:boolean;requireDriverApproval:boolean;requireVehicleApproval:boolean;allowContributions:boolean;commissionMode:CommissionMode;commissionPercent:number;enableWaitlist:boolean;enableChat:boolean;requireLiveLocation:boolean;terms:string};
export type DriverApplicationStatus="pending"|"approved"|"declined";
export type DriverApplication={id:string;name:string;phone:string;email:string;vehicle:string;plate:string;seats:number;submittedAt:string;status:DriverApplicationStatus;notes?:string};
type State={registered:boolean;profile:OrganizationProfile;policy:CarpoolPolicy;driverApplications:DriverApplication[]};
const KEY="carpool-org-admin-state";
const defaults:State={registered:false,profile:{name:"",type:"church",city:"Abuja",country:"Nigeria",contactName:"",contactEmail:"",contactPhone:"",slug:""},policy:{requireMemberVerification:true,requireDriverApproval:true,requireVehicleApproval:true,allowContributions:true,commissionMode:"none",commissionPercent:0,enableWaitlist:true,enableChat:true,requireLiveLocation:false,terms:"Drivers and passengers must follow the organization's safety and conduct rules."},driverApplications:[
{id:"drv-app-1",name:"Emmanuel A.",phone:"08030000001",email:"emmanuel@example.org",vehicle:"Toyota Corolla · Silver",plate:"ABC 123 XY",seats:3,submittedAt:"27 Sep 2026",status:"approved"},
{id:"drv-app-2",name:"Sarah O.",phone:"08030000002",email:"sarah@example.org",vehicle:"Honda Accord · Black",plate:"ABJ 442 KT",seats:3,submittedAt:"28 Sep 2026",status:"pending"},
{id:"drv-app-3",name:"Daniel M.",phone:"08030000003",email:"daniel@example.org",vehicle:"Hyundai Elantra · Blue",plate:"RSH 991 LK",seats:2,submittedAt:"28 Sep 2026",status:"pending"}
]};
let state:State=(()=>{if(typeof window==="undefined")return defaults;try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return defaults}})();const listeners=new Set<()=>void>();const emit=()=>listeners.forEach(l=>l());const save=()=>{if(typeof window!=="undefined")localStorage.setItem(KEY,JSON.stringify(state))};
export const orgAdminStore={snapshot:()=>state,subscribe:(l:()=>void)=>{listeners.add(l);return()=>listeners.delete(l)},register(profile:OrganizationProfile){state={...state,registered:true,profile};save();emit()},updateProfile(patch:Partial<OrganizationProfile>){state={...state,profile:{...state.profile,...patch}};save();emit()},updatePolicy(patch:Partial<CarpoolPolicy>){state={...state,policy:{...state.policy,...patch}};save();emit()},decideDriver(id:string,status:DriverApplicationStatus,notes?:string){state={...state,driverApplications:state.driverApplications.map(a=>a.id===id?{...a,status,notes}:a)};save();emit()}};
export function useOrgAdmin(){return useSyncExternalStore(orgAdminStore.subscribe,orgAdminStore.snapshot,orgAdminStore.snapshot)}
