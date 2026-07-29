import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Globe, Building2 } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { addEvent } from "@/lib/stores/events-store";
import { getBranches } from "@/lib/stores/branches-store";
import { addNotification } from "@/lib/notifications-store";
import { useRole } from "@/lib/role";
import { useCurrentChurch } from "@/lib/current-church";
import { canCreateGlobalEvent, canCreateBranchEvent } from "@/lib/permissions";
import { EventScope, ChurchEvent } from "@/types/domain";

export const Route = createFileRoute("/dashboard/events/new")({ component: NewEventPage });

const TYPES: ChurchEvent["type"][] = ["Service", "Midweek", "Cell", "Crusade", "Training"];

function NewEventPage() {
  const { role, userId } = useRole();
  const { current } = useCurrentChurch();
  const navigate = useNavigate();

  const canCreateGlobal = canCreateGlobalEvent(role);
  const canCreateBranch = canCreateBranchEvent(role, current.name, current.name);

  const [scope, setScope] = useState<EventScope>(canCreateGlobal ? "global" : "branch");
  const [name, setName] = useState("");
  const [type, setType] = useState<ChurchEvent["type"]>("Service");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [branch, setBranch] = useState(current.name);
  const [capacity, setCapacity] = useState("100");
  const [description, setDescription] = useState("");

  const branchesList = getBranches();

  if (!canCreateGlobal && !canCreateBranch) {
    return (
      <SectionCard title="Restricted">
        <p className="text-sm text-muted-foreground">
          Only Admins, Branch Admins, and Pastors can create events.
        </p>
      </SectionCard>
    );
  }

  function submit() {
    if (!name || !date) {
      toast.error("Event name and date are required");
      return;
    }
    const rec: ChurchEvent = {
      id: `e${Date.now()}`,
      name,
      type,
      date,
      scope,
      branch: scope === "global" ? null : branch,
      createdBy: userId,
      capacity: Number(capacity) || 100,
      attendees: 0,
      description,
    };
    addEvent(rec);
    addNotification({
      title: `New Event Created (${scope.toUpperCase()}): ${name}`,
      desc: `${new Date(date).toLocaleDateString()} at ${time}`,
      time: "Just now",
    });
    toast.success(`Event "${rec.name}" created`, {
      description: `${new Date(date).toLocaleDateString()} · Scope: ${scope}`,
    });
    navigate({ to: "/dashboard/events" });
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/dashboard/events">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to events
        </Link>
      </Button>

      <PageHeader
        title="New Event"
        subtitle="Create a global ministry-wide event or local branch event"
      />

      <SectionCard title="Event details">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Event Scope</Label>
            <div className="flex gap-4 pt-1">
              {canCreateGlobal && (
                <Button
                  type="button"
                  variant={scope === "global" ? "default" : "outline"}
                  className={scope === "global" ? "bg-gradient-royal text-primary-foreground" : ""}
                  onClick={() => setScope("global")}
                >
                  <Globe className="h-4 w-4 mr-1.5" />
                  Global (Ministry-wide)
                </Button>
              )}
              <Button
                type="button"
                variant={scope === "branch" ? "default" : "outline"}
                className={scope === "branch" ? "bg-gradient-royal text-primary-foreground" : ""}
                onClick={() => setScope("branch")}
              >
                <Building2 className="h-4 w-4 mr-1.5" />
                Branch Local ({current.name})
              </Button>
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label>Event Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sunday Service, Healing Streams, Youth Night…"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as ChurchEvent["type"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {scope === "branch" && (
            <div className="space-y-1.5">
              <Label>Branch</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branchesList.map((b) => (
                    <SelectItem key={b.id} value={b.name}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Date *</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label>Location / Venue</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Auditorium, online stream URL, address..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Capacity</Label>
            <Input
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Agenda, speakers, registration instructions…"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button asChild variant="outline">
            <Link to="/dashboard/events">Cancel</Link>
          </Button>
          <Button className="bg-gradient-royal text-primary-foreground" onClick={submit}>
            <CalendarDays className="mr-1 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
