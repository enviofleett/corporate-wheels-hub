import {useSyncExternalStore} from "react";
import {tenants} from "@/lib/tenant-data";

export type OrgHomepageConfig={
 organizationId:string;portalName:string;logoText:string;logoUrl:string;tagline:string;heroCopy:string;
 primary:string;accent:string;supportLabel:string;supportEmail:string;supportPhone:string;
};
const defaults:Record<string,OrgHomepageConfig>=Object.fromEntries(tenants.map(t=>[t.id,{
 organizationId:t.id,portalName:t.branding.portalName,logoText:t.branding.logoText,logoUrl:"",tagline:t.tagline,
 heroCopy:`Discover upcoming ${t.shortName} events, find members travelling from your area, or share your empty seats with your community.`,
 primary:t.branding.primary,accent:t.branding.accent,supportLabel:t.branding.support,supportEmail:"",supportPhone:""
}]));
const KEY="carpool-org-homepage-config";let state:Record<string,OrgHomepageConfig>=(()=>{if(typeof window==="undefined")return defaults;try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return defaults}})();
const listeners=new Set<()=>void>();const emit=()=>listeners.forEach(l=>l());const save=()=>{if(typeof window!=="undefined")localStorage.setItem(KEY,JSON.stringify(state))};
export const orgHomepageStore={get:(id:string)=>state[id]??defaults[id],update(id:string,patch:Partial<OrgHomepageConfig>){state={...state,[id]:{...(state[id]??defaults[id]),...patch}};save();emit()},reset(id:string){state={...state,[id]:defaults[id]};save();emit()},subscribe:(l:()=>void)=>{listeners.add(l);return()=>listeners.delete(l)},snapshot:()=>state};
export function useOrgHomepageConfig(id:string){useSyncExternalStore(orgHomepageStore.subscribe,orgHomepageStore.snapshot,orgHomepageStore.snapshot);return orgHomepageStore.get(id)}
