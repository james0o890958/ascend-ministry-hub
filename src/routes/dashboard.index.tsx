import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { branches, cellGroups, stats } from "@/lib/data";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/dashboard/")({ component: Overview });

function Overview() {
  const { role } = useRole();

  const rows = useMemo(() => {
    switch (role) {
      case "Admin":
        return [
          { metric: "Total members", value: stats.totalMembers.toLocaleString(), scope: "Global", trend: "+8.2%" },
          { metric: "First timers", value: stats.firstTimers, scope: "This Sunday", trend: "+12.4%" },
          { metric: "Baptized", value: stats.baptized.toLocaleString(), scope: "Global", trend: "+4.6%" },
          { metric: "Foundation school", value: stats.foundationStudents.toLocaleString(), scope: "Active", trend: "+6.1%" },
          { metric: "Cell members", value: stats.cellMembers.toLocaleString(), scope: "Global", trend: "+5.2%" },
          { metric: "Leaders", value: stats.leaders, scope: "Global", trend: "+2.8%" },
          { metric: "Pastors", value: stats.pastors, scope: "Global", trend: "+1.2%" },
          { metric: "Churches", value: stats.branches, scope: "Active", trend: "+3.0%" },
        ];
      case "Pastor":
        return [
          { metric: "Church members", value: branches[0].members.toLocaleString(), scope: branches[0].name, trend: "+7.1%" },
          { metric: "First timers", value: 42, scope: "This Sunday", trend: "+9.8%" },
          { metric: "Baptized", value: 1240, scope: "YTD", trend: "+5.0%" },
          { metric: "Cells", value: cellGroups.length, scope: "Active", trend: "+2.0%" },
          { metric: "Workers", value: 186, scope: branches[0].name, trend: "+3.4%" },
          { metric: "Leaders", value: 86, scope: branches[0].name, trend: "+1.9%" },
        ];
      case "Cell Leader":
        return [
          { metric: "Cell members", value: 22, scope: "Cell A-1", trend: "+2 this week" },
          { metric: "Avg attendance", value: "82%", scope: "Last 4 weeks", trend: "+3.4%" },
          { metric: "New invitees", value: 4, scope: "This week", trend: "+1" },
          { metric: "Foundation enrolled", value: 6, scope: "Cell A-1", trend: "+2" },
        ];
      case "Member":
      default:
        return [
          { metric: "My attendance", value: "88%", scope: "Last 8 weeks", trend: "+4%" },
          { metric: "My cell", value: "Cell A-1", scope: "Leader: E. Adebayo", trend: "" },
          { metric: "Current stage", value: "Cell Member", scope: "Discipleship", trend: "Next: Workforce" },
          { metric: "My invitees", value: 3, scope: "Tracked", trend: "+1" },
        ];
    }
  }, [role]);

  const greeting = {
    Admin: "Ministry-wide overview",
    Pastor: "Your church at a glance",
    "Cell Leader": "Your cell at a glance",
    Member: "Your spiritual snapshot",
  }[role];

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" subtitle={greeting} />

      <SectionCard title={`Key metrics · ${role} view`}>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Metric</th>
                <th className="px-4 py-3 text-left font-semibold">Value</th>
                <th className="px-4 py-3 text-left font-semibold">Scope</th>
                <th className="px-4 py-3 text-left font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {rows.map((r) => (
                <tr key={r.metric} className="hover:bg-secondary/40">
                  <td className="px-4 py-3 font-semibold">{r.metric}</td>
                  <td className="px-4 py-3 font-display text-lg">{r.value}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.scope}</td>
                  <td className="px-4 py-3">
                    {r.trend && <Badge className="bg-success/15 text-success border-success/30">{r.trend}</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
