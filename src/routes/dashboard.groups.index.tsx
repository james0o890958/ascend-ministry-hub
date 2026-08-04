import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useSyncExternalStore } from "react";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Plus, Phone, Mail, MapPin, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  addSoulToStore,
  getSouls,
  subscribeSouls,
  type Soul,
  type SoulStage as Stage,
} from "@/lib/souls";
import { useCurrentChurch } from "@/lib/current-church";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/dashboard/groups/")({ component: SoulsPage });

// Fixed 4-stage pipeline according to Soul Tracer spec
const stages: Stage[] = ["Contacted", "Visited", "Following Up", "Converted"];

const stageColor: Record<Stage, string> = {
  Contacted: "bg-secondary text-foreground",
  Visited: "bg-primary/10 text-primary border-primary/20",
  "Following Up": "bg-gold-soft text-primary border-gold/30",
  Converted: "bg-success/15 text-success border-success/30",
};

function SoulsPage() {
  const souls = useSyncExternalStore(subscribeSouls, getSouls, getSouls);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Stage | "All">("All");
  const [showArchived, setShowArchived] = useState(false);
  const { current } = useCurrentChurch();
  const { role } = useRole();

  type FormState = Pick<
    Soul,
    "name" | "phone" | "email" | "location" | "stage" | "invitedBy" | "notes"
  >;
  const emptyForm: FormState = {
    name: "",
    phone: "",
    email: "",
    location: "",
    stage: "Contacted",
    invitedBy: "",
    notes: "",
  };
  const [form, setForm] = useState<FormState>(emptyForm);

  const q = query.toLowerCase();
  const filtered = souls.filter((s) => {
    const matchQ =
      !query ||
      s.name.toLowerCase().includes(q) ||
      (s.invitedBy && s.invitedBy.toLowerCase().includes(q)) ||
      (s.soulTracerId && s.soulTracerId.toLowerCase().includes(q)) ||
      s.id.toLowerCase().includes(q);
    const matchF = filter === "All" || s.stage === filter;
    const matchArchived = showArchived ? true : s.status !== "archived" && s.stage !== "Converted";
    const matchBranch = role === "Admin" ? true : s.branch === current.name;
    return matchQ && matchF && matchArchived && matchBranch;
  });

  const addSoul = () => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    const next: Soul = {
      ...form,
      id: `s${Date.now()}`,
      status: "active",
      branch: current.name,
      date: new Date().toISOString().slice(0, 10),
      mentor: "Unassigned",
      badges: [],
      milestones: [],
      prayers: [],
      followUps: [],
      noteLog: [],
      growth: { discipleship: 0, bibleStudy: 0, churchInvolvement: 0, followUpCompletion: 0 },
    };
    addSoulToStore(next);
    setForm(emptyForm);
    setOpen(false);
    toast.success(`${next.name} added to souls`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Souls"
        subtitle="Track every soul reached, invited, and followed up across Christ Embassy"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-royal text-primary-foreground shadow-elegant">
                <Plus className="mr-1 h-4 w-4" />
                Add soul
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add a new soul</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label>Full name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. John Eze"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Phone *</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+234..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="optional"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Location</Label>
                    <Input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Lagos, Nigeria"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Invited by</Label>
                    <Input
                      value={form.invitedBy}
                      onChange={(e) => setForm({ ...form, invitedBy: e.target.value })}
                      placeholder="Inviter name"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Pipeline Stage (4 Stages)</Label>
                  <Select
                    value={form.stage}
                    onValueChange={(v) => setForm({ ...form, stage: v as Stage })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Initial Notes</Label>
                  <Textarea
                    value={form.notes ?? ""}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    placeholder="How they were reached, prayer points..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-gradient-royal text-primary-foreground" onClick={addSoul}>
                  Save soul
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        {(() => {
          const branchSouls = souls.filter((s) =>
            role === "Admin" ? true : s.branch === current.name,
          );
          return (
            <>
              <StatCard
                label="Total active souls"
                value={
                  branchSouls.filter((s) => s.status !== "archived" && s.stage !== "Converted")
                    .length
                }
                icon={Sparkles}
                accent="primary"
              />
              <StatCard
                label="Contacted & Visited"
                value={
                  branchSouls.filter(
                    (s) =>
                      (s.stage === "Contacted" || s.stage === "Visited") && s.status !== "archived",
                  ).length
                }
                icon={Sparkles}
                accent="primary"
              />
              <StatCard
                label="Following up"
                value={
                  branchSouls.filter((s) => s.stage === "Following Up" && s.status !== "archived")
                    .length
                }
                icon={Sparkles}
                accent="gold"
              />
              <StatCard
                label="Converted to Members"
                value={branchSouls.filter((s) => s.stage === "Converted").length}
                icon={CheckCircle2}
                accent="success"
              />
            </>
          );
        })()}
      </div>

      <SectionCard title="Soul Pipeline">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by name, SoulTracer ID, or inviter…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={(v) => setFilter(v as Stage | "All")}>
              <SelectTrigger className="sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All stages</SelectItem>
                {stages.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant={showArchived ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowArchived((v) => !v)}
            className="text-xs"
          >
            {showArchived ? "Hide Converted Souls" : "Show Converted Souls"}
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
              No souls found matching your filter criteria.
            </div>
          ) : (
            filtered.map((s) => (
              <div
                key={s.id}
                className="group relative rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant"
              >
                <div className="flex items-start justify-between">
                  <Link
                    to="/dashboard/groups/$id"
                    params={{ id: s.id }}
                    className="flex items-center gap-3 group-hover:opacity-90"
                  >
                    <Avatar className="h-11 w-11 ring-2 ring-primary/20 transition group-hover:ring-primary/60">
                      <AvatarImage src={s.avatar} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {s.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-display text-lg font-bold group-hover:text-primary transition">
                          {s.name}
                        </h3>
                        <span className="text-[10px] font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/30">
                          {s.soulTracerId || `ST-S-${s.id}`}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Invited by {s.invitedBy || "—"}
                      </p>
                    </div>
                  </Link>
                  <Badge
                    variant="outline"
                    className={stageColor[s.stage as Stage] || "bg-secondary"}
                  >
                    {s.stage}
                  </Badge>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-gold" />
                    {s.phone}
                  </p>
                  {s.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-gold" />
                      {s.email}
                    </p>
                  )}
                  {s.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-gold" />
                      {s.location}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link to="/dashboard/groups/$id" params={{ id: s.id }}>
                      View Profile &amp; Follow Up
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </div>
  );
}
