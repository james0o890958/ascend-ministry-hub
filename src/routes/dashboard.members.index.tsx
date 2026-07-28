import { useMemo, useState, useSyncExternalStore } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Eye, Filter, Plus, Search, Upload } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { branches, cellGroups, myLedCells, STAGES } from "@/lib/data";
import { getMembers, addMember, importMembers, subscribeMembers } from "@/lib/members-store";
import { useCurrentChurch } from "@/lib/current-church";
import { useRole } from "@/lib/role";
import { toast } from "sonner";
import { type Member, type Stage } from "@/lib/data";

export const Route = createFileRoute("/dashboard/members/")({ component: MembersPage });

function MembersPage() {
  const { role } = useRole();
  const navigate = useNavigate();
  const { currentChurchId } = useCurrentChurch();
  const currentChurch = branches.find((b) => b.id === currentChurchId) ?? branches[0];
  const memberList = useSyncExternalStore(subscribeMembers, getMembers, getMembers);

  const [q, setQ] = useState("");
  const [position, setPosition] = useState<string>("all");
  const [church, setChurch] = useState<string>("all");
  const [cell, setCell] = useState<string>("all");

  const filtered = useMemo(
    () =>
      memberList.filter((m) => {
        const s = q.toLowerCase();
        const matchesBranch =
          currentChurchId === "all" || m.branch === currentChurch.name || church !== "all";
        return (
          matchesBranch &&
          (!s || m.name.toLowerCase().includes(s) || m.email.toLowerCase().includes(s)) &&
          (position === "all" || m.stage === position) &&
          (church === "all" || m.branch === church) &&
          (cell === "all" || m.cell === cell)
        );
      }),
    [memberList, q, position, church, cell, currentChurchId, currentChurch],
  );

  const handleAddMember = (m: Member) => {
    setMemberList((prev) => [m, ...prev]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Membership"
        subtitle={`${filtered.length.toLocaleString()} souls being shepherded${role === "Admin" ? ` across ${branches.length} churches` : ""}`}
        action={
          <>
            <ImportMembersDialog onImported={importMembers} />
            <AddMemberDialog onAdded={addMember} />
          </>
        }
      />

      <SectionCard>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email"
              className="pl-9"
            />
          </div>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-1 h-3.5 w-3.5" />
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All positions</SelectItem>
              {STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {role !== "Cell Leader" && (
            <Select value={church} onValueChange={setChurch}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Church" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All churches</SelectItem>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.name}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select value={cell} onValueChange={setCell}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Cell" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cells</SelectItem>
              {visibleCells.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
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
                        <AvatarImage src={m.avatar} />
                        <AvatarFallback>{m.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{m.phone}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="border-gold/40 text-primary">
                      {m.stage}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{m.branch}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.cell}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.mentor}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(m.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-gradient-royal"
                          style={{ width: `${m.attendance}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold">{m.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={
                        m.status === "active"
                          ? "bg-success/15 text-success border-success/30"
                          : "bg-muted text-muted-foreground"
                      }
                    >
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
                <tr>
                  <td colSpan={10} className="py-10 text-center text-muted-foreground">
                    No members match those filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function AddMemberDialog({ onAdded }: { onAdded: (m: Member) => void }) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<Stage>("First Timer");
  const [branch, setBranch] = useState(branches[0].name);
  const [cell, setCell] = useState(cellGroups[0].name);

  function submit() {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }
    const name = `${firstName.trim()} ${lastName.trim()}`;
    const newMember: Member = {
      id: `m${Date.now()}`,
      name,
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@ministry.org`,
      phone: phone.trim() || "+234 800 000 0000",
      branch,
      stage,
      joinedAt: new Date().toISOString(),
      mentor: "Unassigned",
      attendance: 100,
      cell,
      avatar: `https://i.pravatar.cc/120?img=${(Date.now() % 70) + 1}`,
      status: "active",
    };
    onAdded(newMember);
    toast.success(`Member ${name} registered successfully`);
    setOpen(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-royal text-primary-foreground shadow-soft hover:opacity-90">
          <Plus className="mr-1 h-4 w-4" />
          Add member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add new member</DialogTitle>
          <DialogDescription>Register a soul into the discipleship journey.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>First name *</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Esther"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Last name *</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Adebayo"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="esther@ministry.org"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 800..."
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Position</Label>
              <Select value={stage} onValueChange={(v) => setStage(v as Stage)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Church</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.name}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Cell</Label>
              <Select value={cell} onValueChange={setCell}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cellGroups.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-gradient-royal text-primary-foreground" onClick={submit}>
            Save member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImportMembersDialog({ onImported }: { onImported: (members: Member[]) => void }) {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  }

  function handleImport() {
    const sampleImported: Member[] = [
      {
        id: `m_imp_${Date.now()}_1`,
        name: "Emmanuel Chukwu",
        email: "emmanuel.c@ministry.org",
        phone: "+234 803 555 1212",
        branch: branches[0].name,
        stage: "First Timer",
        joinedAt: new Date().toISOString(),
        mentor: "Pst. Daniel Okafor",
        attendance: 100,
        cell: cellGroups[0].name,
        avatar: "https://i.pravatar.cc/120?img=60",
        status: "active",
      },
      {
        id: `m_imp_${Date.now()}_2`,
        name: "Mercy Olawale",
        email: "mercy.o@ministry.org",
        phone: "+234 805 777 3434",
        branch: branches[0].name,
        stage: "Invitee",
        joinedAt: new Date().toISOString(),
        mentor: "Grace Adeyemi",
        attendance: 80,
        cell: cellGroups[1].name,
        avatar: "https://i.pravatar.cc/120?img=44",
        status: "active",
      },
    ];
    onImported(sampleImported);
    toast.success(`Successfully imported 2 members${fileName ? ` from ${fileName}` : ""}`);
    setOpen(false);
    setFileName("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-1 h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import members CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel roster file to bulk-import members.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3 text-sm">
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-gold" />
            <p className="mt-2 font-medium">Click to select CSV file</p>
            <p className="text-xs text-muted-foreground">
              Columns: Name, Email, Phone, Branch, Cell, Position
            </p>
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="mt-3 block w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-secondary file:px-2 file:py-1"
            />
          </div>
          {fileName && <p className="text-xs font-semibold text-primary">Selected: {fileName}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-gradient-royal text-primary-foreground" onClick={handleImport}>
            Run import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
