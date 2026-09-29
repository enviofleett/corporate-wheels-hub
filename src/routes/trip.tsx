import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/trip")({
  beforeLoad: () => {
    throw redirect({ to: "/rides" });
  },
  component: () => null,
});
