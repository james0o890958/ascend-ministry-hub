import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { invitees as seed, events, Invitee } from "@/lib/data";

export const Route = createFileRoute("/dashboard/invitees")({ component: InviteesPage });

function InviteesPage() {
  const [list, setList] = useState<Invitee[]>(seed);
  const [name, setName] = useState("");
  const [event, setEvent] = useState(events[0].name);
  const [open, setOpen] = useState(false);

  const add = () => {
    if (!name.trim()) return;
    setList((prev) => [{ id: `i${Date.now()}`, name, event, invitedBy: "m1000", status: "Pending", date: new Date().toISOString().slice(0, 10) }, ...prev]);
    toast.success(`Invited ${name} to ${event}`);
    setName(""); setOpen(false);
  };

  const setStatus = (id: string, status: Invitee["status"]) => {
    setList((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    toast.success(`Status updated to ${status}`);
  };

  const statusColor: Record<string, string> = {
    Pending: "bg-gold-soft text-primary border-gold/30",
    Attended: "bg-success/15 text-success border-success/30",
    Declined: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invitees"
        subtitle="Track people you've invited to events."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-royal text-primary-foreground"><UserPlus className="mr-1 h-4 w-4"/>New invitee</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Invite someone</DialogTitle></DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Friend's name" /></div>
                <div className="space-y-1.5">
                  <Label>Event</Label>
                  <Select value={event} onValueChange={setEvent}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{events.map((e) => <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter><Button onClick={add} className="bg-gradient-royal text-primary-foreground">Add</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <SectionCard title={`Your invitees (${list.length})`}>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Invitee</th>
                <th className="px-4 py-3 text-left">Event</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {list.map((i) => (
                <tr key={i.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3 font-semibold">{i.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.event}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(i.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className={statusColor[i.status]}>{i.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button size="sm" variant="outline">Change</Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {(["Pending", "Attended", "Declined"] as const).map((s) => (
                          <DropdownMenuItem key={s} onClick={() => setStatus(i.id, s)}>{s}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
