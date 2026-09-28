import {createFileRoute,Outlet} from "@tanstack/react-router";
import {OrgBottomNav} from "@/components/organization/OrgBottomNav";
import {withRole} from "@/components/auth/withRole";
export const Route=createFileRoute("/org")({component:withRole(["organization_staff","organization_admin"],OrgLayout)});
function OrgLayout(){return <div className="min-h-screen bg-muted/30 pb-24"><Outlet/><OrgBottomNav/></div>}