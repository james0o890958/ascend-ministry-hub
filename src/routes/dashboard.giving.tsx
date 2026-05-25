import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HandCoins, TrendingUp, Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { branches } from "@/lib/data";

export const Route = createFileRoute("/dashboard/giving")({ component: GivingPage });

const records = [
  { id: "g1", date: "2026-05-17", type: "Tithe", source: "Sunday Service", amount: 18420, branch: "Lagos Central" },
  { id: "g2", date: "2026-05-17", type: "Offering", source: "Sunday Service", amount: 6240, branch: "Lagos Central" },
  { id: "g3", date: "2026-05-14", type: "Project", source: "Building Fund", amount: 12300, branch: "Abuja Hub" },
  { id: "g4", date: "2026-05-10", type: "Tithe", source: "Sunday Service", amount: 14820, branch: "Accra Sanctuary" },
  { id: "g5", date: "2026-05-10", type: "Offering", source: "Sunday Service", amount: 4720, branch: "Houston Citadel" },
];

function GivingPage() {
  const total = records.reduce((s, r) => s + r.amount, 0);
  const tithe = records.filter((r) => r.type === "Tithe").reduce((s, r) => s + r.amount, 0);
  const offering = records.filter((r) => r.type === "Offering").reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Giving" subtitle="Tithes, offerings, and project funds across churches"
        action={
          <>
            <Button variant="outline" onClick={() => toast.success("Export queued")}><Download className="mr-1 h-4 w-4"/>Export</Button>
            <Button className="bg-gradient-royal text-primary-foreground" onClick={() => toast.success("New record added")}><Plus className="mr-1 h-4 w-4"/>Record</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total (mo.)" value={`$${total.toLocaleString()}`} icon={HandCoins} change={6.4} accent="gold"/>
        <StatCard label="Tithes" value={`$${tithe.toLocaleString()}`} icon={HandCoins} change={4.1} accent="primary"/>
        <StatCard label="Offerings" value={`$${offering.toLocaleString()}`} icon={HandCoins} change={3.2} accent="success"/>
        <StatCard label="Avg per church" value={`$${Math.round(total / branches.length).toLocaleString()}`} icon={TrendingUp} accent="blue"/>
      </div>

      <SectionCard title="Recent giving">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Type</th><th className="px-4 py-3 text-left">Source</th><th className="px-4 py-3 text-left">Church</th><th className="px-4 py-3 text-right">Amount</th></tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{r.type}</Badge></td>
                  <td className="px-4 py-3">{r.source}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.branch}</td>
                  <td className="px-4 py-3 text-right font-semibold">${r.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
