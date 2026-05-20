import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { events, members, attendanceForDate } from "@/lib/data";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/dashboard/events")({ component: EventsPage });

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
              <div
                key={e.id}
                className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:shadow-elegant sm:flex-row sm:items-center"
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
                  <AttendeesDialog eventId={e.id} eventName={e.name} eventDate={e.date} />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

function AttendeesDialog({ eventId, eventName, eventDate }: { eventId: string; eventName: string; eventDate: string }) {
  const attendedIds = new Set(attendanceForDate(eventDate));
  const attendees = members.filter((m) => attendedIds.has(m.id));
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Users className="mr-1 h-3.5 w-3.5"/>View attendees</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{eventName} — Attendees ({attendees.length})</DialogTitle></DialogHeader>
        <div className="max-h-96 overflow-y-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground sticky top-0">
              <tr><th className="px-4 py-2 text-left">Member</th><th className="px-4 py-2 text-left">Branch</th><th className="px-4 py-2 text-left">Stage</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {attendees.map((m) => (
                <tr key={m.id}><td className="px-4 py-2 font-semibold">{m.name}</td><td className="px-4 py-2 text-muted-foreground">{m.branch}</td><td className="px-4 py-2"><Badge variant="outline">{m.stage}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
