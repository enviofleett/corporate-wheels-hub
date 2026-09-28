import {createFileRoute,Outlet} from "@tanstack/react-router";
import {AdminBottomNav} from "@/components/admin/AdminBottomNav";
import {withRole} from "@/components/auth/withRole";
export const Route=createFileRoute("/admin")({component:withRole(["platform_admin"],AdminLayout)});
function AdminLayout(){return <div className="min-h-screen bg-muted/30 pb-24"><Outlet/><AdminBottomNav/></div>}