import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users, UserPlus, Droplets, GraduationCap, HeartHandshake, Crown, Sparkles, Activity, Plus,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie,
  PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  attendanceWeekly, growthMonthly, recentActivity, stageDistribution, stats, members,
} from "@/lib/data";

export const Route = createFileRoute("/dashboard/")({ component: Overview });

const PIE_COLORS = ["oklch(0.32 0.16 264)", "oklch(0.46 0.18 264)", "oklch(0.74 0.13 85)", "oklch(0.62 0.14 155)", "oklch(0.55 0.15 230)"];

function Overview() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sunday Overview"
        subtitle="A complete picture of your ministry — across every branch, this week."
        action={
          <>
            <Button variant="outline">Export report</Button>
            <Button asChild className="bg-gradient-royal text-primary-foreground shadow-soft hover:opacity-90">
              <Link to="/dashboard/members"><Plus className="mr-1 h-4 w-4" />Add member</Link>
            </Button>
          </>
        }
      />

      {/* Stat grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total members" value={stats.totalMembers.toLocaleString()} icon={Users} change={8.2} accent="primary" hint="vs last month" />
        <StatCard label="First timers" value={stats.firstTimers} icon={UserPlus} change={12.4} accent="gold" hint="this Sunday" />
        <StatCard label="Baptized members" value={stats.baptized.toLocaleString()} icon={Droplets} change={4.6} accent="blue" />
        <StatCard label="Foundation school" value={stats.foundationStudents.toLocaleString()} icon={GraduationCap} change={6.1} accent="success" />
        <StatCard label="Cell members" value={stats.cellMembers.toLocaleString()} icon={HeartHandshake} change={5.2} accent="primary" />
        <StatCard label="Leaders" value={stats.leaders} icon={Sparkles} change={2.8} accent="gold" />
        <StatCard label="Pastors" value={stats.pastors} icon={Crown} change={1.2} accent="blue" />
        <StatCard label="Branches" value={stats.branches} icon={Activity} change={3.0} accent="success" />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Attendance trend"
          className="lg:col-span-2"
          action={
            <Tabs defaultValue="weeks">
              <TabsList className="bg-secondary">
                <TabsTrigger value="weeks">8 weeks</TabsTrigger>
                <TabsTrigger value="months">YTD</TabsTrigger>
              </TabsList>
            </Tabs>
          }
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceWeekly} margin={{ left: -10, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.32 0.16 264)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.32 0.16 264)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.74 0.13 85)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.74 0.13 85)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" />
                <XAxis dataKey="week" stroke="oklch(0.5 0.03 260)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 260)" fontSize={12} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.012 255)", borderRadius: 12, boxShadow: "var(--shadow-elegant)" }} />
                <Legend />
                <Area type="monotone" dataKey="sunday" name="Sunday Service" stroke="oklch(0.32 0.16 264)" fill="url(#g1)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="midweek" name="Midweek" stroke="oklch(0.74 0.13 85)" fill="url(#g2)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="cell" name="Cell" stroke="oklch(0.62 0.14 155)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Discipleship stages">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stageDistribution.slice(0, 5)} dataKey="count" nameKey="stage" innerRadius={55} outerRadius={95} paddingAngle={2}>
                  {stageDistribution.slice(0, 5).map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {stageDistribution.slice(0, 5).map((s, i) => (
              <li key={s.stage} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  {s.stage}
                </span>
                <span className="font-semibold">{s.count.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Growth + Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Growth & baptisms" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" />
                <XAxis dataKey="month" stroke="oklch(0.5 0.03 260)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 260)" fontSize={12} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.012 255)", borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="members" name="Members" fill="oklch(0.32 0.16 264)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="baptisms" name="Baptisms" fill="oklch(0.74 0.13 85)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Recent activity">
          <ul className="space-y-4">
            {recentActivity.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold ring-4 ring-gold/20" />
                <div className="flex-1">
                  <p className="text-sm"><span className="font-semibold">{a.who}</span> <span className="text-muted-foreground">— {labelFor(a.type)}</span></p>
                  <p className="text-xs text-muted-foreground">{a.branch} • {a.when}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Members preview */}
      <SectionCard
        title="New & notable members"
        action={<Button asChild variant="ghost" size="sm"><Link to="/dashboard/members">View all →</Link></Button>}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {members.slice(0, 4).map((m) => (
            <div key={m.id} className="rounded-xl border border-border bg-secondary/30 p-4 transition hover:bg-secondary/60">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-gold/30">
                  <AvatarImage src={m.avatar} /><AvatarFallback>{m.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.branch}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="outline" className="border-gold/40 text-gold">{m.stage}</Badge>
                <span className="text-xs font-semibold">{m.attendance}%</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function labelFor(type: string) {
  return ({
    baptism: "was baptized",
    "first-timer": "joined as a first timer",
    foundation: "completed Foundation School",
    leader: "was raised as a leader",
    "cell-join": "joined a cell",
    ordination: "was ordained",
  } as Record<string, string>)[type] ?? type;
}
