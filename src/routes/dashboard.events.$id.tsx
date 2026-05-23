import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Users, UserPlus, CalendarDays, MapPin, CheckCircle2 } from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { events, members, invitees, attendanceForDate } from "@/lib/data";

export const Route = createFileRoute("/dashboard/events/$id")({
  loader: ({ params }) => {
    const e = events.find((x) => x.id === params.id);
    if (!e) throw notFound();
    return e;
  },
  notFoundComponent: () => <div className="p-10 text-center text-muted-foreground">Event not found.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
  component: EventDetail,
});

function EventDetail() {
  const e = Route.useLoaderData();
  const attendedIds = new Set(attendanceForDate(e.date));
  const attendees = members.filter((m) => attendedIds.has(m.id));
  const eventInvitees = invitees.filter((i) => i.event === e.name);
  const pct = Math.min(100, Math.round((e.attendees / e.capacity) * 100));
  const d = new Date(e.date);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/dashboard/events"><ArrowLeft className="mr-1 h-4 w-4" />Back to Events</Link>
      </Button>

      <PageHeader
        title={e.name}
        subtitle={`${d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · ${e.branch}`}
        action={<Badge className="bg-gradient-gold text-gold-foreground border-transparent">{e.type}</Badge>}
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Attendees" value={e.attendees.toLocaleString()} icon={Users} change={4.2} accent="primary" />
            <StatCard label="Capacity" value={e.capacity.toLocaleString()} icon={CalendarDays} accent="gold" />
            <StatCard label="Invitations" value={eventInvitees.length} icon={UserPlus} accent="blue" />
            <StatCard label="Fill rate" value={`${pct}%`} icon={CheckCircle2} change={1.6} accent="success" />
          </div>

          <SectionCard title="Event details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info icon={CalendarDays} label="Date" value={d.toLocaleDateString()} />
              <Info icon={MapPin} label="Church" value={e.branch} />
              <Info icon={Users} label="Capacity" value={e.capacity.toLocaleString()} />
              <Info icon={CheckCircle2} label="Type" value={e.type} />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="invitations" className="mt-4">
          <SectionCard title={`Invitations (${eventInvitees.length})`}>
            {eventInvitees.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invitations sent for this event.</p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left">Invitee</th>
                      <th className="px-4 py-3 text-left">Invited</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {eventInvitees.map((i) => (
                      <tr key={i.id} className="hover:bg-secondary/40">
                        <td className="px-4 py-3 font-semibold">{i.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{new Date(i.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3"><Badge variant="outline">{i.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="attendees" className="mt-4">
          <SectionCard title={`Attendees (${attendees.length})`}>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-4 py-3 text-left">Member</th><th className="px-4 py-3 text-left">Church</th><th className="px-4 py-3 text-left">Position</th></tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {attendees.map((m) => (
                    <tr key={m.id} className="hover:bg-secondary/40">
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarImage src={m.avatar}/><AvatarFallback>{m.name[0]}</AvatarFallback></Avatar><span className="font-semibold">{m.name}</span></div></td>
                      <td className="px-4 py-3 text-muted-foreground">{m.branch}</td>
                      <td className="px-4 py-3"><Badge variant="outline">{m.stage}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-secondary/40 p-4">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-royal text-primary-foreground"><Icon className="h-5 w-5"/></span>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-display text-base font-bold">{value}</p>
      </div>
    </div>
  );
}
