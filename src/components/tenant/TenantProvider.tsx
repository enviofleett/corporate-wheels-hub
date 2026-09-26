import { createContext,useContext,useEffect,useMemo,type ReactNode } from "react";import { activeTenant,resolveTenant,type Tenant } from "@/lib/tenant-data";
const TenantContext=createContext<Tenant>(activeTenant);
export function TenantProvider({children}:{children:ReactNode}){const tenant=useMemo(()=>typeof window==="undefined"?activeTenant:resolveTenant(window.location.hostname)??activeTenant,[]);useEffect(()=>{const root=document.documentElement;root.style.setProperty("--tenant-primary",tenant.branding.primary);root.style.setProperty("--tenant-accent",tenant.branding.accent);document.title=tenant.branding.portalName},[tenant]);return <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>}
export function useTenant(){return useContext(TenantContext)}
