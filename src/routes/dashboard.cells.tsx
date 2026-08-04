import { useState, useMemo, useSyncExternalStore } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import {
  HeartHandshake,
  Users,
  TrendingUp,
  CheckCircle2,
  CalendarPlus,
  Plus,
  Crown,
  UserPlus,
  Check,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getCells, addCell, subscribeCells } from "@/lib/stores/cells-store";
import {
  getMembers,
  updateMemberRole,
  assignMemberToCell,
  subscribeMembers,
} from "@/lib/stores/members-store";
import { addNotification } from "@/lib/notifications-store";
import {
  getCellMeetings,
  addCellMeeting,
  subscribeCellMeetings,
  type CellMeeting,
} from "@/lib/cell-meetings-store";
import { useCurrentChurch } from "@/lib/current-church";
import { useRole } from "@/lib/role";
import { canManageCells } from "@/lib/permissions";
import { ReportComparison } from "@/components/dashboard/ReportComparison";
import { CellGroup, Member } from "@/types/domain";

export const Route = createFileRoute("/dashboard/cells")({ component: CellsPage });

function CellsPage() {
  const { role, userId, userName } = useRole();
  const { current } = useCurrentChurch();

  const allCells = useSyncExternalStore(subscribeCells, getCells, getCells);
  const meetings = useSyncExternalStore(subscribeCellMeetings, getCellMeetings, getCellMeetings);
  const membersList = useSyncExternalStore(subscribeMembers, getMembers, getMembers);

  const canCreate = canManageCells(role, current.name, current.name);

  // Scoped to current branch for leaders, and restricted to own cell for Cell Leader
  const branchCells = useMemo(() => {
    const bCells = role === "Admin" ? allCells : allCells.filter((c) => c.branch === current.name);
    if (role === "Cell Leader") {
      const myCells = bCells.filter((c) => c.leaderId === userId || c.leader === userName);
      return myCells.length > 0 ? myCells : bCells.slice(0, 1);
    }
    return bCells;
  }, [role, current, allCells, userId, userName]);

  const [activeCellId, setActiveCellId] = useState<string>(branchCells[0]?.id || "c1");

  const activeCell = useMemo(
    () => branchCells.find((c) => c.id === activeCellId) || branchCells[0] || allCells[0],
    [activeCellId, branchCells, allCells],
  );

  const cellMembers = useMemo(
    () =>
      activeCell
        ? membersList.filter(
            (m) =>
              m.branch === activeCell.branch &&
              (m.cell === activeCell.name || m.cellId === activeCell.id),
          )
        : [],
    [membersList, activeCell],
  );

  if (
    role !== "Admin" &&
    role !== "Branch Admin" &&
    role !== "Pastor" &&
    role !== "PCF Leader" &&
    role !== "Cell Leader"
  ) {
    return (
      <SectionCard title="Restricted">
        <p className="text-sm text-muted-foreground">
          Cell Ministry is only available to Pastors, PCF Leaders, and Cell Leaders.
        </p>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cell Ministry"
        subtitle={`Branch Cells · ${current.name}`}
        action={
          <div className="flex items-center gap-2">
            {branchCells.length > 1 && (
              <Tabs value={activeCellId} onValueChange={setActiveCellId}>
                <TabsList className="flex flex-wrap">
                  {branchCells.slice(0, 6).map((c) => (
                    <TabsTrigger key={c.id} value={c.id}>
                      {c.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
            {canCreate && <CreateCellDialog branchName={current.name} membersList={membersList} />}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Members"
          value={cellMembers.length || activeCell.members?.length || 12}
          icon={Users}
          change={5.2}
          accent="primary"
        />
        <StatCard
          label="Attendance"
          value={`${activeCell.attendance || 82}%`}
          icon={TrendingUp}
          change={activeCell.growth || 4.2}
          accent="gold"
        />
        <StatCard label="Branch" value={activeCell.branch} icon={HeartHandshake} accent="blue" />
        <StatCard
          label="Cell Leader"
          value={activeCell.leader || "Unassigned"}
          icon={Crown}
          accent="success"
        />
      </div>

      <Tabs defaultValue="members">
        <TabsList className="flex w-full flex-nowrap overflow-x-auto no-scrollbar justify-start gap-1 h-auto pt-2.5 pb-[15px]">
          <TabsTrigger value="members" className="flex-1 min-w-fit px-4 py-2.5">
            Members
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex-1 min-w-fit px-4 py-2.5">
            Attendance
          </TabsTrigger>
          <TabsTrigger value="meetings" className="flex-1 min-w-fit px-4 py-2.5">
            Meetings
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex-1 min-w-fit px-4 py-2.5">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          <SectionCard
            title={`${activeCell.name} members (${cellMembers.length})`}
            action={
              <AssignMemberToCellDialog
                activeCell={activeCell}
                membersList={membersList}
                onAssigned={() => {}}
              />
            }
          >
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[500px] text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Member</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Stage</th>
                    <th className="px-4 py-3 text-left">Attendance</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {cellMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-secondary/40">
                      <td className="px-4 py-3 font-semibold">
                        <Link
                          to="/dashboard/members/$id"
                          params={{ id: m.id }}
                          className="hover:underline"
                        >
                          {m.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{m.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{m.stage}</td>
                      <td className="px-4 py-3 font-semibold text-primary">
                        {m.attendance || 85}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="ghost" asChild>
                          <Link to="/dashboard/members/$id" params={{ id: m.id }}>
                            Profile
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {cellMembers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                        No members assigned to this cell yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <SectionCard
            title="Recent meetings attendance"
            action={
              <TakeAttendanceDialog
                cell={activeCell}
                cellMembers={cellMembers}
                onCompleted={() => {}}
              />
            }
          >
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[500px] text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Present</th>
                    <th className="px-4 py-3 text-left">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {["2026-05-15", "2026-05-08", "2026-05-01"].map((d, i) => (
                    <tr key={d}>
                      <td className="px-4 py-3">{new Date(d).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{18 - i}</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-success/15 text-success border-success/30">
                          {88 - i * 2}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="meetings" className="mt-4">
          <SectionCard
            title="Cell Meetings Schedule"
            action={
              <NewMeetingDialog
                cellId={activeCell.id}
                cellName={activeCell.name}
                memberCount={cellMembers.length || 10}
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
                    <Badge className="bg-gold-soft text-primary border-gold/30">Meeting</Badge>
                  </li>
                ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <ReportComparison
            label="Cells"
            entities={branchCells.map((c) => ({ id: c.id, name: `${c.name} · ${c.branch}` }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateCellDialog({
  branchName,
  membersList,
}: {
  branchName: string;
  membersList: Member[];
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [leaderId, setLeaderId] = useState("");

  const candidateLeaders = membersList.filter(
    (m) =>
      m.branch === branchName &&
      (m.role === "Cell Leader" || m.role === "PCF Leader" || m.role === "Pastor"),
  );

  const submit = () => {
    if (!name.trim()) {
      toast.error("Cell name is required");
      return;
    }

    const leaderMember = membersList.find((m) => m.id === leaderId);

    const newCell: CellGroup = {
      id: `c${Date.now()}`,
      name: name.trim(),
      branch: branchName,
      leader: leaderMember ? leaderMember.name : "Unassigned Leader",
      leaderId: leaderId || undefined,
      members: leaderId ? [leaderId] : [],
      status: "active",
      attendance: 100,
      growth: 0,
    };

    addCell(newCell);
    toast.success(`Cell Group '${name}' created for ${branchName}`);
    setOpen(false);
    setName("");
    setLeaderId("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-royal text-primary-foreground shadow-elegant">
          <Plus className="mr-1 h-4 w-4" />
          Create Cell Group
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Cell Group — {branchName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label>Cell Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cell C-3"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Assign Cell Leader</Label>
            {candidateLeaders.length === 0 ? (
              <p className="text-xs text-amber-500 bg-amber-500/10 p-2.5 rounded-lg">
                No eligible leaders (Cell Leader, PCF Leader, Pastor) found in {branchName}. Please
                promote a member via their profile first.
              </p>
            ) : (
              <Select value={leaderId} onValueChange={setLeaderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leader from branch..." />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {candidateLeaders.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-gradient-royal text-primary-foreground" onClick={submit}>
            Create Cell
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

function AssignMemberToCellDialog({
  activeCell,
  membersList,
  onAssigned,
}: {
  activeCell: CellGroup;
  membersList: Member[];
  onAssigned: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const unassignedMembers = membersList.filter(
    (m) => m.branch === activeCell.branch && m.cellId !== activeCell.id,
  );

  function submit() {
    if (!selectedMemberId) {
      toast.error("Please select a member");
      return;
    }
    const member = membersList.find((m) => m.id === selectedMemberId);
    assignMemberToCell(selectedMemberId, activeCell.id, activeCell.name);
    toast.success(`Assigned ${member?.name || "Member"} to ${activeCell.name}`);
    onAssigned();
    setOpen(false);
    setSelectedMemberId("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-primary/40 text-primary hover:bg-primary/10"
        >
          <UserPlus className="mr-1 h-4 w-4" />
          Assign Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Member to {activeCell.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label>Select Branch Member</Label>
            {unassignedMembers.length === 0 ? (
              <p className="text-xs text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                All members in {activeCell.branch} are already assigned to this cell.
              </p>
            ) : (
              <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a member..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {unassignedMembers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} {m.cell ? `(${m.cell})` : "(Unassigned)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!selectedMemberId}
            className="bg-gradient-royal text-primary-foreground"
            onClick={submit}
          >
            Assign to Cell
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TakeAttendanceDialog({
  cell,
  cellMembers,
  onCompleted,
}: {
  cell: CellGroup;
  cellMembers: Member[];
  onCompleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set(cellMembers.map((m) => m.id)));

  function togglePresent(id: string) {
    setPresentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function submit() {
    const presentCount = presentIds.size;
    const totalCount = cellMembers.length || 1;
    const rate = Math.round((presentCount / totalCount) * 100);

    toast.success(`Attendance logged for ${cell.name}`, {
      description: `${presentCount}/${totalCount} members present (${rate}%) on ${new Date(date).toLocaleDateString()}`,
    });
    addNotification({
      title: `Cell Attendance Logged: ${cell.name}`,
      desc: `${presentCount}/${totalCount} present (${rate}%) on ${new Date(date).toLocaleDateString()}`,
      time: "Just now",
    });
    onCompleted();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <CheckCircle2 className="mr-1 h-4 w-4" />
          Take Attendance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Take Attendance — {cell.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label>Meeting Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>
                Check Present Members ({presentIds.size}/{cellMembers.length})
              </span>
              <button
                type="button"
                onClick={() => setPresentIds(new Set(cellMembers.map((m) => m.id)))}
                className="text-primary hover:underline"
              >
                Select All
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-border rounded-lg border p-1">
              {cellMembers.map((m) => {
                const checked = presentIds.has(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => togglePresent(m.id)}
                    className="flex w-full items-center justify-between p-2.5 text-sm hover:bg-secondary/40 rounded-md transition"
                  >
                    <span className="font-medium">{m.name}</span>
                    {checked ? (
                      <span className="text-xs bg-emerald-500/10 text-emerald-600 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="h-3 w-3" /> Present
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Absent</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={submit}>
            Save Attendance ({presentIds.size}/{cellMembers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
