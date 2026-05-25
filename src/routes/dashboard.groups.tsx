import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/groups")({ component: GroupsPage });

const groups = [
  { id: "g1", name: "Worship Team", members: 24, leader: "Grace Adeyemi", category: "Ministry" },
  { id: "g2", name: "Ushering Corps", members: 38, leader: "Michael Bello", category: "Ministry" },
  { id: "g3", name: "Youth Connect", members: 86, leader: "Daniel Okafor", category: "Community" },
  { id: "g4", name: "Couples Fellowship", members: 42, leader: "Pst. Ruth Akande", category: "Community" },
  { id: "g5", name: "Outreach Squad", members: 18, leader: "Esther Adebayo", category: "Ministry" },
  { id: "g6", name: "Prayer Warriors", members: 56, leader: "Samuel Idowu", category: "Community" },
];

function GroupsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Groups"
        subtitle="Ministry and community groups across the church"
        action={<Button className="bg-gradient-royal text-primary-foreground" onClick={() => toast.success("New group created")}><Plus className="mr-1 h-4 w-4"/>New group</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Groups" value={groups.length} icon={Users} accent="primary"/>
        <StatCard label="Members" value={groups.reduce((s, g) => s + g.members, 0)} icon={Users} accent="gold"/>
        <StatCard label="Active leaders" value={groups.length} icon={Users} accent="success"/>
      </div>

      <SectionCard title="All groups">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant">
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-royal text-primary-foreground"><Users className="h-5 w-5"/></span>
                <Badge variant="outline">{g.category}</Badge>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold">{g.name}</h3>
              <p className="text-sm text-muted-foreground">Led by {g.leader}</p>
              <p className="mt-2 text-xs text-muted-foreground">{g.members} members</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">View</Button>
                <Button size="sm" variant="ghost"><MessageSquare className="h-4 w-4"/></Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
