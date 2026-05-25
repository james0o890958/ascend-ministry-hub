import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RoleProvider } from "@/lib/role";
import { CurrentChurchProvider } from "@/lib/current-church";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <RoleProvider>
      <CurrentChurchProvider>
        <DashboardShell>
          <Outlet />
        </DashboardShell>
      </CurrentChurchProvider>
    </RoleProvider>
  ),
});
