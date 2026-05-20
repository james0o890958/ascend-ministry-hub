import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Building2, Users, TrendingUp, Crown, Sparkles, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { branches, cellGroups, members } from "@/lib/data";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/dashboard/church")({ component: ChurchPage });

function ChurchPage() {
  const { role } = useRole();
  const [scope, setScope] = useState<"churches" | "cells">("churches");
  const [selected, setSelected] = useState<string>(scope === "churches" ? branches[0].id : cellGroups[0].id);

  const rows = useMemo(() => {
    if (scope === "churches") {
      return branches.map((b) => ({ id: b.id, name: b.name, location: b.country, leader: b.pastor, members: b.members, growth: b.growth }));
    }
    return cellGroups.map((c) => ({ id: c.id, name: c.name, location: c.branch, leader: c.leader, members: c.members, growth: c.growth }));
  }, [scope]);

  const appoint = (memberId: string, target: string) => {
    const m = members.find((x) => x.id === memberId);
    toast.success(`${m?.name} appointed as leader of ${target}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Church Ministry"
        subtitle={role === "Admin" ? "All churches and cells across the ministry" : "Your church reports and appointments"}
        action={
          <Tabs value={scope} onValueChange={(v) => setScope(v as "churches" | "cells")}>
            <TabsList>
              <TabsTrigger value="churches">Churches</TabsTrigger>
              <TabsTrigger value="cells">Cells</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={scope === "churches" ? "Branches" : "Cells"} value={rows.length} icon={Building2} change={3} accent="primary" />
        <StatCard label="Total members" value={rows.reduce((s, r) => s + r.members, 0).toLocaleString()} icon={Users} change={6.2} accent="gold" />
        <StatCard label="Avg growth" value={`${(rows.reduce((s, r) => s + r.growth, 0) / rows.length).toFixed(1)}%`} icon={TrendingUp} change={1.4} accent="success" />
        <StatCard label="Leaders" value={branches.reduce((s, b) => s + b.leaders, 0)} icon={Crown} change={2.1} accent="blue" />
      </div>

      <SectionCard title={scope === "churches" ? "Churches" : "Cells"}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-royal" />
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-royal text-primary-foreground shadow-soft">
                    {scope === "churches" ? <Building2 className="h-5 w-5" /> : <HeartHandshakeIcon />}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold leading-tight">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.location}</p>
                  </div>
                </div>
                <Badge className="bg-success/15 text-success border-success/30">+{r.growth}%</Badge>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-secondary/50 p-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Leader</p>
                  <p className="mt-0.5 truncate text-sm font-semibold">{r.leader}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Members</p>
                  <p className="mt-0.5 font-display text-lg font-bold">{r.members.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Appoint leader</p>
                <AppointInline target={r.name} onAppoint={(id) => appoint(id, r.name)} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Comparison">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" />
              <XAxis dataKey="name" stroke="oklch(0.5 0.03 260)" fontSize={11} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={12} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.012 255)", borderRadius: 12 }} />
              <Bar dataKey="members" name="Members" fill="oklch(0.32 0.16 264)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}

function AppointInline({ target, onAppoint }: { target: string; onAppoint: (id: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex items-center gap-2">
      <Select value={val} onValueChange={setVal}>
        <SelectTrigger className="h-8 w-48"><SelectValue placeholder="Select member" /></SelectTrigger>
        <SelectContent className="max-h-72">
          {members.slice(0, 16).map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button size="sm" disabled={!val} onClick={() => { onAppoint(val); setVal(""); }} className="bg-gradient-royal text-primary-foreground">
        <Sparkles className="mr-1 h-3.5 w-3.5" /> Appoint
      </Button>
    </div>
  );
}
