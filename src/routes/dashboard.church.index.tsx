import { useState, useSyncExternalStore } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import {
  Building2,
  Users,
  TrendingUp,
  Crown,
  Settings as SettingsIcon,
  Eye,
  CalendarDays,
  HandCoins,
  Activity,
  ClipboardList,
  FileText,
  Plus,
  Archive,
  ArrowUp,
  ArrowDown,
  Layers,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { recentActivity } from "@/lib/data";
import { getMembers, subscribeMembers } from "@/lib/stores/members-store";
import { getEvents, subscribeEvents } from "@/lib/stores/events-store";
import {
  getBranches,
  updateBranchStages,
  addBranchMilestone,
  archiveBranchMilestone,
  subscribeBranches,
} from "@/lib/stores/branches-store";
import { useRole } from "@/lib/role";
import { useCurrentChurch } from "@/lib/current-church";
import { canConfigureBranch, canSwitchBranch } from "@/lib/permissions";
import { ReportComparison } from "@/components/dashboard/ReportComparison";
import { MilestoneDefinition } from "@/types/domain";

export const Route = createFileRoute("/dashboard/church/")({ component: ChurchPage });

function ChurchPage() {
  const { role } = useRole();
  const { current, currentChurchId, setCurrentChurchId } = useCurrentChurch();
  const branchesList = useSyncExternalStore(subscribeBranches, getBranches, getBranches);
  const membersList = useSyncExternalStore(subscribeMembers, getMembers, getMembers);
  const eventsList = useSyncExternalStore(subscribeEvents, getEvents, getEvents);

  const canSwitch = canSwitchBranch(role);
  const canConfig = canConfigureBranch(role, current.name, current.name);

  const churchMembers = membersList.filter((m) => m.branch === current.name);
  const churchEvents = eventsList.filter((e) => e.branch === current.name || e.scope === "global");
  const churchActivity = recentActivity.filter((a) => a.branch === current.name);
  const giving = 12400 + (current.membersCount || 100) * 3.2;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Church Ministry"
        subtitle={`Branch Moderation · ${current.name}`}
        action={
          <div className="flex items-center gap-2">
            {canSwitch ? (
              <Select value={currentChurchId} onValueChange={setCurrentChurchId}>
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branchesList.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name} · {b.country || "Branch"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className="px-3 py-1 text-xs">
                {current.name} (Locked to your branch)
              </Badge>
            )}

            {canConfig && (
              <ChurchSettingsDialog
                id={current.id}
                name={current.name}
                pastor={current.pastor || "Unassigned"}
                country={current.country || "Nigeria"}
              />
            )}
          </div>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList className="flex w-full flex-nowrap overflow-x-auto no-scrollbar justify-start gap-1 h-auto pt-2.5 pb-[15px]">
          <TabsTrigger value="overview" className="flex-1 min-w-fit px-4 py-2.5">
            Overview
          </TabsTrigger>
          <TabsTrigger value="discipleship" className="flex-1 min-w-fit px-4 py-2.5">
            Stages &amp; Milestones
          </TabsTrigger>
          <TabsTrigger value="members" className="flex-1 min-w-fit px-4 py-2.5">
            Members
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex-1 min-w-fit px-4 py-2.5">
            Attendance
          </TabsTrigger>
          <TabsTrigger value="events" className="flex-1 min-w-fit px-4 py-2.5">
            Events
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex-1 min-w-fit px-4 py-2.5">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Members"
              value={churchMembers.length || current.membersCount || 0}
              icon={Users}
              change={current.growth}
              accent="primary"
            />
            <StatCard
              label="Leaders"
              value={current.leadersCount || 4}
              icon={Crown}
              change={2.1}
              accent="gold"
            />
            <StatCard
              label="Giving (mo.)"
              value={`₦${Math.round(giving).toLocaleString()}`}
              icon={HandCoins}
              change={4.4}
              accent="success"
            />
            <StatCard
              label="Growth"
              value={`${current.growth || 8.5}%`}
              icon={TrendingUp}
              change={1.2}
              accent="blue"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Branch Profile">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-royal text-primary-foreground">
                  <Building2 className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-bold">{current.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {current.country} · Pastor {current.pastor || "Unassigned"}
                  </p>
                </div>
                <Badge className="bg-success/15 text-success border-success/30">
                  +{current.growth || 10}%
                </Badge>
              </div>
            </SectionCard>

            <SectionCard title="Recent Branch Activity">
              <ul className="divide-y divide-border">
                {(churchActivity.length ? churchActivity : recentActivity.slice(0, 4)).map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <span className="font-semibold">{a.who}</span> ·{" "}
                      <span className="text-muted-foreground">{a.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{a.when}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </TabsContent>

        {/* Stages & Milestones Configuration Tab */}
        <TabsContent value="discipleship" className="mt-4 space-y-6">
          <SectionCard title={`Discipleship Stages Sequence — ${current.name}`}>
            <p className="text-xs text-muted-foreground mb-4">
              Configurable stage sequence driving progress visualization for members in{" "}
              {current.name}. The standard sequence starts with <strong>Invitee</strong>.
            </p>
            <StageSequenceManager
              branchId={current.id}
              stages={current.stages || []}
              canEdit={canConfig}
            />
          </SectionCard>

          <SectionCard title={`Branch Milestones Catalog — ${current.name}`}>
            <p className="text-xs text-muted-foreground mb-4">
              Configurable non-sequential milestones catalog for members in {current.name}.
            </p>
            <MilestonesCatalogManager
              branchId={current.id}
              milestones={current.milestones || []}
              canEdit={canConfig}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <SectionCard title={`Members of ${current.name} (${churchMembers.length})`}>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[500px] text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Stage</th>
                    <th className="px-4 py-3 text-left">Cell</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {churchMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-secondary/40">
                      <td className="px-4 py-3 font-semibold">{m.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{m.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{m.stage}</td>
                      <td className="px-4 py-3 text-muted-foreground">{m.cell || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild size="sm" variant="ghost">
                          <Link to="/dashboard/members/$id" params={{ id: m.id }}>
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            View Profile
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {churchMembers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                        No members assigned to this branch yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <SectionCard title="Attendance trend">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[500px] text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Service</th>
                    <th className="px-4 py-3 text-left">Present</th>
                    <th className="px-4 py-3 text-left">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {["Sun May 17", "Wed May 14", "Sun May 10", "Wed May 7"].map((d, i) => (
                    <tr key={d}>
                      <td className="px-4 py-3">{d}</td>
                      <td className="px-4 py-3">{1800 - i * 120}</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-success/15 text-success border-success/30">
                          {85 - i * 2}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <SectionCard title="Branch Events">
            <ul className="divide-y divide-border">
              {(churchEvents.length ? churchEvents : eventsList).map((e) => (
                <li key={e.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold">{e.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.date).toLocaleDateString()} · {e.type}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/dashboard/events/$id" params={{ id: e.id }}>
                      View
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <ReportComparison
            label="Churches"
            entities={branchesList.map((b) => ({ id: b.id, name: b.name }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StageSequenceManager({
  branchId,
  stages,
  canEdit,
}: {
  branchId: string;
  stages: string[];
  canEdit: boolean;
}) {
  const [stageList, setStageList] = useState<string[]>(stages);
  const [newStage, setNewStage] = useState("");

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const copy = [...stageList];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setStageList(copy);
    updateBranchStages(branchId, copy);
    toast.success("Stage reordered");
  };

  const moveDown = (idx: number) => {
    if (idx >= stageList.length - 1) return;
    const copy = [...stageList];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    setStageList(copy);
    updateBranchStages(branchId, copy);
    toast.success("Stage reordered");
  };

  const addStage = () => {
    if (!newStage.trim()) return;
    if (stageList.includes(newStage.trim())) {
      toast.error("Stage already exists");
      return;
    }
    const updated = [...stageList, newStage.trim()];
    setStageList(updated);
    updateBranchStages(branchId, updated);
    setNewStage("");
    toast.success(`Stage '${newStage}' added`);
  };

  const archiveStage = (stg: string) => {
    if (stageList.length <= 1) {
      toast.error("Cannot archive the only stage");
      return;
    }
    const updated = stageList.filter((s) => s !== stg);
    setStageList(updated);
    updateBranchStages(branchId, updated);
    toast.success(`Stage '${stg}' archived`);
  };

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex gap-2 max-w-md">
          <Input
            placeholder="Add new stage (e.g. Workers Class)..."
            value={newStage}
            onChange={(e) => setNewStage(e.target.value)}
          />
          <Button onClick={addStage} className="bg-gradient-royal text-primary-foreground">
            <Plus className="h-4 w-4 mr-1" />
            Add Stage
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-border divide-y divide-border bg-card">
        {stageList.map((stg, i) => (
          <div key={stg} className="flex items-center justify-between p-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary font-mono text-xs font-bold">
                {i + 1}
              </span>
              <span className="font-semibold">{stg}</span>
              {i === 0 && (
                <Badge variant="outline" className="text-[10px]">
                  Default Entry
                </Badge>
              )}
            </div>

            {canEdit && (
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => moveDown(i)}
                  disabled={i === stageList.length - 1}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive"
                  onClick={() => archiveStage(stg)}
                >
                  <Archive className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MilestonesCatalogManager({
  branchId,
  milestones,
  canEdit,
}: {
  branchId: string;
  milestones: MilestoneDefinition[];
  canEdit: boolean;
}) {
  const [msList, setMsList] = useState<MilestoneDefinition[]>(milestones);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [suggestedStage, setSuggestedStage] = useState("");

  const activeMilestones = msList.filter((m) => m.status === "active");

  const handleAdd = () => {
    if (!name.trim()) return;
    const newMs: MilestoneDefinition = {
      id: `ms-${branchId}-${Date.now()}`,
      branchId,
      name: name.trim(),
      status: "active",
      suggestedStage: suggestedStage || undefined,
    };
    addBranchMilestone(branchId, newMs);
    setMsList([...msList, newMs]);
    setName("");
    setSuggestedStage("");
    setOpen(false);
    toast.success(`Milestone '${newMs.name}' added`);
  };

  const handleArchive = (id: string, msName: string) => {
    archiveBranchMilestone(branchId, id);
    setMsList(msList.map((m) => (m.id === id ? { ...m, status: "archived" } : m)));
    toast.success(`Milestone '${msName}' archived`);
  };

  return (
    <div className="space-y-4">
      {canEdit && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-royal text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" />
              Add Milestone Definition
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Milestone Definition</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label>Milestone Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. School of Ministry"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Auto-Suggest Stage Advance (Optional)</Label>
                <Input
                  value={suggestedStage}
                  onChange={(e) => setSuggestedStage(e.target.value)}
                  placeholder="e.g. Foundation School Graduate"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} className="bg-gradient-royal text-primary-foreground">
                Save Milestone
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {activeMilestones.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-border bg-card p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-sm flex items-center gap-2">
                <Flag className="h-4 w-4 text-gold" />
                {m.name}
              </p>
              {m.suggestedStage && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Suggests stage:{" "}
                  <span className="font-medium text-foreground">{m.suggestedStage}</span>
                </p>
              )}
            </div>
            {canEdit && (
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={() => handleArchive(m.id, m.name)}
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {activeMilestones.length === 0 && (
          <p className="col-span-full py-6 text-center text-xs text-muted-foreground">
            No active milestone definitions for this branch yet.
          </p>
        )}
      </div>
    </div>
  );
}

function ChurchSettingsDialog({
  id,
  name,
  pastor,
  country,
}: {
  id: string;
  name: string;
  pastor: string;
  country: string;
}) {
  const [open, setOpen] = useState(false);
  const [churchName, setChurchName] = useState(name);
  const [countryVal, setCountryVal] = useState(country);
  const [pastorVal, setPastorVal] = useState(pastor);

  function submit() {
    toast.success(`${churchName} settings updated`);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <SettingsIcon className="mr-1 h-3.5 w-3.5" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{churchName} · Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label>Church name</Label>
            <Input value={churchName} onChange={(e) => setChurchName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Country</Label>
              <Input value={countryVal} onChange={(e) => setCountryVal(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Senior pastor</Label>
              <Input value={pastorVal} onChange={(e) => setPastorVal(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-gradient-royal text-primary-foreground" onClick={submit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
