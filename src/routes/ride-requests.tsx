import {createFileRoute,redirect} from "@tanstack/react-router";
export const Route=createFileRoute("/ride-requests")({beforeLoad:()=>{throw redirect({to:"/rides"})},component:()=>null});