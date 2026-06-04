import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft, Mail, Phone, MapPin, CalendarDays, Sparkles, Award, Heart, Pencil,
  StickyNote, BellPlus, UserPlus, Flag, Repeat, Plus, X, CheckCircle2, Clock,
  BookOpen, Users, MessageSquare, Activity, Star,
} from "lucide-react";
import { SectionCard } from "@/components/dashboard/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { souls as seed, ALL_BADGES, type Soul, type SoulBadge } from "@/lib/souls";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/groups/$id")({
  loader: ({ params }) => {
    const s = seed.find((x) => x.id === params.id);
    if (!s) throw notFound();
    return s;
  },
  notFoundComponent: () => <div className="p-10 text-center text-muted-foreground">Soul not found.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
  component: SoulProfile,
});

const sections = [
  { id: "overview", label: "Overview" },
  { id: "journey", label: "Spiritual Journey" },
  { id: "prayer", label: "Prayer Requests" },
  { id: "followups", label: "Follow-Up History" },
  { id: "notes", label: "Notes" },
  { id: "growth", label: "Growth Tracker" },
];

const stageColor: Record<string, string> = {
  "Contacted": "bg-secondary text-foreground",
  "Visited": "bg-primary/10 text-primary border-primary/20",
  "Following Up": "bg-gold-soft text-primary border-gold/30",
  "Converted": "bg-success/15 text-success border-success/30",
  "Discipled": "bg-gradient-royal text-primary-foreground border-transparent",
};

function SoulProfile() {
  const loaded = Route.useLoaderData();
  const [soul, setSoul] = useState<Soul>(loaded);
  const [activeSection, setActiveSection] = useState("overview");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-180px 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 150;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  function toggleBadge(b: SoulBadge) {
    setSoul((s) => ({
      ...s,
      badges: s.badges.includes(b) ? s.badges.filter((x) => x !== b) : [...s.badges, b],
    }));
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/dashboard/groups"><ArrowLeft className="mr-1 h-4 w-4" />Back to souls</Link>
      </Button>

      {/* Profile header */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="h-28 bg-gradient-hero" />
        <div className="px-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6 -mt-14">
            <Avatar className="h-28 w-28 ring-4 ring-card shadow-elegant">
              <AvatarImage src={soul.avatar} />
              <AvatarFallback className="text-2xl">{soul.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-2 sm:pt-12">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold sm:text-3xl">{soul.name}</h1>
                <Badge variant="outline" className={stageColor[soul.stage]}>{soul.stage}</Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><UserPlus className="h-4 w-4 text-gold" />Mentor: <strong className="text-foreground">{soul.mentor}</strong></span>
                <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-gold" />Added {new Date(soul.date).toLocaleDateString()}</span>
                {soul.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-gold" />{soul.location}</span>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:pt-12">
              <ActionButton icon={Pencil} label="Edit Soul" />
              <ActionButton icon={StickyNote} label="Add Note" />
              <ActionButton icon={BellPlus} label="Add Prayer" />
              <ActionButton icon={CalendarDays} label="Schedule Follow-Up" />
              <ActionButton icon={UserPlus} label="Assign Leader" />
              <ActionButton icon={Flag} label="Record Milestone" />
              <Button size="sm" className="bg-gradient-royal text-primary-foreground shadow-elegant hover:opacity-95" onClick={() => toast.success(`${soul.name} converted to User`)}>
                <Repeat className="mr-1 h-4 w-4" />Convert to User
              </Button>
            </div>
          </div>

          {/* Quick stats + badges */}
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MiniStat label="Milestones" value={soul.milestones.length} icon={Flag} />
              <MiniStat label="Prayers" value={soul.prayers.length} icon={Heart} />
              <MiniStat label="Follow-ups" value={soul.followUps.length} icon={Activity} />
              <MiniStat label="Growth" value={`${Math.round((soul.growth.discipleship + soul.growth.bibleStudy + soul.growth.churchInvolvement + soul.growth.followUpCompletion) / 4)}%`} icon={Star} />
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold"><Award className="h-4 w-4 text-gold" />Spiritual badges</p>
                <BadgeManager badges={soul.badges} onToggle={toggleBadge} />
              </div>
              <div className="flex flex-wrap gap-2">
                {soul.badges.length === 0 && <span className="text-xs text-muted-foreground">No badges yet — add one to mark spiritual milestones.</span>}
                {soul.badges.map((b) => (
                  <Badge key={b} className="bg-gradient-gold text-gold-foreground border-transparent gap-1">
                    <Sparkles className="h-3 w-3" />{b}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky section nav */}
      <div className="sticky top-16 z-10 -mx-4 sm:-mx-6 lg:-mx-8 border-y border-border bg-background/95 backdrop-blur">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {sections.map((s) => {
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-gradient-royal text-primary-foreground shadow-elegant"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overview */}
      <section id="overview" ref={(el) => { sectionRefs.current.overview = el; }} className="scroll-mt-40">
        <SectionCard title="Overview">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Personal information</h4>
              <Row icon={Phone}>{soul.phone}</Row>
              {soul.email && <Row icon={Mail}>{soul.email}</Row>}
              {soul.location && <Row icon={MapPin}>{soul.location}</Row>}
              <Row icon={UserPlus}>Invited by <strong className="text-foreground">{soul.invitedBy}</strong></Row>
              <Row icon={CalendarDays}>Added {new Date(soul.date).toLocaleDateString()}</Row>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Spiritual summary</h4>
              <div className="rounded-xl bg-secondary/40 p-4 text-sm">
                <p>
                  <strong className="text-foreground">{soul.name}</strong> is currently in the{" "}
                  <strong className="text-foreground">{soul.stage}</strong> stage, mentored by{" "}
                  <strong className="text-foreground">{soul.mentor}</strong>.
                </p>
              </div>
              <h4 className="pt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent activity</h4>
              <ul className="space-y-2 text-sm">
                {[...soul.followUps].slice(0, 3).map((f) => (
                  <li key={f.id} className="flex items-start gap-2 rounded-lg bg-secondary/30 p-3">
                    <Activity className="mt-0.5 h-4 w-4 text-gold" />
                    <div>
                      <p className="font-medium">{f.type} · {f.by}</p>
                      <p className="text-xs text-muted-foreground">{new Date(f.date).toLocaleDateString()} — {f.notes}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>
      </section>

      {/* Spiritual Journey */}
      <section id="journey" ref={(el) => { sectionRefs.current.journey = el; }} className="scroll-mt-40">
        <SectionCard title="Spiritual Journey">
          <ol className="relative space-y-6 border-l-2 border-border pl-6">
            {soul.milestones.map((m, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[33px] grid h-6 w-6 place-items-center rounded-full bg-gradient-royal text-primary-foreground ring-4 ring-background">
                  <Flag className="h-3 w-3" />
                </span>
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-gold/40 bg-gold-soft text-gold-foreground">{m.kind}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(m.date).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-2 font-semibold">{m.title}</p>
                  <p className="text-sm text-muted-foreground">{m.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>
      </section>

      {/* Prayer Requests */}
      <section id="prayer" ref={(el) => { sectionRefs.current.prayer = el; }} className="scroll-mt-40">
        <SectionCard title="Prayer Requests">
          <div className="grid gap-3 sm:grid-cols-2">
            {soul.prayers.map((p) => (
              <div key={p.id} className={cn(
                "rounded-xl border p-4",
                p.status === "Active" ? "border-primary/20 bg-primary/5" : "border-success/20 bg-success/5"
              )}>
                <div className="mb-1 flex items-center justify-between">
                  <Badge variant="outline" className={p.status === "Active" ? "border-primary/30 text-primary" : "border-success/30 text-success"}>
                    {p.status === "Active" ? <Clock className="mr-1 h-3 w-3" /> : <CheckCircle2 className="mr-1 h-3 w-3" />}
                    {p.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm">{p.text}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      {/* Follow-up History */}
      <section id="followups" ref={(el) => { sectionRefs.current.followups = el; }} className="scroll-mt-40">
        <SectionCard title="Follow-Up History">
          <ul className="divide-y divide-border">
            {soul.followUps.map((f) => (
              <li key={f.id} className="flex items-start gap-3 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-gold text-gold-foreground">
                  {f.type === "Call" && <Phone className="h-4 w-4" />}
                  {f.type === "Visit" && <MapPin className="h-4 w-4" />}
                  {f.type === "Meeting" && <Users className="h-4 w-4" />}
                  {f.type === "Message" && <MessageSquare className="h-4 w-4" />}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{f.type} — {f.by}</p>
                    <span className="text-xs text-muted-foreground">{new Date(f.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{f.notes}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </section>

      {/* Notes */}
      <section id="notes" ref={(el) => { sectionRefs.current.notes = el; }} className="scroll-mt-40">
        <SectionCard title="Notes">
          <div className="space-y-3">
            {soul.noteLog.map((n) => (
              <div key={n.id} className="rounded-xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{n.by}</span>
                  <span>{new Date(n.date).toLocaleDateString()}</span>
                </div>
                <p className="mt-1 text-sm">{n.text}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      {/* Growth Tracker */}
      <section id="growth" ref={(el) => { sectionRefs.current.growth = el; }} className="scroll-mt-40">
        <SectionCard title="Growth Tracker">
          <div className="grid gap-4 sm:grid-cols-2">
            <GrowthBar label="Discipleship" value={soul.growth.discipleship} icon={BookOpen} />
            <GrowthBar label="Bible Study" value={soul.growth.bibleStudy} icon={BookOpen} />
            <GrowthBar label="Church Involvement" value={soul.growth.churchInvolvement} icon={Users} />
            <GrowthBar label="Follow-up Completion" value={soul.growth.followUpCompletion} icon={CheckCircle2} />
          </div>
        </SectionCard>
      </section>
    </div>
  );
}

function ActionButton({ icon: Icon, label }: { icon: typeof Pencil; label: string }) {
  return (
    <Button size="sm" variant="outline" onClick={() => toast(label, { description: "Coming soon" })}>
      <Icon className="mr-1 h-4 w-4" />{label}
    </Button>
  );
}

function Row({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-secondary/40 px-3 py-2 text-sm">
      <Icon className="h-4 w-4 text-gold" />
      <span className="text-muted-foreground">{children}</span>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Flag }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-gold" />
      </div>
      <p className="mt-1 font-display text-xl font-bold">{value}</p>
    </div>
  );
}

function GrowthBar({ label, value, icon: Icon }: { label: string; value: number; icon: typeof BookOpen }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium"><Icon className="h-4 w-4 text-gold" />{label}</span>
        <span className="font-display text-sm font-bold">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-gradient-royal transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function BadgeManager({ badges, onToggle }: { badges: SoulBadge[]; onToggle: (b: SoulBadge) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className="h-7"><Plus className="mr-1 h-3 w-3" />Manage</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-2">
        <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Toggle badges</p>
        <div className="grid gap-1">
          {ALL_BADGES.map((b) => {
            const on = badges.includes(b);
            return (
              <button key={b} onClick={() => onToggle(b)} className={cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition",
                on ? "bg-gold-soft text-gold-foreground" : "hover:bg-secondary"
              )}>
                <span className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" />{b}</span>
                {on ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
