import { useState, useMemo, useSyncExternalStore } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Plus, ArrowRight, Check, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getEvents,
  subscribeEvents,
  registerForEvent,
  unregisterFromEvent,
} from "@/lib/events-store";
import { useRole } from "@/lib/role";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/events/")({ component: EventsPage });

function EventsPage() {
  const { role, userId } = useRole();
  const canModify = role === "Admin" || role === "Pastor" || role === "Cell Leader";
  const [filter, setFilter] = useState<string>("all");
  const events = useSyncExternalStore(subscribeEvents, getEvents, getEvents);

  const filtered = useMemo(
    () => (filter === "all" ? events : events.filter((e) => e.id === filter)),
    [filter, events],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        subtitle="Browse all events, register for upcoming programs, and filter attendees."
        action={
          <>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All events</SelectItem>
                {events.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name} · {new Date(e.date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {canModify && (
              <Button asChild className="bg-gradient-royal text-primary-foreground">
                <Link to="/dashboard/events/new">
                  <Plus className="mr-1 h-4 w-4" />
                  New event
                </Link>
              </Button>
            )}
          </>
        }
      />

      <SectionCard title="Events">
        <div className="space-y-3">
          {filtered.map((evt) => {
            const pct = Math.min(100, Math.round((evt.attendees / evt.capacity) * 100));
            const d = new Date(evt.date);
            const isRegistered = (evt.registeredMemberIds || []).includes(userId);

            const handleToggleRegistration = (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              if (isRegistered) {
                unregisterFromEvent(evt.id, userId);
                toast.info(`Cancelled your registration for ${evt.name}`);
              } else {
                registerForEvent(evt.id, userId);
                toast.success(`Successfully registered for ${evt.name}!`);
              }
            };

            return (
              <Link
                key={evt.id}
                to="/dashboard/events/$id"
                params={{ id: evt.id }}
                className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant sm:flex-row sm:items-center"
              >
                <div className="flex w-20 flex-col items-center justify-center rounded-xl bg-gradient-royal py-3 text-primary-foreground shadow-soft">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">
                    {d.toLocaleString("en", { month: "short" })}
                  </span>
                  <span className="font-display text-2xl font-bold leading-none">
                    {d.getDate()}
                  </span>
                  <span className="mt-0.5 text-[10px] text-white/70">{d.getFullYear()}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-bold">{evt.name}</h3>
                    <Badge variant="outline">{evt.type}</Badge>
                    {isRegistered && (
                      <Badge className="bg-success/15 text-success border-success/30 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Registered
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{evt.branch}</p>
                  <div className="mt-3 max-w-md">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Attendance</span>
                      <span className="font-semibold">
                        {evt.attendees.toLocaleString()} / {evt.capacity.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-gradient-gold" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 sm:ml-auto">
                  {isRegistered ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleToggleRegistration}
                      className="border-success/40 bg-success/10 text-success hover:bg-success/20 hover:text-success"
                    >
                      <Check className="mr-1 h-3.5 w-3.5" />
                      Registered
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleToggleRegistration}
                      className="bg-gradient-royal text-primary-foreground shadow-soft hover:opacity-90"
                    >
                      <UserCheck className="mr-1 h-3.5 w-3.5" />
                      Register
                    </Button>
                  )}
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
