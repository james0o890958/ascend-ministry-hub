import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { ShieldCheck, Check, X, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { leaderRequests, LeaderRequest } from "@/lib/data";

export const Route = createFileRoute("/dashboard/leadership")({ component: LeadershipPage });

function LeadershipPage() {
  const [list, setList] = useState<LeaderRequest[]>(leaderRequests);

  const update = (id: string, status: "approved" | "denied") => {
    setList((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(status === "approved" ? "Leader approved" : "Request denied");
  };

  const pending = list.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6">
      <PageHeader title="Leadership" subtitle="Approve and ordain leaders across the ministry." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending requests" value={pending.length} icon={ShieldCheck} accent="gold" />
        <StatCard label="Approved (YTD)" value={list.filter((r) => r.status === "approved").length + 28} icon={Check} accent="success" change={4.2} />
        <StatCard label="Denied (YTD)" value={list.filter((r) => r.status === "denied").length + 3} icon={X} accent="blue" />
        <StatCard label="Total leaders" value={624} icon={Crown} accent="primary" change={2.1} />
      </div>

      <SectionCard title="Pending leader requests">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Candidate</th>
                <th className="px-4 py-3 text-left">Proposed role</th>
                <th className="px-4 py-3 text-left">Church / Cell</th>
                <th className="px-4 py-3 text-left">Proposed by</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {list.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3 font-semibold">{r.candidate}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className="border-gold/40 text-primary">{r.proposedRole}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{r.scope}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.proposedBy}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Badge className={
                      r.status === "approved" ? "bg-success/15 text-success border-success/30"
                      : r.status === "denied" ? "bg-destructive/10 text-destructive"
                      : "bg-gold-soft text-primary border-gold/30"
                    }>{r.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => update(r.id, "denied")}><X className="mr-1 h-3.5 w-3.5"/>Deny</Button>
                        <Button size="sm" className="bg-gradient-royal text-primary-foreground" onClick={() => update(r.id, "approved")}><Check className="mr-1 h-3.5 w-3.5"/>Approve</Button>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
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
