import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { stageDistribution, STAGES } from "@/lib/data";
import { Users, TrendingUp, Award, Crown } from "lucide-react";

export const Route = createFileRoute("/dashboard/journey")({ component: JourneyPage });

const stageDetails: Record<string, { desc: string; avgDays: number }> = {
  "Invitee": { desc: "Invited but not yet attended a service.", avgDays: 14 },
  "First Timer": { desc: "Visited service for the very first time.", avgDays: 21 },
  "Regular Attendee": { desc: "Attends consistently for 4+ weeks.", avgDays: 60 },
  "Baptized Member": { desc: "Publicly baptized in water.", avgDays: 30 },
  "Foundation School Student": { desc: "Enrolled in the discipleship curriculum.", avgDays: 90 },
  "Foundation School Graduate": { desc: "Completed all foundation modules.", avgDays: 7 },
  "Cell Member": { desc: "Assigned to a cell for fellowship.", avgDays: 120 },
  "Workforce Member": { desc: "Serving in a ministry department.", avgDays: 180 },
  "Leader": { desc: "Recognised as a cell or department leader.", avgDays: 365 },
  "Pastor": { desc: "Ordained pastoral office.", avgDays: 730 },
};

function JourneyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Discipleship Journey"
        subtitle="From the first invitation to the pastoral mantle — visualised."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active journeys" value="3,420" icon={Users} change={6.4} accent="primary" />
        <StatCard label="Stage progressions" value="284" icon={TrendingUp} change={11.2} accent="gold" hint="this month" />
        <StatCard label="Foundation graduates" value="86" icon={Award} change={4.1} accent="success" />
        <StatCard label="New leaders raised" value="12" icon={Crown} change={3.0} accent="blue" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <SectionCard title="The 10-stage path">
          <ol className="relative space-y-3 border-l-2 border-dashed border-gold/40 pl-6">
            {STAGES.map((s, i) => (
              <motion.li key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="relative">
                <span className="absolute -left-[34px] grid h-7 w-7 place-items-center rounded-full bg-gradient-gold text-xs font-bold text-gold-foreground ring-4 ring-background">
                  {i + 1}
                </span>
                <div className="rounded-xl border border-border bg-card p-4 transition hover:border-gold/60 hover:shadow-soft">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-display text-base font-semibold">{s}</p>
                    <Badge variant="outline" className="border-gold/40 text-primary">~{stageDetails[s].avgDays}d avg</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{stageDetails[s].desc}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    <span className="text-muted-foreground">Tracks status badge, completion date, mentor & notes</span>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard title="Distribution across stages">
          <div className="h-[480px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageDistribution} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" horizontal={false} />
                <XAxis type="number" stroke="oklch(0.5 0.03 260)" fontSize={11} />
                <YAxis type="category" dataKey="stage" stroke="oklch(0.5 0.03 260)" fontSize={11} width={90} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.012 255)", borderRadius: 12 }} />
                <Bar dataKey="count" fill="oklch(0.32 0.16 264)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
