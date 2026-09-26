export type TenantBranding={portalName:string;primary:string;accent:string;support:string;logoText:string};
export type Campus={id:string;name:string;city:string};
export type Tenant={id:string;slug:string;name:string;shortName:string;tagline:string;domains:string[];branding:TenantBranding;campuses:Campus[];status:"trial"|"active"|"suspended"};
export const tenants:Tenant[]=[
{id:"koinonia-global",slug:"koinonia",name:"Koinonia Global",shortName:"Koinonia",tagline:"Travel together. Arrive together.",domains:["koinonia.communityrides.local","rides.koinoniaglobal.org"],branding:{portalName:"Koinonia Rides",primary:"#132f28",accent:"#d8a84e",support:"Community Mobility",logoText:"KG"},campuses:[{id:"abuja",name:"Abuja Campus",city:"Abuja"}],status:"active"},
{id:"coza",slug:"coza",name:"COZA",shortName:"COZA",tagline:"Share the journey with your community.",domains:["coza.communityrides.local"],branding:{portalName:"COZA Rides",primary:"#23233f",accent:"#c89b3c",support:"Transport Team",logoText:"CZ"},campuses:[{id:"abuja",name:"Abuja Campus",city:"Abuja"}],status:"active"},
{id:"dunamis",slug:"dunamis",name:"Dunamis International Gospel Centre",shortName:"Dunamis",tagline:"Better journeys, together.",domains:["dunamis.communityrides.local"],branding:{portalName:"Dunamis Rides",primary:"#3a163b",accent:"#d4a63a",support:"Mobility Desk",logoText:"DG"},campuses:[{id:"glory-dome",name:"Glory Dome",city:"Abuja"}],status:"trial"}
];
export const activeTenant=tenants[0];
export const activeEvent={id:"general-assembly-2026",organizationId:activeTenant.id,campusId:"abuja",name:"General Assembly 2026",venue:"Koinonia Global, Abuja",dateLabel:"12–13 December 2026",arrivalLabel:"Recommended arrival by 8:00 AM"};
export function resolveTenant(hostname:string){const h=hostname.toLowerCase().split(":")[0];return tenants.find(t=>t.status!=="suspended"&&t.domains.includes(h))??null}
