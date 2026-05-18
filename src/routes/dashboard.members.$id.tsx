import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, MapPin, CheckCircle2, Circle, MessageSquare } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { members, STAGES } from "@/lib/data";

export const Route = createFileRoute("/dashboard/members/$id")({
  loader: ({ params }) => {
    const m = members.find((x) => x.id === params.id);
    if (!m) throw notFound();
    return m;
  },
  notFoundComponent: () => <div className="p-10 text-center text-muted-foreground">Member not found.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
  component: MemberDetail,
});

function MemberDetail() {
  const m = Route.useLoaderData();
  const currentIdx = STAGES.indexOf(m.stage);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/dashboard/members"><ArrowLeft className="mr-1 h-4 w-4" />Back to members</Link>
      </Button>

      <PageHeader
        title={m.name}
        subtitle={`Member since ${new Date(m.joinedAt).toLocaleDateString(undefined, { year: "numeric", month: "long" })}`}
        action={<><Button variant="outline">Edit profile</Button><Button className="bg-gradient-royal text-primary-foreground">Advance stage</Button></>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Profile card */}
        <SectionCard className="lg:row-span-2">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="h-28 w-28 ring-4 ring-gold/40">
                <AvatarImage src={m.avatar} /><AvatarFallback>{m.name[0]}</AvatarFallback>
              </Avatar>
              <Badge className="absolute -bottom-1 right-0 bg-gradient-gold text-gold-foreground">{m.stage}</Badge>
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">{m.name}</h2>
            <p className="text-sm text-muted-foreground">{m.branch}</p>
            <div className="mt-5 grid w-full grid-cols-3 gap-2 text-center">
              <Stat label="Attendance" value={`${m.attendance}%`} />
              <Stat label="Cell" value={m.cell} />
              <Stat label="Status" value={m.status} />
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <Row icon={Mail}>{m.email}</Row>
            <Row icon={Phone}>{m.phone}</Row>
            <Row icon={MapPin}>{m.branch}</Row>
            <Row icon={CheckCircle2}>Mentor: <span className="font-semibold text-foreground">{m.mentor}</span></Row>
          </div>
        </SectionCard>

        <Tabs defaultValue="journey" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="journey">Journey</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="journey">
            <SectionCard title="Spiritual growth timeline">
              <ol className="relative space-y-3 border-l-2 border-dashed border-border pl-6">
                {STAGES.map((s, i) => {
                  const done = i <= currentIdx;
                  const current = i === currentIdx;
                  return (
                    <li key={s} className="relative">
                      <span className={`absolute -left-[34px] grid h-6 w-6 place-items-center rounded-full ring-4 ring-background ${done ? "bg-gradient-gold" : "bg-secondary"}`}>
                        {done ? <CheckCircle2 className="h-4 w-4 text-gold-foreground" /> : <Circle className="h-3 w-3 text-muted-foreground" />}
                      </span>
                      <div className={`rounded-xl border p-4 ${current ? "border-gold/60 bg-gold-soft/40 shadow-soft" : done ? "border-border bg-card" : "border-dashed border-border bg-secondary/30"}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold">{s}</p>
                          {done && <Badge variant="outline" className="border-gold/40 text-primary">{current ? "Current" : "Completed"}</Badge>}
                        </div>
                        {done && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Completed {new Date(2023, i, (i * 5) % 27 + 1).toLocaleDateString()} • Mentor: {m.mentor}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </SectionCard>
          </TabsContent>

          <TabsContent value="attendance">
            <SectionCard title="Attendance summary">
              <div className="grid gap-4 sm:grid-cols-3">
                {[["Sunday Service", 92], ["Midweek", 78], ["Cell Meeting", 85]].map(([label, val]) => (
                  <div key={label as string} className="rounded-xl border border-border p-4">
                    <p className="text-sm text-muted-foreground">{label as string}</p>
                    <p className="mt-1 font-display text-2xl font-bold">{val as number}%</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-gradient-royal" style={{ width: `${val as number}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="notes">
            <SectionCard title="Pastoral notes">
              <div className="space-y-3">
                {[
                  { who: "Pst. D. Okafor", when: "2 days ago", note: "Excellent growth in foundation class. Recommended for cell leadership track next quarter." },
                  { who: "Bro. Samuel", when: "1 week ago", note: "Attended baptism preparation session — very engaged." },
                ].map((n, i) => (
                  <div key={i} className="rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{n.who}</span><span>{n.when}</span>
                    </div>
                    <p className="mt-2 text-sm">{n.note}</p>
                  </div>
                ))}
                <div className="rounded-xl border border-dashed border-border p-3">
                  <Textarea placeholder="Add a pastoral note…" rows={3} />
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" className="bg-gradient-royal text-primary-foreground"><MessageSquare className="mr-1 h-4 w-4" />Post note</Button>
                  </div>
                </div>
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-secondary/60 p-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-bold capitalize">{value}</p>
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
