import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { HeartHandshake, Users, TrendingUp, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cellGroups } from "@/lib/data";

export const Route = createFileRoute("/dashboard/cells")({ component: CellsPage });

function CellsPage() {
  const total = cellGroups.reduce((s, c) => s + c.members, 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Cell Ministry"
        subtitle="Cell groups, leaders, attendance and growth — the heartbeat of the church."
        action={<Button className="bg-gradient-royal text-primary-foreground"><Plus className="mr-1 h-4 w-4" />New cell</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active cells" value={cellGroups.length * 124} icon={HeartHandshake} change={5.8} accent="primary" />
        <StatCard label="Members in cells" value={(total * 78).toLocaleString()} icon={Users} change={6.2} accent="gold" />
        <StatCard label="Avg attendance" value="82%" icon={TrendingUp} change={3.4} accent="success" />
        <StatCard label="Cell leaders" value="312" icon={Users} change={2.1} accent="blue" />
      </div>

      <SectionCard title="Cell groups">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cellGroups.map((c) => (
            <div key={c.id} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-elegant">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg font-semibold">{c.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {c.branch}
                  </p>
                </div>
                <Badge className={c.growth >= 0 ? "bg-success/15 text-success border-success/30" : "bg-destructive/10 text-destructive"}>
                  {c.growth >= 0 ? "+" : ""}{c.growth}%
                </Badge>
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                <Avatar className="h-9 w-9 ring-1 ring-gold/40"><AvatarFallback>{c.leader[0]}</AvatarFallback></Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{c.leader}</p>
                  <p className="text-xs text-muted-foreground">Cell Leader</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-secondary/60 p-2">
                  <p className="font-display text-xl font-bold text-primary">{c.members}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Members</p>
                </div>
                <div className="rounded-lg bg-gold-soft/60 p-2">
                  <p className="font-display text-xl font-bold text-primary">{c.attendance}%</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Attendance</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-gradient-gold" style={{ width: `${c.attendance}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
