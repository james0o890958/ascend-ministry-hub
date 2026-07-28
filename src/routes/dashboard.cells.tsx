import { useState, useMemo, useSyncExternalStore } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { HeartHandshake, Users, TrendingUp, CheckCircle2, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { branches, cellGroups, members, myLedCells } from "@/lib/data";
import {
  getCellMeetings,
  addCellMeeting,
  subscribeCellMeetings,
  type CellMeeting,
} from "@/lib/cell-meetings-store";
import { addNotification } from "@/lib/notifications-store";
import { useCurrentChurch } from "@/lib/current-church";
import { useRole } from "@/lib/role";
import { ReportComparison } from "@/components/dashboard/ReportComparison";

export const Route = createFileRoute("/dashboard/cells")({ component: CellsPage });

function CellsPage() {
  const { role } = useRole();
  const { currentChurchId } = useCurrentChurch();
  const currentChurch = branches.find((b) => b.id === currentChurchId) ?? branches[0];
  const meetings = useSyncExternalStore(subscribeCellMeetings, getCellMeetings, getCellMeetings);

  const isLeader = role === "Cell Leader";
  const myCells = useMemo(() => {
    let list = cellGroups;
    if (currentChurchId !== "all") {
      list = list.filter((c) => c.branch === currentChurch.name);
    }
    if (isLeader) {
      list = list.filter((c) => myLedCells.includes(c.id));
    }
    return list.length > 0 ? list : cellGroups;
  }, [isLeader, currentChurchId, currentChurch]);

  const [activeCellId, setActiveCellId] = useState<string>(myCells[0]?.id ?? cellGroups[0].id);
  const activeCell = useMemo(
    () => cellGroups.find((c) => c.id === activeCellId) ?? myCells[0] ?? cellGroups[0],
    [activeCellId, myCells],
  );

  const [cellMemberList, setCellMemberList] = useState(() =>
    members.slice(0, activeCell.members > 14 ? 14 : activeCell.members),
  );

  if (role !== "Admin" && role !== "Pastor" && role !== "Cell Leader") {
    return (
      <SectionCard title="Restricted">
        <p className="text-sm text-muted-foreground">
          Cell Ministry is only available to Pastors and Cell Leaders.
        </p>
      </SectionCard>
    );
  }

  const markPresent = (id: string, name: string) => {
    setCellMemberList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, attendance: Math.min(100, m.attendance + 5) } : m)),
    );
    toast.success(`Marked ${name} present (+5% attendance)`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cell Ministry"
        subtitle={
          isLeader
            ? `Managing ${myCells.length} cell${myCells.length > 1 ? "s" : ""}`
            : "Cell groups, leaders, attendance and growth"
        }
        action={
          myCells.length > 1 ? (
            <Tabs value={activeCellId} onValueChange={setActiveCellId}>
              <TabsList className="flex flex-wrap">
                {myCells.slice(0, 6).map((c) => (
                  <TabsTrigger key={c.id} value={c.id}>
                    {c.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          ) : null
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Members"
          value={activeCell.members}
          icon={Users}
          change={5.2}
          accent="primary"
        />
        <StatCard
          label="Attendance"
          value={`${activeCell.attendance}%`}
          icon={TrendingUp}
          change={activeCell.growth}
          accent="gold"
        />
        <StatCard label="Church" value={activeCell.branch} icon={HeartHandshake} accent="blue" />
        <StatCard label="Leader" value={activeCell.leader} icon={Users} accent="success" />
      </div>

      <Tabs defaultValue="members">
        <TabsList className="flex w-full flex-nowrap overflow-x-auto no-scrollbar justify-start gap-1 h-auto pt-2.5 pb-[15px]">
          <TabsTrigger value="members" className="flex-1 min-w-fit px-4 py-2.5">
            Members
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex-1 min-w-fit px-4 py-2.5">
            Attendance
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex-1 min-w-fit px-4 py-2.5">
            Engagement
          </TabsTrigger>
          <TabsTrigger value="meetings" className="flex-1 min-w-fit px-4 py-2.5">
            Meetings
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex-1 min-w-fit px-4 py-2.5">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          <SectionCard title={`${activeCell.name} members`}>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Member</th>
                    <th className="px-4 py-3 text-left">Position</th>
                    <th className="px-4 py-3 text-left">Attendance</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {cellMemberList.map((m) => (
                    <tr key={m.id} className="hover:bg-secondary/40">
                      <td className="px-4 py-3">
                        <Link
                          to="/dashboard/members/$id"
                          params={{ id: m.id }}
                          className="flex items-center gap-3 group hover:opacity-80 transition"
                        >
                          <Avatar className="h-8 w-8 ring-1 ring-gold/30">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">{m.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold group-hover:text-primary group-hover:underline transition">{m.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{m.stage}</Badge>
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary">{m.attendance}%</td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => markPresent(m.id, m.name)}>
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Mark
                        </Button>
                      </td>
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
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Present</th>
                    <th className="px-4 py-3 text-left">Absent</th>
                    <th className="px-4 py-3 text-left">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {["2026-05-15", "2026-05-08", "2026-05-01", "2026-04-24"].map((d, i) => (
                    <tr key={d}>
                      <td className="px-4 py-3">{new Date(d).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{18 + i}</td>
                      <td className="px-4 py-3">{4 - i}</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-success/15 text-success border-success/30">
                          {82 + i}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="engagement" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Active members"
              value={Math.round(activeCell.members * 0.86)}
              icon={Users}
              accent="primary"
            />
            <StatCard label="New invitees" value={3} icon={Users} change={2} accent="gold" />
            <StatCard
              label="Avg engagement"
              value="74%"
              icon={TrendingUp}
              change={3.1}
              accent="success"
            />
          </div>
        </TabsContent>

        <TabsContent value="meetings" className="mt-4">
          <SectionCard
            title="Schedule"
            action={
              <NewMeetingDialog
                cellId={activeCell.id}
                cellName={activeCell.name}
                memberCount={activeCell.members}
                onAdded={(m) => setMeetings((prev) => [m, ...prev])}
              />
            }
          >
            <ul className="divide-y divide-border">
              {meetings
                .filter((m) => m.cellId === activeCell.id)
                .map((m) => (
                  <li key={m.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{m.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(m.date).toLocaleDateString()} · {m.time} · {m.location}
                      </p>
                    </div>
                    <Badge className="bg-gold-soft text-primary border-gold/30">New Meeting</Badge>
                  </li>
                ))}
              {[
                "Fri May 22 · 7:00 PM · Bible Study",
                "Fri May 29 · 7:00 PM · Outreach Planning",
                "Fri Jun 5 · 7:00 PM · Worship Night",
              ].map((m) => (
                <li key={m} className="py-3 flex items-center justify-between">
                  <span className="text-sm">{m}</span>
                  <Badge variant="outline">Upcoming</Badge>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <ReportComparison
            label="Cells"
            entities={cellGroups.map((c) => ({ id: c.id, name: `${c.name} · ${c.branch}` }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NewMeetingDialog({
  cellId,
  cellName,
  memberCount,
}: {
  cellId: string;
  cellName: string;
  memberCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [location, setLocation] = useState("");
  const [agenda, setAgenda] = useState("");

  function submit() {
    if (!title || !date) {
      toast.error("Title and date are required");
      return;
    }
    const m: CellMeeting = { id: `mt${Date.now()}`, cellId, title, date, time, location, agenda };
    addCellMeeting(m);
    addNotification({
      title: `New Cell Meeting: ${title}`,
      desc: `${new Date(date).toLocaleDateString()} at ${time} · ${cellName} (${memberCount} members notified)`,
      time: "Just now",
    });
    toast.success(`Meeting scheduled — ${memberCount} members in ${cellName} notified`);
    setOpen(false);
    setTitle("");
    setDate("");
    setLocation("");
    setAgenda("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-royal text-primary-foreground">
          <CalendarPlus className="mr-1 h-4 w-4" />
          New meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New meeting — {cellName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bible Study"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Time</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Leader's home / Zoom link"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Agenda / details</Label>
            <Textarea
              rows={4}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="Topic, scripture, prayer points…"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-gradient-royal text-primary-foreground" onClick={submit}>
            Schedule &amp; notify cell
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
