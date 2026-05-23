import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, MapPin, CheckCircle2, CalendarDays, Users, TrendingUp } from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { members, memberJourney, invitees } from "@/lib/data";

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
  const journey = memberJourney(m.id);
  const myInvitees = invitees.filter((i) => i.invitedBy === m.id);
  const attended = journey.filter((j) => j.kind === "Event Attended").length;

  const kindColor: Record<string, string> = {
    "Event Attended": "bg-primary/10 text-primary border-primary/20",
    "Role Held": "bg-gold-soft text-primary border-gold/30",
    "Group Joined": "bg-success/15 text-success border-success/30",
    "Stage": "bg-gradient-gold text-gold-foreground border-transparent",
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/dashboard/members"><ArrowLeft className="mr-1 h-4 w-4" />Back to membership</Link>
      </Button>

      <PageHeader title={m.name} subtitle={`${m.branch} · ${m.cell}`} />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="invitees">Invitees</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <SectionCard>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-28 w-28 ring-4 ring-gold/40">
                  <AvatarImage src={m.avatar} /><AvatarFallback>{m.name[0]}</AvatarFallback>
                </Avatar>
                <h2 className="mt-4 font-display text-2xl font-bold">{m.name}</h2>
                <Badge className="mt-2 bg-gradient-gold text-gold-foreground">{m.stage}</Badge>
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <Row icon={Mail}>{m.email}</Row>
                <Row icon={Phone}>{m.phone}</Row>
                <Row icon={MapPin}>{m.branch}</Row>
                <Row icon={CheckCircle2}>Mentor: <span className="font-semibold text-foreground">{m.mentor}</span></Row>
                <Row icon={CalendarDays}>Joined {new Date(m.joinedAt).toLocaleDateString()}</Row>
              </div>
            </SectionCard>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Attendance" value={`${m.attendance}%`} icon={TrendingUp} change={3.2} accent="primary" />
                <StatCard label="Events attended" value={attended} icon={CalendarDays} accent="gold" />
                <StatCard label="Invitees" value={myInvitees.length} icon={Users} accent="success" />
              </div>
              <SectionCard title="Discipleship summary">
                <p className="text-sm text-muted-foreground">
                  {m.name} is currently a <strong className="text-foreground">{m.stage}</strong> serving in <strong className="text-foreground">{m.cell}</strong> at <strong className="text-foreground">{m.branch}</strong>. Mentored by {m.mentor}.
                </p>
              </SectionCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <SectionCard title="Spiritual journey">
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
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
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{new Date(j.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className={kindColor[j.kind]}>{j.kind}</Badge></td>
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
                      <p className="text-xs text-muted-foreground">{i.event} · {new Date(i.date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline">{i.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <SectionCard title="Attendance record">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-gradient-royal" style={{ width: `${m.attendance}%` }} />
              </div>
              <span className="font-display text-lg font-bold">{m.attendance}%</span>
            </div>
            <ul className="divide-y divide-border">
              {journey.filter((j) => j.kind === "Event Attended").map((j, i) => (
                <li key={i} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold">{j.label}</p>
                    <p className="text-xs text-muted-foreground">{j.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(j.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
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
