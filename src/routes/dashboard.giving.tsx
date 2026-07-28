import { useState, useSyncExternalStore } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HandCoins, TrendingUp, Download, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { branches } from "@/lib/data";
import {
  addGiving,
  deleteGiving,
  getGiving,
  subscribeGiving,
  GIVING_TYPES,
  type GivingType,
} from "@/lib/giving-store";
import { getMembers, subscribeMembers } from "@/lib/members-store";
import { useCurrentChurch } from "@/lib/current-church";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/dashboard/giving")({ component: GivingPage });

function GivingPage() {
  const { role } = useRole();
  const { currentChurchId } = useCurrentChurch();
  const currentChurch = branches.find((b) => b.id === currentChurchId) ?? branches[0];
  const canModify = role === "Admin" || role === "Pastor";
  const rawRecords = useSyncExternalStore(subscribeGiving, getGiving, getGiving);

  const records =
    currentChurchId === "all"
      ? rawRecords
      : rawRecords.filter((r) => r.branch === currentChurch.name);

  function handleExport() {
    if (records.length === 0) {
      toast.error("No giving records to export");
      return;
    }
    const headers = ["ID", "Date", "Type", "Source", "Branch", "Giver", "Amount"];
    const rows = records.map((r) => [
      r.id,
      r.date,
      r.type,
      `"${r.source.replace(/"/g, '""')}"`,
      `"${r.branch.replace(/"/g, '""')}"`,
      `"${(r.giver || "").replace(/"/g, '""')}"`,
      r.amount,
    ]);
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `giving_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Giving report CSV downloaded");
  }

  const total = records.reduce((s, r) => s + r.amount, 0);
  const tithe = records.filter((r) => r.type === "Tithe").reduce((s, r) => s + r.amount, 0);
  const offering = records.filter((r) => r.type === "Offering").reduce((s, r) => s + r.amount, 0);
  const partnership = records
    .filter((r) => r.type === "Partnership")
    .reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Giving"
        subtitle="Tithes, offerings, partnership and project funds across churches"
        action={
          <>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-1 h-4 w-4" />
              Export
            </Button>
            {canModify && <RecordGivingDialog />}
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard
          label="Total"
          value={`$${total.toLocaleString()}`}
          icon={HandCoins}
          change={6.4}
          accent="gold"
        />
        <StatCard
          label="Tithes"
          value={`$${tithe.toLocaleString()}`}
          icon={HandCoins}
          change={4.1}
          accent="primary"
        />
        <StatCard
          label="Offerings"
          value={`$${offering.toLocaleString()}`}
          icon={HandCoins}
          change={3.2}
          accent="success"
        />
        <StatCard
          label="Partnership"
          value={`$${partnership.toLocaleString()}`}
          icon={TrendingUp}
          accent="blue"
        />
      </div>

      <SectionCard title="Recent giving">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Church</th>
                <th className="px-4 py-3 text-left">Giver</th>
                <th className="px-4 py-3 text-right">Amount</th>
                {canModify && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{r.type}</Badge>
                  </td>
                  <td className="px-4 py-3">{r.source}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.branch}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.giver ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    ${r.amount.toLocaleString()}
                  </td>
                  {canModify && (
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          deleteGiving(r.id);
                          toast.success("Record removed");
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!canModify && (
          <p className="mt-3 text-xs text-muted-foreground">
            Only Admins and Pastors can add or remove giving records.
          </p>
        )}
      </SectionCard>
    </div>
  );
}

function RecordGivingDialog() {
  const membersList = useSyncExternalStore(subscribeMembers, getMembers, getMembers);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<GivingType>("Tithe");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [branch, setBranch] = useState(branches[0].name);
  const [giver, setGiver] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  function submit() {
    const num = Number(amount);
    if (!num || num <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!source) {
      toast.error("Source is required");
      return;
    }
    addGiving({ type, amount: num, source, branch, giver: giver || undefined, date });
    toast.success(`${type} of $${num.toLocaleString()} recorded`);
    setOpen(false);
    setAmount("");
    setSource("");
    setGiver("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-royal text-primary-foreground">
          <Plus className="mr-1 h-4 w-4" />
          Record
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Record giving / partnership</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as GivingType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GIVING_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Amount (USD)</Label>
            <Input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Source</Label>
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Sunday Service, Building Fund, Monthly Partner…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Church</Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.name}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Giver / Partner (Select Member or type custom)</Label>
            <Select value={giver} onValueChange={setGiver}>
              <SelectTrigger>
                <SelectValue placeholder="Select member or type name..." />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                <SelectItem value="Anonymous / Guest">Anonymous / Guest</SelectItem>
                {membersList.map((m) => (
                  <SelectItem key={m.id} value={m.name}>
                    {m.name} · {m.cell}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-gradient-royal text-primary-foreground" onClick={submit}>
            Save record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
