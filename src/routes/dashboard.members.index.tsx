import { useMemo, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Eye, Filter, Plus, Search, Upload } from "lucide-react";
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
import { branches, cellGroups, members, myLedCells, STAGES } from "@/lib/data";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/dashboard/members/")({ component: MembersPage });

function MembersPage() {
  const { role } = useRole();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [position, setPosition] = useState<string>("all");
  const [church, setChurch] = useState<string>("all");
  const [cell, setCell] = useState<string>("all");

  // Role-based cell scope
  const visibleCells = useMemo(() => {
    if (role === "Cell Leader") return cellGroups.filter((c) => myLedCells.includes(c.id));
    if (role === "Pastor") return cellGroups.filter((c) => c.branch === branches[0].name);
    return cellGroups;
  }, [role]);
  const visibleCellNames = useMemo(() => new Set(visibleCells.map((c) => c.name)), [visibleCells]);

  const filtered = useMemo(() => members.filter((m) => {
    const s = q.toLowerCase();
    const inScope = role === "Admin" ? true : visibleCellNames.has(m.cell);
    return inScope
      && (!s || m.name.toLowerCase().includes(s) || m.email.toLowerCase().includes(s))
      && (position === "all" || m.stage === position)
      && (church === "all" || m.branch === church)
      && (cell === "all" || m.cell === cell);
  }), [q, position, church, cell, role, visibleCellNames]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Membership"
        subtitle={`${filtered.length.toLocaleString()} souls being shepherded${role === "Admin" ? ` across ${branches.length} churches` : ""}`}
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
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger className="w-[200px]"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue placeholder="Position" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All positions</SelectItem>
              {STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          {role !== "Cell Leader" && (
            <Select value={church} onValueChange={setChurch}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Church" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All churches</SelectItem>
                {branches.map((b) => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          <Select value={cell} onValueChange={setCell}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Cell" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cells</SelectItem>
              {visibleCells.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Member</th>
                <th className="px-4 py-3 text-left font-semibold">Phone</th>
                <th className="px-4 py-3 text-left font-semibold">Position</th>
                <th className="px-4 py-3 text-left font-semibold">Church</th>
                <th className="px-4 py-3 text-left font-semibold">Cell</th>
                <th className="px-4 py-3 text-left font-semibold">Mentor</th>
                <th className="px-4 py-3 text-left font-semibold">Joined</th>
                <th className="px-4 py-3 text-left font-semibold">Attendance</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => navigate({ to: "/dashboard/members/$id", params: { id: m.id } })}
                  className="cursor-pointer transition hover:bg-secondary/40"
                >
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
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{m.phone}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className="border-gold/40 text-primary">{m.stage}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{m.branch}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.cell}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.mentor}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(m.joinedAt).toLocaleDateString()}</td>
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
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button asChild size="sm" variant="outline" className="gap-1">
                      <Link to="/dashboard/members/$id" params={{ id: m.id }}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="py-10 text-center text-muted-foreground">No members match those filters.</td></tr>
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
              <Label>Position</Label>
              <Select defaultValue="First Timer">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Church</Label>
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
