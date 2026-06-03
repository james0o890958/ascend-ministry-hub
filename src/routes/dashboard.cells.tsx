import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { HeartHandshake, Users, TrendingUp, CheckCircle2, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cellGroups, members, myLedCells } from "@/lib/data";
import { useRole } from "@/lib/role";
import { ReportComparison } from "@/components/dashboard/ReportComparison";

export const Route = createFileRoute("/dashboard/cells")({ component: CellsPage });

function CellsPage() {
  const { role } = useRole();

  if (role !== "Admin" && role !== "Pastor" && role !== "Cell Leader") {
    return (
      <SectionCard title="Restricted">
        <p className="text-sm text-muted-foreground">Cell Ministry is only available to Pastors and Cell Leaders.</p>
      </SectionCard>
    );
  }

  const isLeader = role === "Cell Leader";
  const myCells = isLeader ? cellGroups.filter((c) => myLedCells.includes(c.id)) : cellGroups;
  const [activeCellId, setActiveCellId] = useState<string>(myCells[0]?.id ?? cellGroups[0].id);
  const activeCell = useMemo(() => cellGroups.find((c) => c.id === activeCellId)!, [activeCellId]);
  const cellMembers = members.slice(0, activeCell.members > 14 ? 14 : activeCell.members);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cell Ministry"
        subtitle={isLeader ? `Managing ${myCells.length} cell${myCells.length > 1 ? "s" : ""}` : "Cell groups, leaders, attendance and growth"}
        action={
          myCells.length > 1 ? (
            <Tabs value={activeCellId} onValueChange={setActiveCellId}>
              <TabsList className="flex flex-wrap">
                {myCells.slice(0, 6).map((c) => <TabsTrigger key={c.id} value={c.id}>{c.name}</TabsTrigger>)}
              </TabsList>
            </Tabs>
          ) : null
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Members" value={activeCell.members} icon={Users} change={5.2} accent="primary" />
        <StatCard label="Attendance" value={`${activeCell.attendance}%`} icon={TrendingUp} change={activeCell.growth} accent="gold" />
        <StatCard label="Church" value={activeCell.branch} icon={HeartHandshake} accent="blue" />
        <StatCard label="Leader" value={activeCell.leader} icon={Users} accent="success" />
      </div>

      <Tabs defaultValue="members">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 h-auto">
          <TabsTrigger value="members" className="flex-1 min-w-fit px-4">Members</TabsTrigger>
          <TabsTrigger value="attendance" className="flex-1 min-w-fit px-4">Attendance</TabsTrigger>
          <TabsTrigger value="engagement" className="flex-1 min-w-fit px-4">Engagement</TabsTrigger>
          <TabsTrigger value="meetings" className="flex-1 min-w-fit px-4">Meetings</TabsTrigger>
          <TabsTrigger value="reports" className="flex-1 min-w-fit px-4">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          <SectionCard title={`${activeCell.name} members`}>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-4 py-3 text-left">Member</th><th className="px-4 py-3 text-left">Position</th><th className="px-4 py-3 text-left">Attendance</th><th className="px-4 py-3"/></tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {cellMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-secondary/40">
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarFallback>{m.name[0]}</AvatarFallback></Avatar><span className="font-semibold">{m.name}</span></div></td>
                      <td className="px-4 py-3"><Badge variant="outline">{m.stage}</Badge></td>
                      <td className="px-4 py-3">{m.attendance}%</td>
                      <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost" onClick={() => toast.success(`Marked ${m.name} present`)}><CheckCircle2 className="mr-1 h-4 w-4"/>Mark</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <SectionCard title="Recent meetings attendance">
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Present</th><th className="px-4 py-3 text-left">Absent</th><th className="px-4 py-3 text-left">Rate</th></tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {["2026-05-15","2026-05-08","2026-05-01","2026-04-24"].map((d, i) => (
                    <tr key={d}><td className="px-4 py-3">{new Date(d).toLocaleDateString()}</td><td className="px-4 py-3">{18 + i}</td><td className="px-4 py-3">{4 - i}</td><td className="px-4 py-3"><Badge className="bg-success/15 text-success border-success/30">{82 + i}%</Badge></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="engagement" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Active members" value={Math.round(activeCell.members * 0.86)} icon={Users} accent="primary"/>
            <StatCard label="New invitees" value={3} icon={Users} change={2} accent="gold"/>
            <StatCard label="Avg engagement" value="74%" icon={TrendingUp} change={3.1} accent="success"/>
          </div>
        </TabsContent>

        <TabsContent value="meetings" className="mt-4">
          <SectionCard title="Schedule" action={<Button className="bg-gradient-royal text-primary-foreground" onClick={() => toast.success("New meeting scheduled")}><CalendarPlus className="mr-1 h-4 w-4"/>New meeting</Button>}>
            <ul className="divide-y divide-border">
              {["Fri May 22 · 7:00 PM · Bible Study","Fri May 29 · 7:00 PM · Outreach Planning","Fri Jun 5 · 7:00 PM · Worship Night"].map((m) => (
                <li key={m} className="py-3 flex items-center justify-between"><span>{m}</span><Badge variant="outline">Upcoming</Badge></li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <ReportComparison label="Cells" entities={cellGroups.map((c) => ({ id: c.id, name: `${c.name} · ${c.branch}` }))} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
