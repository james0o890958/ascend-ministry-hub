import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { events } from "@/lib/data";

export const Route = createFileRoute("/dashboard/attendance")({ component: AttendancePage });

function AttendancePage() {
  const [marked, setMarked] = useState<Set<string>>(new Set());

  const toggle = (id: string, name: string) => {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else { next.add(id); toast.success(`Marked attended: ${name}`); }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" subtitle="Recent events — tap to mark yourself attended." />

      <SectionCard title="Recent events">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Event</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Branch</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {events.map((e) => {
                const isMarked = marked.has(e.id);
                return (
                  <tr key={e.id} className="hover:bg-secondary/40">
                    <td className="px-4 py-3 font-semibold">{e.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.branch}</td>
                    <td className="px-4 py-3 text-right">
                      {isMarked ? (
                        <Badge className="bg-success/15 text-success border-success/30"><CheckCircle2 className="mr-1 h-3 w-3"/>Attended</Badge>
                      ) : (
                        <Button size="sm" className="bg-gradient-royal text-primary-foreground" onClick={() => toggle(e.id, e.name)}>
                          <CheckCircle2 className="mr-1 h-4 w-4"/>Mark attended
                        </Button>
                      )}
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
