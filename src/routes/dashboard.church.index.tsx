import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import {
  Building2, Users, TrendingUp, Crown, Settings as SettingsIcon,
  Eye, CalendarDays, HandCoins, Activity, ClipboardList, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { branches, members, events, recentActivity } from "@/lib/data";
import { useRole } from "@/lib/role";
import { useCurrentChurch } from "@/lib/current-church";
import { ReportComparison } from "@/components/dashboard/ReportComparison";

export const Route = createFileRoute("/dashboard/church/")({ component: ChurchPage });

function ChurchPage() {
  const { role } = useRole();
  const { current, currentChurchId, setCurrentChurchId } = useCurrentChurch();

  if (role !== "Admin" && role !== "Pastor") {
    return (
      <SectionCard title="Restricted">
        <p className="text-sm text-muted-foreground">Church Ministry is only available to Pastors.</p>
      </SectionCard>
    );
  }

  const churchMembers = members.filter((m) => m.branch === current.name);
  const churchEvents = events.filter((e) => e.branch === current.name);
  const churchActivity = recentActivity.filter((a) => a.branch === current.name);
  const giving = 12400 + (current.members * 3.2);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Church Ministry"
        subtitle={`Currently moderating · ${current.name}`}
        action={
          <>
            <Select value={currentChurchId} onValueChange={setCurrentChurchId}>
              <SelectTrigger className="w-56"><SelectValue/></SelectTrigger>
              <SelectContent>
                {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name} · {b.country}</SelectItem>)}
              </SelectContent>
            </Select>
            <ChurchSettingsDialog id={current.id} name={current.name} pastor={current.pastor} country={current.country} />
          </>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 h-auto">
          <TabsTrigger value="overview" className="flex-1 min-w-fit px-4">Overview</TabsTrigger>
          <TabsTrigger value="members" className="flex-1 min-w-fit px-4">Members</TabsTrigger>
          <TabsTrigger value="attendance" className="flex-1 min-w-fit px-4">Attendance</TabsTrigger>
          <TabsTrigger value="giving" className="flex-1 min-w-fit px-4">Giving</TabsTrigger>
          <TabsTrigger value="events" className="flex-1 min-w-fit px-4">Events</TabsTrigger>
          <TabsTrigger value="activities" className="flex-1 min-w-fit px-4">Activities</TabsTrigger>
          <TabsTrigger value="reports" className="flex-1 min-w-fit px-4">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Members" value={current.members.toLocaleString()} icon={Users} change={current.growth} accent="primary" />
            <StatCard label="Leaders" value={current.leaders} icon={Crown} change={2.1} accent="gold" />
            <StatCard label="Giving (mo.)" value={`$${Math.round(giving).toLocaleString()}`} icon={HandCoins} change={4.4} accent="success" />
            <StatCard label="Growth" value={`${current.growth}%`} icon={TrendingUp} change={1.2} accent="blue" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Last church viewed">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-royal text-primary-foreground"><Building2 className="h-6 w-6"/></span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-bold">{current.name}</p>
                  <p className="text-sm text-muted-foreground">{current.country} · Pastor {current.pastor}</p>
                </div>
                <Badge className="bg-success/15 text-success border-success/30">+{current.growth}%</Badge>
              </div>
            </SectionCard>

            <SectionCard title="Recent activities">
              <ul className="divide-y divide-border">
                {(churchActivity.length ? churchActivity : recentActivity.slice(0, 4)).map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div><span className="font-semibold">{a.who}</span> · <span className="text-muted-foreground">{a.type}</span></div>
                    <span className="text-xs text-muted-foreground">{a.when}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Upcoming events">
              <ul className="divide-y divide-border">
                {(churchEvents.length ? churchEvents : events.slice(0, 3)).map((e) => (
                  <li key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary"/><span className="font-semibold">{e.name}</span></div>
                    <span className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Pending tasks">
              <ul className="divide-y divide-border">
                {["Approve 3 new leaders", "Confirm Sunday service rota", "Review giving report"].map((t) => (
                  <li key={t} className="flex items-center justify-between py-2.5 text-sm">
                    <div className="flex items-center gap-2"><ClipboardList className="h-4 w-4 text-gold"/>{t}</div>
                    <Badge variant="outline">Pending</Badge>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Recent summaries" className="lg:col-span-2">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Weekly attendance", value: "82%", icon: Activity },
                  { label: "First timers", value: 28, icon: Users },
                  { label: "Reports filed", value: 6, icon: FileText },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-secondary/40 p-4">
                    <div className="flex items-center gap-2 text-muted-foreground"><s.icon className="h-4 w-4"/><span className="text-xs uppercase tracking-wider">{s.label}</span></div>
                    <p className="mt-1 font-display text-2xl font-bold">{s.value}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <SectionCard title={`Members of ${current.name} (${churchMembers.length})`}>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Position</th><th className="px-4 py-3 text-left">Cell</th><th className="px-4 py-3 text-left">Attendance</th><th className="px-4 py-3"/></tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {churchMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-secondary/40">
                      <td className="px-4 py-3 font-semibold">{m.name}</td>
                      <td className="px-4 py-3"><Badge variant="outline">{m.stage}</Badge></td>
                      <td className="px-4 py-3">{m.cell}</td>
                      <td className="px-4 py-3">{m.attendance}%</td>
                      <td className="px-4 py-3 text-right"><Button asChild size="sm" variant="ghost"><Link to="/dashboard/members/$id" params={{ id: m.id }}><Eye className="mr-1 h-3.5 w-3.5"/>View</Link></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <SectionCard title="Attendance trend">
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3 text-left">Service</th><th className="px-4 py-3 text-left">Present</th><th className="px-4 py-3 text-left">Rate</th></tr></thead>
                <tbody className="divide-y divide-border bg-card">
                  {["Sun May 17","Wed May 14","Sun May 10","Wed May 7"].map((d, i) => (
                    <tr key={d}><td className="px-4 py-3">{d}</td><td className="px-4 py-3">{1800 - i * 120}</td><td className="px-4 py-3"><Badge className="bg-success/15 text-success border-success/30">{85 - i * 2}%</Badge></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="giving" className="mt-4">
          <SectionCard title={`Giving · ${current.name}`}>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Month to date" value={`$${Math.round(giving).toLocaleString()}`} icon={HandCoins} accent="gold"/>
              <StatCard label="Tithes" value={`$${Math.round(giving * 0.6).toLocaleString()}`} icon={HandCoins} accent="primary"/>
              <StatCard label="Offerings" value={`$${Math.round(giving * 0.4).toLocaleString()}`} icon={HandCoins} accent="success"/>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <SectionCard title="Events">
            <ul className="divide-y divide-border">
              {(churchEvents.length ? churchEvents : events).map((e) => (
                <li key={e.id} className="flex items-center justify-between py-3">
                  <div><p className="font-semibold">{e.name}</p><p className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()} · {e.type}</p></div>
                  <Button asChild size="sm" variant="outline"><Link to="/dashboard/events/$id" params={{ id: e.id }}>View</Link></Button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="activities" className="mt-4">
          <SectionCard title="Activities">
            <ul className="divide-y divide-border">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div><span className="font-semibold">{a.who}</span> · <span className="text-muted-foreground">{a.type}</span> · <span className="text-xs text-muted-foreground">{a.branch}</span></div>
                  <span className="text-xs text-muted-foreground">{a.when}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <ReportComparison label="Churches" entities={branches.map((b) => ({ id: b.id, name: b.name }))} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ChurchSettingsDialog({ name, pastor, country }: { id: string; name: string; pastor: string; country: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><SettingsIcon className="mr-1 h-3.5 w-3.5"/>Church settings</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>{name} · Settings</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5"><Label>Church name</Label><Input defaultValue={name} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Country</Label><Input defaultValue={country} /></div>
            <div className="space-y-1.5"><Label>Senior pastor</Label><Input defaultValue={pastor} /></div>
          </div>
          <div className="space-y-1.5"><Label>Service time</Label><Input defaultValue="Sunday · 9:00 AM" /></div>
          <div className="space-y-1.5"><Label>Address</Label><Input placeholder="Street, city" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button className="bg-gradient-royal text-primary-foreground" onClick={() => toast.success(`${name} settings updated`)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
