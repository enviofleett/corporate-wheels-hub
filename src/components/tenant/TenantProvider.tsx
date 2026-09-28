import {createContext,useContext,useEffect,useMemo,type ReactNode} from "react";
import {activeTenant,resolveTenant,tenants,type Tenant} from "@/lib/tenant-data";
import {useOrgHomepageConfig} from "@/lib/org-homepage-store";
const C=createContext<Tenant>(activeTenant);
function hexRgb(hex:string){const v=hex.replace("#","");return [parseInt(v.slice(0,2),16),parseInt(v.slice(2,4),16),parseInt(v.slice(4,6),16)]}
export function TenantProvider({children}:{children:ReactNode}){
 const tenant=useMemo(()=>{if(typeof window==="undefined")return activeTenant;const params=new URLSearchParams(window.location.search);const preview=params.get("tenant");return preview?(tenants.find(t=>t.slug===preview)??activeTenant):(resolveTenant(window.location.hostname)??activeTenant)},[]);
 const config=useOrgHomepageConfig(tenant.id);
 useEffect(()=>{const root=document.documentElement;const [pr,pg,pb]=hexRgb(config.primary),[ar,ag,ab]=hexRgb(config.accent);root.style.setProperty("--primary",`rgb(${pr} ${pg} ${pb})`);root.style.setProperty("--accent",`rgb(${ar} ${ag} ${ab})`);root.style.setProperty("--ring",`rgb(${ar} ${ag} ${ab})`);document.title=config.portalName},[config]);
 return <C.Provider value={tenant}>{children}</C.Provider>
}
export function useTenant(){return useContext(C)}
