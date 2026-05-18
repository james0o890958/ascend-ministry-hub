import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { attendanceWeekly, branches } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/attendance")({ component: AttendancePage });

function AttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" subtitle="Service, midweek and cell attendance — at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sunday avg" value="9,490" icon={Calendar} change={7.8} accent="primary" />
        <StatCard label="Midweek avg" value="4,820" icon={Clock} change={4.2} accent="gold" />
        <StatCard label="Cell avg" value="6,610" icon={Users} change={6.1} accent="success" />
        <StatCard label="Retention rate" value="86%" icon={TrendingUp} change={2.4} accent="blue" />
      </div>

      <SectionCard title="Weekly attendance trend">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceWeekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" />
              <XAxis dataKey="week" stroke="oklch(0.5 0.03 260)" fontSize={12} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={12} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.012 255)", borderRadius: 12 }} />
              <Legend />
              <Line type="monotone" dataKey="sunday" name="Sunday" stroke="oklch(0.32 0.16 264)" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="midweek" name="Midweek" stroke="oklch(0.74 0.13 85)" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="cell" name="Cell" stroke="oklch(0.62 0.14 155)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Monthly attendance by branch">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Branch</th>
                <th className="px-4 py-3 text-left font-semibold">Sunday</th>
                <th className="px-4 py-3 text-left font-semibold">Midweek</th>
                <th className="px-4 py-3 text-left font-semibold">Cell</th>
                <th className="px-4 py-3 text-left font-semibold">Avg %</th>
                <th className="px-4 py-3 text-left font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {branches.map((b, i) => {
                const avg = 70 + ((i * 11) % 28);
                return (
                  <tr key={b.id} className="hover:bg-secondary/40">
                    <td className="px-4 py-3 font-semibold">{b.name}</td>
                    <td className="px-4 py-3">{(b.members * 0.78).toFixed(0)}</td>
                    <td className="px-4 py-3">{(b.members * 0.42).toFixed(0)}</td>
                    <td className="px-4 py-3">{(b.members * 0.58).toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                          <div className="h-full bg-gradient-royal" style={{ width: `${avg}%` }} />
                        </div>
                        <span className="font-semibold">{avg}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={b.growth > 10 ? "bg-success/15 text-success border-success/30" : "bg-gold-soft text-primary border-gold/30"}>
                        +{b.growth}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
