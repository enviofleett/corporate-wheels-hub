export type AppRole="member"|"organization_staff"|"organization_admin"|"platform_admin";
const KEY="carpool-role";
export function getRole():AppRole|null{if(typeof window==="undefined")return null;const r=localStorage.getItem(KEY);return r==="member"||r==="organization_staff"||r==="organization_admin"||r==="platform_admin"?r:null}
export function setRole(role:AppRole){if(typeof window!=="undefined"){localStorage.setItem(KEY,role);window.dispatchEvent(new Event("carpool-role-change"))}}
export function clearRole(){if(typeof window!=="undefined"){localStorage.removeItem(KEY);window.dispatchEvent(new Event("carpool-role-change"))}}
export function useRole():AppRole|null{if(typeof window==="undefined")return null;return getRole()}
