import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { events } from "@/lib/data";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/dashboard/events/")({ component: EventsPage });

function EventsPage() {
  const { role } = useRole();
  const canModify = role === "Admin" || role === "Pastor" || role === "Cell Leader";
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => filter === "all" ? events : events.filter((e) => e.id === filter), [filter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        subtitle="Browse all events. Filter attendees by event."
        action={
          <>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-56"><SelectValue placeholder="Filter event" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All events</SelectItem>
                {events.map((e) => <SelectItem key={e.id} value={e.id}>{e.name} · {new Date(e.date).toLocaleDateString()}</SelectItem>)}
              </SelectContent>
            </Select>
            {canModify && <Button className="bg-gradient-royal text-primary-foreground"><Plus className="mr-1 h-4 w-4"/>New event</Button>}
          </>
        }
      />

      <SectionCard title="Events">
        <div className="space-y-3">
          {filtered.map((e) => {
            const pct = Math.min(100, Math.round((e.attendees / e.capacity) * 100));
            const d = new Date(e.date);
            return (
              <Link
                key={e.id}
                to="/dashboard/events/$id"
                params={{ id: e.id }}
                className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant sm:flex-row sm:items-center"
              >
                <div className="flex w-20 flex-col items-center justify-center rounded-xl bg-gradient-royal py-3 text-primary-foreground shadow-soft">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">
                    {d.toLocaleString("en", { month: "short" })}
                  </span>
                  <span className="font-display text-2xl font-bold leading-none">{d.getDate()}</span>
                  <span className="mt-0.5 text-[10px] text-white/70">{d.getFullYear()}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-bold">{e.name}</h3>
                    <Badge variant="outline">{e.type}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{e.branch}</p>
                  <div className="mt-3 max-w-md">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Attendance</span>
                      <span className="font-semibold">{e.attendees.toLocaleString()} / {e.capacity.toLocaleString()}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-gradient-gold" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center sm:ml-auto">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:text-gold">
                    View details <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
