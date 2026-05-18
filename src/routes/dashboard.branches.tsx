import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Building2, Globe2, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { branches } from "@/lib/data";

export const Route = createFileRoute("/dashboard/branches")({ component: BranchesPage });

function BranchesPage() {
  const total = branches.reduce((s, b) => s + b.members, 0);
  return (
    <div className="space-y-6">
      <PageHeader title="Branches" subtitle="One covering, every branch in sight." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total branches" value={branches.length} icon={Building2} change={3.0} accent="primary" />
        <StatCard label="Countries" value="8" icon={Globe2} change={0} accent="gold" />
        <StatCard label="Members" value={total.toLocaleString()} icon={Users} change={8.2} accent="success" />
        <StatCard label="Avg growth" value="10.7%" icon={TrendingUp} change={1.4} accent="blue" />
      </div>

      <SectionCard title="Branch comparison">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branches}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" />
              <XAxis dataKey="name" stroke="oklch(0.5 0.03 260)" fontSize={11} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={12} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.012 255)", borderRadius: 12 }} />
              <Bar dataKey="members" name="Members" fill="oklch(0.32 0.16 264)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {branches.map((b) => (
          <div key={b.id} className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant">
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-royal text-gold"><Building2 className="h-5 w-5" /></span>
              <Badge className="bg-success/15 text-success border-success/30">+{b.growth}%</Badge>
            </div>
            <p className="mt-4 font-display text-lg font-semibold">{b.name}</p>
            <p className="text-xs text-muted-foreground">{b.country}</p>
            <p className="mt-3 text-sm">{b.pastor}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <div>
                <p className="font-display text-xl font-bold text-primary">{b.members.toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Members</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold text-primary">{b.leaders}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Leaders</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
