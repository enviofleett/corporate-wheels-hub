import { createFileRoute, Outlet } from "@tanstack/react-router";
import { OrgBottomNav } from "@/components/organization/OrgBottomNav";
export const Route=createFileRoute("/org")({component:OrgLayout});
function OrgLayout(){return <div className="min-h-screen bg-muted/30 pb-24"><Outlet/><OrgBottomNav/></div>}