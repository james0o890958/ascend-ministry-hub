import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Sparkles, Plus, Phone, Mail, MapPin, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/groups")({ component: SoulsPage });

type Stage = "Contacted" | "Visited" | "Following Up" | "Converted" | "Discipled";

type Soul = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  stage: Stage;
  invitedBy: string;
  notes?: string;
  date: string;
};

const seed: Soul[] = [
  { id: "s1", name: "Tunde Adebola", phone: "+234 803 111 2233", email: "tunde@mail.com", location: "Lagos", stage: "Visited", invitedBy: "Grace Adeyemi", date: "2026-05-22" },
  { id: "s2", name: "Ngozi Eze", phone: "+234 805 444 7788", location: "Abuja", stage: "Following Up", invitedBy: "Daniel Okafor", date: "2026-05-18" },
  { id: "s3", name: "Samuel Bassey", phone: "+234 802 998 1212", email: "sam@mail.com", stage: "Converted", invitedBy: "Esther Adebayo", date: "2026-04-30" },
  { id: "s4", name: "Aisha Mohammed", phone: "+234 809 222 4455", location: "Kaduna", stage: "Contacted", invitedBy: "Michael Bello", date: "2026-05-28" },
];

const stages: Stage[] = ["Contacted", "Visited", "Following Up", "Converted", "Discipled"];

const stageColor: Record<Stage, string> = {
  "Contacted": "bg-secondary text-foreground",
  "Visited": "bg-primary/10 text-primary border-primary/20",
  "Following Up": "bg-gold-soft text-primary border-gold/30",
  "Converted": "bg-success/15 text-success border-success/30",
  "Discipled": "bg-gradient-royal text-primary-foreground border-transparent",
};

function SoulsPage() {
  const [souls, setSouls] = useState<Soul[]>(seed);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Stage | "All">("All");
  const [form, setForm] = useState<Omit<Soul, "id" | "date">>({
    name: "", phone: "", email: "", location: "", stage: "Contacted", invitedBy: "", notes: "",
  });

  const filtered = souls.filter((s) => {
    const matchQ = s.name.toLowerCase().includes(query.toLowerCase()) || s.invitedBy.toLowerCase().includes(query.toLowerCase());
    const matchF = filter === "All" || s.stage === filter;
    return matchQ && matchF;
  });

  const addSoul = () => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    const next: Soul = {
      ...form,
      id: `s${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
    };
    setSouls([next, ...souls]);
    setForm({ name: "", phone: "", email: "", location: "", stage: "Contacted", invitedBy: "", notes: "" });
    setOpen(false);
    toast.success(`${next.name} added to souls`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Souls"
        subtitle="Track every soul reached, invited and discipled"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-royal text-primary-foreground"><Plus className="mr-1 h-4 w-4"/>Add soul</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>Add a new soul</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2"><Label>Full name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. John Eze" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label>Phone *</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234..." /></div>
                  <div className="grid gap-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="optional" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                  <div className="grid gap-2"><Label>Invited by</Label><Input value={form.invitedBy} onChange={(e) => setForm({ ...form, invitedBy: e.target.value })} /></div>
                </div>
                <div className="grid gap-2">
                  <Label>Stage</Label>
                  <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v as Stage })}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>{stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}/></div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button className="bg-gradient-royal text-primary-foreground" onClick={addSoul}>Save soul</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total souls" value={souls.length} icon={Sparkles} accent="primary"/>
        <StatCard label="Following up" value={souls.filter((s) => s.stage === "Following Up").length} icon={Sparkles} accent="gold"/>
        <StatCard label="Converted" value={souls.filter((s) => s.stage === "Converted").length} icon={Sparkles} accent="success"/>
        <StatCard label="Discipled" value={souls.filter((s) => s.stage === "Discipled").length} icon={Sparkles} accent="primary"/>
      </div>

      <SectionCard title="All souls">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
            <Input className="pl-9" placeholder="Search by name or inviter…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as Stage | "All")}>
            <SelectTrigger className="sm:w-48"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All stages</SelectItem>
              {stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant">
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-royal text-primary-foreground"><Sparkles className="h-5 w-5"/></span>
                <Badge variant="outline" className={stageColor[s.stage]}>{s.stage}</Badge>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold">{s.name}</h3>
              <p className="text-xs text-muted-foreground">Invited by {s.invitedBy || "—"} · {new Date(s.date).toLocaleDateString()}</p>
              <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gold"/>{s.phone}</p>
                {s.email && <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gold"/>{s.email}</p>}
                {s.location && <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gold"/>{s.location}</p>}
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">View</Button>
                <Button size="sm" variant="ghost" onClick={() => toast.success("Follow-up logged")}>Follow up</Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-muted-foreground">No souls match your filters.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
