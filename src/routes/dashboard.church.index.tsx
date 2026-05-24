import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Building2, Users, TrendingUp, Crown, Settings as SettingsIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { branches } from "@/lib/data";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/dashboard/church/")({ component: ChurchPage });

function ChurchPage() {
  const { role } = useRole();
  const totalMembers = branches.reduce((s, b) => s + b.members, 0);
  const totalLeaders = branches.reduce((s, b) => s + b.leaders, 0);
  const avgGrowth = (branches.reduce((s, b) => s + b.growth, 0) / branches.length).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Church Ministry"
        subtitle={role === "Admin" ? "All churches across the ministry" : "Your church reports"}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Churches" value={branches.length} icon={Building2} change={3} accent="primary" />
        <StatCard label="Total members" value={totalMembers.toLocaleString()} icon={Users} change={6.2} accent="gold" />
        <StatCard label="Avg growth" value={`${avgGrowth}%`} icon={TrendingUp} change={1.4} accent="success" />
        <StatCard label="Leaders" value={totalLeaders} icon={Crown} change={2.1} accent="blue" />
      </div>

      <SectionCard title="Churches">
        <div className="space-y-3">
          {branches.map((b) => (
            <div
              key={b.id}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant sm:flex-row sm:items-center"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-royal text-primary-foreground shadow-soft">
                <Building2 className="h-6 w-6" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg font-bold">{b.name}</h3>
                  <Badge variant="outline">{b.country}</Badge>
                  <Badge className="bg-success/15 text-success border-success/30">+{b.growth}%</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Pastor · {b.pastor}</p>
              </div>

              <div className="grid shrink-0 grid-cols-2 gap-6 rounded-xl bg-secondary/50 px-5 py-3 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Members</p>
                  <p className="font-display text-lg font-bold">{b.members.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Leaders</p>
                  <p className="font-display text-lg font-bold">{b.leaders}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:ml-2">
                <Button asChild size="sm" className="bg-gradient-royal text-primary-foreground">
                  <Link to="/dashboard/church/$id" params={{ id: b.id }}>
                    <Eye className="mr-1 h-3.5 w-3.5" /> View
                  </Link>
                </Button>
                <ChurchSettingsDialog id={b.id} name={b.name} pastor={b.pastor} country={b.country} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function ChurchSettingsDialog({ id, name, pastor, country }: { id: string; name: string; pastor: string; country: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <SettingsIcon className="mr-1 h-3.5 w-3.5" /> Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>{name} · Settings</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5"><Label>Church name</Label><Input defaultValue={name} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Country</Label><Input defaultValue={country} /></div>
            <div className="space-y-1.5"><Label>Senior pastor</Label><Input defaultValue={pastor} /></div>
          </div>
          <div className="space-y-1.5"><Label>Service time</Label><Input defaultValue="Sunday · 9:00 AM" /></div>
          <div className="space-y-1.5"><Label>Address</Label><Input placeholder="Street, city" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button className="bg-gradient-royal text-primary-foreground" onClick={() => toast.success(`${name} settings updated`)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
