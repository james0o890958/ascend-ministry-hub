import { useState, useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  CalendarDays,
  Users,
  TrendingUp,
  Award,
  Shield,
  Shuffle,
  Sparkles,
  CheckSquare,
  Sparkle,
  Repeat,
  UserCheck,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { memberJourney, invitees } from "@/lib/data";
import {
  getMemberById,
  updateMember,
  transferMember,
  toggleMemberMilestone,
  updateMemberRole,
  updateMemberStage,
  type StageSuggestion,
} from "@/lib/stores/members-store";
import { getBranches, getBranchById } from "@/lib/stores/branches-store";
import { useRole } from "@/lib/role";
import { useCurrentChurch } from "@/lib/current-church";
import { canAssignRoles, allowedAssignableRoles, canConfigureBranch } from "@/lib/permissions";
import { Member, Role } from "@/types/domain";

export const Route = createFileRoute("/dashboard/members/$id")({
  loader: ({ params }) => {
    const m = getMemberById(params.id);
    if (!m) throw notFound();
    return m;
  },
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">Member not found.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
  component: MemberDetail,
});

function MemberDetail() {
  const loaded = Route.useLoaderData();
  const [member, setMember] = useState<Member>(loaded);
  const { role: userRole } = useRole();
  const { current } = useCurrentChurch();

  const [suggestion, setSuggestion] = useState<StageSuggestion | null>(null);

  const branch =
    getBranches().find((b) => b.name === member.branch || b.id === member.branch) ||
    getBranchById(current.id);
  const branchStages = branch?.stages || [
    "Invitee",
    "First Timer",
    "Regular Attendee",
    "Baptized Member",
    "Foundation School Student",
    "Foundation School Graduate",
    "Cell Member",
    "Workforce Member",
  ];
  const branchMilestones = branch?.milestones?.filter((m) => m.status === "active") || [];

  const canManageMember = canAssignRoles(userRole, current.name, member.branch);

  const journey = memberJourney(member.id);
  const myInvitees = invitees.filter((i) => i.invitedBy === member.id);
  const attended = journey.filter((j) => j.kind === "Event Attended").length;

  const handleMilestoneToggle = (msId: string, checked: boolean) => {
    const sugg = toggleMemberMilestone(
      member.id,
      msId,
      checked,
      new Date().toISOString().slice(0, 10),
    );
    setMember(getMemberById(member.id)!);
    if (sugg) {
      setSuggestion(sugg);
    }
  };

  const handleAcceptStageSuggestion = () => {
    if (!suggestion) return;
    updateMemberStage(member.id, suggestion.suggestedStage);
    setMember(getMemberById(member.id)!);
    toast.success(`Member stage advanced to ${suggestion.suggestedStage}`);
    setSuggestion(null);
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/dashboard/members">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to membership
        </Link>
      </Button>

      {/* Auto-suggest stage advancement banner (PO Question 1 resolved) */}
      {suggestion && (
        <div className="rounded-xl border border-gold/40 bg-gold-soft p-4 text-primary flex items-center justify-between shadow-soft">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-gold shrink-0" />
            <div>
              <p className="font-bold text-sm">Milestone Complete: {suggestion.milestoneName}</p>
              <p className="text-xs text-muted-foreground">
                Would you like to advance {member.name}'s stage to{" "}
                <strong>{suggestion.suggestedStage}</strong>?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setSuggestion(null)}>
              Dismiss
            </Button>
            <Button
              size="sm"
              className="bg-gradient-royal text-primary-foreground"
              onClick={handleAcceptStageSuggestion}
            >
              Advance Stage
            </Button>
          </div>
        </div>
      )}

      <PageHeader
        title={member.name}
        subtitle={`${member.branch} · ${member.cell || "No Cell Assigned"}`}
        action={
          <div className="flex items-center gap-2">
            {canManageMember && (
              <>
                <PromoteRoleDialog
                  member={member}
                  onUpdated={() => setMember(getMemberById(member.id)!)}
                />
                <TransferBranchDialog
                  member={member}
                  onUpdated={() => setMember(getMemberById(member.id)!)}
                />
              </>
            )}
          </div>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones Catalog</TabsTrigger>
          <TabsTrigger value="history">Journey History</TabsTrigger>
          <TabsTrigger value="invitees">Invitees</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <SectionCard>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-28 w-28 ring-4 ring-gold/40">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <h2 className="mt-4 font-display text-2xl font-bold">{member.name}</h2>
                <div className="mt-1 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                  {member.soulTracerId || `ST-M-2026-${member.id}`}
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                  <Badge className="bg-gradient-gold text-gold-foreground">{member.stage}</Badge>
                  <Badge variant="outline" className="border-primary/40 text-primary">
                    Role: {member.role}
                  </Badge>
                  {member.originType === "evangelism" || member.originSoulId ? (
                    <Badge
                      variant="outline"
                      className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs"
                    >
                      <Sparkles className="mr-1 h-3 w-3" />
                      Won via Evangelism
                    </Badge>
                  ) : member.originType === "transfer" ? (
                    <Badge
                      variant="outline"
                      className="border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs"
                    >
                      <Repeat className="mr-1 h-3 w-3" />
                      Transferred from {member.originBranch || "Branch"}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-muted-foreground/30 text-muted-foreground text-xs"
                    >
                      <UserCheck className="mr-1 h-3 w-3" />
                      Direct Member
                    </Badge>
                  )}
                </div>
                {member.originSoulId && (
                  <Link
                    to="/dashboard/groups/$id"
                    params={{ id: member.originSoulId }}
                    className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-400 underline hover:opacity-80 flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/30"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    View Original Soul Outreach History
                  </Link>
                )}
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <Row icon={Mail}>{member.email}</Row>
                <Row icon={Phone}>{member.phone}</Row>
                <Row icon={MapPin}>{member.branch}</Row>
                <Row icon={CheckCircle2}>
                  Mentor: <span className="font-semibold text-foreground">{member.mentor}</span>
                </Row>
                <Row icon={CalendarDays}>
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </Row>
              </div>
            </SectionCard>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Attendance"
                  value={`${member.attendance || 85}%`}
                  icon={TrendingUp}
                  change={3.2}
                  accent="primary"
                />
                <StatCard
                  label="Events attended"
                  value={attended}
                  icon={CalendarDays}
                  accent="gold"
                />
                <StatCard
                  label="Invitees"
                  value={myInvitees.length}
                  icon={Users}
                  accent="success"
                />
              </div>

              {/* Stage Journey Progress Bar */}
              <SectionCard title="Branch Stage Sequence Progress">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Stage: {member.stage}</span>
                    <span>
                      {branchStages.indexOf(member.stage) + 1} of {branchStages.length}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-gradient-royal transition-all"
                      style={{
                        width: `${((branchStages.indexOf(member.stage) + 1) / branchStages.length) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {branchStages.map((stg, i) => {
                      const isCurrent = stg === member.stage;
                      const isPast = branchStages.indexOf(member.stage) >= i;
                      return (
                        <Badge
                          key={stg}
                          variant={isCurrent ? "default" : "outline"}
                          className={
                            isCurrent
                              ? "bg-gradient-royal text-primary-foreground"
                              : isPast
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "text-muted-foreground opacity-60"
                          }
                        >
                          {stg}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        </TabsContent>

        {/* Milestones Catalog Checklist Tab */}
        <TabsContent value="milestones" className="mt-4">
          <SectionCard title={`Discipleship Milestones — ${member.branch}`}>
            <p className="text-xs text-muted-foreground mb-4">
              Check off completed milestones for {member.name}. Completing key milestones will
              auto-suggest stage advancement.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {branchMilestones.map((ms) => {
                const isCompleted = (member.milestones || []).some(
                  (m) => m.milestoneId === ms.id && m.completed,
                );
                const recordedMs = (member.milestones || []).find((m) => m.milestoneId === ms.id);
                return (
                  <div
                    key={ms.id}
                    className="flex items-start justify-between rounded-xl border border-border bg-card p-4 transition hover:bg-secondary/40"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-sm flex items-center gap-2">
                        <Award className="h-4 w-4 text-gold" />
                        {ms.name}
                      </p>
                      {ms.suggestedStage && (
                        <p className="text-xs text-muted-foreground">
                          Suggests Stage:{" "}
                          <strong className="text-foreground">{ms.suggestedStage}</strong>
                        </p>
                      )}
                      {isCompleted && recordedMs?.date && (
                        <p className="text-[11px] text-success">
                          Completed on {new Date(recordedMs.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={(checked) => handleMilestoneToggle(ms.id, Boolean(checked))}
                    />
                  </div>
                );
              })}
              {branchMilestones.length === 0 && (
                <p className="col-span-full py-8 text-center text-xs text-muted-foreground">
                  No milestone definitions configured for this branch yet.
                </p>
              )}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <SectionCard title="Spiritual journey history">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[500px] text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Event / Role / Group</th>
                    <th className="px-4 py-3 text-left font-semibold">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {journey.map((j, i) => (
                    <tr key={i} className="hover:bg-secondary/40">
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {new Date(j.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{j.kind}</Badge>
                      </td>
                      <td className="px-4 py-3 font-semibold">{j.label}</td>
                      <td className="px-4 py-3 text-muted-foreground">{j.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="invitees" className="mt-4">
          <SectionCard title={`Invited souls (${myInvitees.length})`}>
            {myInvitees.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invitees tracked yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {myInvitees.map((i) => (
                  <li key={i.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold">{i.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.event} · {new Date(i.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">{i.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-secondary/40 px-3 py-2">
      <Icon className="h-4 w-4 text-gold" />
      <span className="truncate text-muted-foreground">{children}</span>
    </div>
  );
}

function PromoteRoleDialog({ member, onUpdated }: { member: Member; onUpdated: () => void }) {
  const [open, setOpen] = useState(false);
  const { role: userRole } = useRole();
  const [newRole, setNewRole] = useState<Role>(member.role);
  const [newStage, setNewStage] = useState(member.stage);

  const allowedRoles = allowedAssignableRoles(userRole);

  const submit = () => {
    updateMemberRole(member.id, newRole);
    updateMemberStage(member.id, newStage);
    onUpdated();
    toast.success(`Updated role/stage for ${member.name}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Shield className="mr-1 h-4 w-4 text-gold" />
          Assign Role &amp; Stage
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Role / Stage — {member.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label>Assigned Role</Label>
            <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allowedRoles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Member Stage</Label>
            <Input value={newStage} onChange={(e) => setNewStage(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-gradient-royal text-primary-foreground" onClick={submit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TransferBranchDialog({ member, onUpdated }: { member: Member; onUpdated: () => void }) {
  const [open, setOpen] = useState(false);
  const branchesList = getBranches();
  const [targetBranch, setTargetBranch] = useState(member.branch);

  const submit = () => {
    if (targetBranch === member.branch) return;
    transferMember(member.id, targetBranch);
    onUpdated();
    toast.success(`${member.name} transferred to ${targetBranch}`, {
      description: "Full discipleship stage, milestones, and giving history preserved.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Shuffle className="mr-1 h-4 w-4" />
          Branch Transfer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer {member.name} to another Branch</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Transferring changes branch and clears local cell assignment. Discipleship stage,
          milestones, and history are preserved intact.
        </p>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label>Target Branch</Label>
            <Select value={targetBranch} onValueChange={setTargetBranch}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branchesList.map((b) => (
                  <SelectItem key={b.id} value={b.name}>
                    {b.name} ({b.country || "Branch"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-gradient-royal text-primary-foreground" onClick={submit}>
            Confirm Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
