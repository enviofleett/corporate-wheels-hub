import {createFileRoute,redirect} from "@tanstack/react-router";
export const Route=createFileRoute("/community")({beforeLoad:()=>{throw redirect({to:"/events"})},component:()=>null});