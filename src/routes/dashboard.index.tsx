import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarIcon, CheckCircle2, Zap } from "lucide-react";
import { format } from "date-fns";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  attendanceForDate, branches, cellGroups, events, members, stats,
} from "@/lib/data";
import { useRole } from "@/lib/role";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({ component: Overview });

function Overview() {
  const { role, userId } = useRole();
  const [date, setDate] = useState<Date>(new Date());
  const dateISO = format(date, "yyyy-MM-dd");
  const [selectedMember, setSelectedMember] = useState<string>("");

  const attendedIds = useMemo(() => new Set(attendanceForDate(dateISO)), [dateISO]);

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
          { metric: "Branches", value: stats.branches, scope: "Active", trend: "+3.0%" },
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

  function markAttendance() {
    if (!selectedMember) return toast.error("Select a member first");
    const m = members.find((x) => x.id === selectedMember);
    toast.success(`Marked ${m?.name} present for ${format(date, "PPP")}`);
    setSelectedMember("");
  }

  const greeting = {
    Admin: "Ministry-wide overview",
    Pastor: "Your church at a glance",
    "Cell Leader": "Your cell at a glance",
    Member: "Your spiritual snapshot",
  }[role];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        subtitle={greeting}
        action={
          <>
            {/* Date filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {format(date, "MMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>

            {/* Quick action */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gradient-royal text-primary-foreground gap-2">
                  <Zap className="h-4 w-4" /> Quick action
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-3">
                <DropdownMenuLabel>Mark attendance — {format(date, "PPP")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-2 p-1">
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {members.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={markAttendance} className="w-full bg-gradient-royal text-primary-foreground">
                    <CheckCircle2 className="mr-1 h-4 w-4" /> Mark present
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

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
                    {r.trend && (
                      <Badge className="bg-success/15 text-success border-success/30">{r.trend}</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title={`Attendance for ${format(date, "PPP")}`}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Members present" value={attendedIds.size} />
          <Stat label="Events held" value={events.filter((e) => e.date === dateISO).length} />
          <Stat label="Attendance rate" value={`${Math.round((attendedIds.size / members.length) * 100)}%`} />
        </div>
      </SectionCard>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
