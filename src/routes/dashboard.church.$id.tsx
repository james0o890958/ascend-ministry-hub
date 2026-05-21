import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Building2, Users, TrendingUp, Crown, HeartHandshake, CalendarDays } from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { branches, cellGroups, members, events } from "@/lib/data";

export const Route = createFileRoute("/dashboard/church/$id")({
  loader: ({ params }) => {
    const b = branches.find((x) => x.id === params.id);
    if (!b) throw notFound();
    return b;
  },
  notFoundComponent: () => <div className="p-10 text-center text-muted-foreground">Church not found.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
  component: ChurchDetail,
});

function ChurchDetail() {
  const b = Route.useLoaderData();
  const churchCells = cellGroups.filter((c) => c.branch === b.name);
  const churchMembers = members.filter((m) => m.branch === b.name);
  const churchEvents = events.filter((e) => e.branch === b.name);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/dashboard/church"><ArrowLeft className="mr-1 h-4 w-4" />Back to Church Ministry</Link>
      </Button>

      <PageHeader title={b.name} subtitle={`${b.country} · Senior pastor: ${b.pastor}`} />

      {/* Church overview cards (horizontal stat cards) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Members" value={b.members.toLocaleString()} icon={Users} change={b.growth} accent="primary" />
        <StatCard label="Leaders" value={b.leaders} icon={Crown} change={2.1} accent="gold" />
        <StatCard label="Cells" value={churchCells.length} icon={HeartHandshake} change={3.4} accent="success" />
        <StatCard label="Events" value={churchEvents.length} icon={CalendarDays} change={1.8} accent="blue" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cells">Cells</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <SectionCard title="Church profile">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Country" value={b.country} />
              <Info label="Senior pastor" value={b.pastor} />
              <Info label="Members" value={b.members.toLocaleString()} />
              <Info label="Leaders" value={String(b.leaders)} />
              <Info label="Growth" value={`+${b.growth}%`} />
              <Info label="Cells" value={String(churchCells.length)} />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="cells" className="mt-4">
          <SectionCard title="Cells">
            <div className="space-y-3">
              {churchCells.map((c) => (
                <div key={c.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-royal text-primary-foreground"><HeartHandshake className="h-5 w-5"/></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base font-bold">{c.name}</p>
                    <p className="text-sm text-muted-foreground">Leader · {c.leader}</p>
                  </div>
                  <div className="flex gap-6 rounded-xl bg-secondary/50 px-5 py-3">
                    <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Members</p><p className="font-display text-lg font-bold">{c.members}</p></div>
                    <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Attendance</p><p className="font-display text-lg font-bold">{c.attendance}%</p></div>
                  </div>
                </div>
              ))}
              {churchCells.length === 0 && <p className="text-sm text-muted-foreground">No cells in this church yet.</p>}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <SectionCard title={`Members (${churchMembers.length})`}>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-4 py-3 text-left">Member</th><th className="px-4 py-3 text-left">Position</th><th className="px-4 py-3 text-left">Cell</th></tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {churchMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-secondary/40">
                      <td className="px-4 py-3 font-semibold">{m.name}</td>
                      <td className="px-4 py-3"><Badge variant="outline">{m.stage}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground">{m.cell}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <SectionCard title="Upcoming events">
            <ul className="divide-y divide-border">
              {churchEvents.map((e) => (
                <li key={e.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()} · {e.type}</p>
                  </div>
                  <Badge variant="outline">{e.attendees}/{e.capacity}</Badge>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/40 p-4">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-bold"><Building2 className="inline h-4 w-4 text-gold mr-1.5 -mt-0.5"/>{value}</p>
    </div>
  );
}
