import { useMemo, useState } from "react";
import { SectionCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, BarChart3 } from "lucide-react";

type Entity = { id: string; name: string };
type Metric = "attendance" | "giving" | "growth" | "engagement" | "events" | "tasks";

const METRICS: { key: Metric; label: string }[] = [
  { key: "attendance", label: "Attendance" },
  { key: "giving", label: "Giving" },
  { key: "growth", label: "Growth" },
  { key: "engagement", label: "Engagement" },
  { key: "events", label: "Event participation" },
  { key: "tasks", label: "Completed tasks" },
];

const TIMEFRAMES = ["Last 7 days", "Last 30 days", "Last quarter", "YTD", "Last year"];

// Deterministic pseudo data so the user can see comparisons.
function score(id: string, metric: Metric, timeframe: string) {
  const seed = (id + metric + timeframe).split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const base: Record<Metric, number> = {
    attendance: 60, giving: 5000, growth: 2, engagement: 50, events: 4, tasks: 10,
  };
  const span: Record<Metric, number> = {
    attendance: 40, giving: 40000, growth: 18, engagement: 50, events: 20, tasks: 40,
  };
  return base[metric] + (seed % span[metric]);
}

export function ReportComparison({ label, entities }: { label: string; entities: Entity[] }) {
  const [selected, setSelected] = useState<string[]>(entities.slice(0, 2).map((e) => e.id));
  const [metrics, setMetrics] = useState<Metric[]>(["attendance", "giving", "growth"]);
  const [timeframe, setTimeframe] = useState(TIMEFRAMES[1]);

  const remaining = entities.filter((e) => !selected.includes(e.id));

  function toggleMetric(m: Metric) {
    setMetrics((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));
  }

  const rows = useMemo(() =>
    selected.map((id) => {
      const e = entities.find((x) => x.id === id)!;
      return { entity: e, values: metrics.map((m) => ({ m, v: score(id, m, timeframe) })) };
    }),
  [selected, metrics, timeframe, entities]);

  // Compute max per metric for relative bar
  const maxes: Record<string, number> = {};
  metrics.forEach((m) => {
    maxes[m] = Math.max(1, ...rows.map((r) => r.values.find((v) => v.m === m)!.v));
  });

  return (
    <div className="space-y-4">
      <SectionCard title={`Comparative report · ${label}`} action={
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>{TIMEFRAMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
      }>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label} in comparison</p>
            <div className="flex flex-wrap items-center gap-2">
              {selected.map((id) => {
                const e = entities.find((x) => x.id === id);
                if (!e) return null;
                return (
                  <Badge key={id} className="gap-1 bg-gradient-royal text-primary-foreground pr-1">
                    {e.name}
                    <button onClick={() => setSelected((s) => s.filter((x) => x !== id))} className="ml-1 rounded-full p-0.5 hover:bg-white/20"><X className="h-3 w-3"/></button>
                  </Badge>
                );
              })}
              {remaining.length > 0 && (
                <Select value="" onValueChange={(v) => v && setSelected((s) => [...s, v])}>
                  <SelectTrigger className="h-8 w-44"><SelectValue placeholder={<span className="flex items-center gap-1 text-xs"><Plus className="h-3 w-3"/>Add to compare</span>} /></SelectTrigger>
                  <SelectContent>{remaining.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Metrics</p>
            <div className="flex flex-wrap gap-2">
              {METRICS.map((m) => (
                <Button key={m.key} size="sm" variant={metrics.includes(m.key) ? "default" : "outline"}
                  className={metrics.includes(m.key) ? "bg-gradient-royal text-primary-foreground" : ""}
                  onClick={() => toggleMetric(m.key)}>{m.label}</Button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {selected.length === 0 || metrics.length === 0 ? (
        <SectionCard><p className="text-sm text-muted-foreground">Select at least one entity and one metric to view a report.</p></SectionCard>
      ) : (
        <SectionCard title="Results">
          <div className="space-y-6">
            {metrics.map((m) => (
              <div key={m}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary"/>{METRICS.find((x) => x.key === m)!.label}</p>
                  <span className="text-xs text-muted-foreground">{timeframe}</span>
                </div>
                <div className="space-y-2">
                  {rows.map((r) => {
                    const v = r.values.find((x) => x.m === m)!.v;
                    const pct = Math.round((v / maxes[m]) * 100);
                    const display = m === "giving" ? `$${v.toLocaleString()}` : m === "growth" ? `${v}%` : m === "attendance" || m === "engagement" ? `${v}%` : v.toLocaleString();
                    return (
                      <div key={r.entity.id} className="grid grid-cols-[10rem_1fr_4rem] items-center gap-3">
                        <span className="truncate text-sm font-medium">{r.entity.name}</span>
                        <div className="h-2.5 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-gradient-gold" style={{ width: `${pct}%` }}/></div>
                        <span className="text-right text-sm font-semibold">{display}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
