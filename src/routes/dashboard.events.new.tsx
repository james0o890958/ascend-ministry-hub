import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { branches, type ChurchEvent } from "@/lib/data";
import { addEvent } from "@/lib/events-store";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/dashboard/events/new")({ component: NewEventPage });

const TYPES: ChurchEvent["type"][] = ["Service", "Midweek", "Cell", "Crusade", "Training"];

function NewEventPage() {
  const { role } = useRole();
  const navigate = useNavigate();
  const canModify = role === "Admin" || role === "Pastor" || role === "Cell Leader";

  const [name, setName] = useState("");
  const [type, setType] = useState<ChurchEvent["type"]>("Service");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [branch, setBranch] = useState(branches[0].name);
  const [capacity, setCapacity] = useState("100");
  const [description, setDescription] = useState("");
  const [organizer, setOrganizer] = useState("");

  if (!canModify) {
    return (
      <SectionCard title="Restricted">
        <p className="text-sm text-muted-foreground">Only Admins, Pastors, and Cell Leaders can create events.</p>
      </SectionCard>
    );
  }

  function submit() {
    if (!name || !date) {
      toast.error("Event name and date are required");
      return;
    }
    const rec = addEvent({ name, type, date, branch, capacity: Number(capacity) || 100 });
    toast.success(`Event "${rec.name}" created`, {
      description: location ? `${new Date(date).toLocaleDateString()} · ${time} · ${location}` : undefined,
    });
    navigate({ to: "/dashboard/events" });
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/dashboard/events"><ArrowLeft className="mr-1 h-4 w-4"/>Back to events</Link>
      </Button>

      <PageHeader title="New event" subtitle="Fill in the event details. It will appear on the events list once created." />

      <SectionCard title="Event details">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Event name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sunday Service, Healing Crusade…" />
          </div>

          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as ChurchEvent["type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Church / branch</Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{branches.map((b) => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Auditorium, address, or link" />
          </div>

          <div className="space-y-1.5">
            <Label>Capacity</Label>
            <Input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Organizer / Host</Label>
            <Input value={organizer} onChange={(e) => setOrganizer(e.target.value)} placeholder="Pastor / Team" />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label>Description</Label>
            <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's this event about? Agenda, speakers, notes…" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button asChild variant="outline"><Link to="/dashboard/events">Cancel</Link></Button>
          <Button className="bg-gradient-royal text-primary-foreground" onClick={submit}>
            <CalendarDays className="mr-1 h-4 w-4"/>Create event
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
