import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { CalendarDays, Plus, Users } from "lucide-react";
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
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Event</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Branch</th>
                <th className="px-4 py-3 text-left">Attendees</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3 font-semibold">{e.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{e.type}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{e.branch}</td>
                  <td className="px-4 py-3">{e.attendees.toLocaleString()} / {e.capacity.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right"><AttendeesDialog eventId={e.id} eventName={e.name} eventDate={e.date} /></td>
                </tr>
              ))}
            </tbody>
          </table>
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
