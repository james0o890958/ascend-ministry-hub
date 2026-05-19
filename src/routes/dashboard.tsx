import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RoleProvider } from "@/lib/role";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <RoleProvider>
      <DashboardShell>
        <Outlet />
      </DashboardShell>
    </RoleProvider>
  ),
});
