import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Filter, Plus, Search, Upload } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { branches, members, STAGES } from "@/lib/data";

export const Route = createFileRoute("/dashboard/members")({ component: MembersPage });

function MembersPage() {
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<string>("all");
  const [branch, setBranch] = useState<string>("all");

  const filtered = useMemo(() => members.filter((m) => {
    const s = q.toLowerCase();
    return (!s || m.name.toLowerCase().includes(s) || m.email.toLowerCase().includes(s))
      && (stage === "all" || m.stage === stage)
      && (branch === "all" || m.branch === branch);
  }), [q, stage, branch]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        subtitle={`${members.length.toLocaleString()} souls being shepherded across ${branches.length} branches`}
        action={
          <>
            <Button variant="outline"><Upload className="mr-1 h-4 w-4" />Import</Button>
            <AddMemberDialog />
          </>
        }
      />

      <SectionCard>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email" className="pl-9" />
          </div>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="w-[200px]"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue placeholder="Stage" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="w-[220px]"><SelectValue placeholder="Branch" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All branches</SelectItem>
              {branches.map((b) => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Member</th>
                <th className="px-4 py-3 text-left font-semibold">Stage</th>
                <th className="px-4 py-3 text-left font-semibold">Branch</th>
                <th className="px-4 py-3 text-left font-semibold">Cell</th>
                <th className="px-4 py-3 text-left font-semibold">Mentor</th>
                <th className="px-4 py-3 text-left font-semibold">Attendance</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {filtered.map((m) => (
                <tr key={m.id} className="transition hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-1 ring-gold/30">
                        <AvatarImage src={m.avatar} /><AvatarFallback>{m.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className="border-gold/40 text-primary">{m.stage}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{m.branch}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.cell}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.mentor}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-gradient-royal" style={{ width: `${m.attendance}%` }} />
                      </div>
                      <span className="text-xs font-semibold">{m.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={m.status === "active" ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground"}>
                      {m.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/dashboard/members/$id" params={{ id: m.id }}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-10 text-center text-muted-foreground">No members match those filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function AddMemberDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-royal text-primary-foreground shadow-soft hover:opacity-90">
          <Plus className="mr-1 h-4 w-4" />Add member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add new member</DialogTitle>
          <DialogDescription>Register a soul into the discipleship journey.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-gold/40"><AvatarFallback>+</AvatarFallback></Avatar>
            <Button variant="outline" size="sm"><Upload className="mr-1 h-4 w-4" />Upload photo</Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>First name</Label><Input placeholder="Esther" /></div>
            <div className="space-y-1.5"><Label>Last name</Label><Input placeholder="Adebayo" /></div>
          </div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="esther@ministry.org" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Stage</Label>
              <Select defaultValue="First Timer">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Branch</Label>
              <Select defaultValue={branches[0].id}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button className="bg-gradient-royal text-primary-foreground">Save member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
