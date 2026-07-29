import { useState, useSyncExternalStore } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { HandCoins, TrendingUp, Download, Plus, Trash2, Settings, Globe } from "lucide-react";
import { toast } from "sonner";
import {
  addGiving,
  deleteGiving,
  getGiving,
  getGivingConfigs,
  updateGivingConfig,
  subscribeGiving,
  GIVING_TYPES,
  type GivingType,
} from "@/lib/stores/giving-store";
import { getMembers, subscribeMembers } from "@/lib/stores/members-store";
import { useCurrentChurch } from "@/lib/current-church";
import { useRole } from "@/lib/role";
import { canRecordGiving, canConfigureGivingTypes } from "@/lib/permissions";

export const Route = createFileRoute("/dashboard/giving")({ component: GivingPage });

function GivingPage() {
  const { role } = useRole();
  const { current } = useCurrentChurch();
  const canModify = canRecordGiving(role, current.name, current.name);
  const canConfig = canConfigureGivingTypes(role);
  
  const rawRecords = useSyncExternalStore(subscribeGiving, getGiving, getGiving);
  const givingConfigs = useSyncExternalStore(subscribeGiving, getGivingConfigs, getGivingConfigs);

  // Filter for branch scope unless Admin viewing overall
  const records = rawRecords.filter((r) => r.branch === current.name || role === "Admin");

  function handleExport() {
    if (records.length === 0) {
      toast.error("No giving records to export");
      return;
    }
    const headers = ["ID", "Date", "Type", "Source", "Branch", "Member ID", "Anonymous Giver", "Rollup Scope", "Amount"];
    const rows = records.map((r) => [
      r.id,
      r.date,
      r.type,
      `"${r.source.replace(/"/g, '""')}"`,
      `"${r.branch.replace(/"/g, '""')}"`,
      `"${r.memberId || ""}"`,
      `"${(r.giverNameIfAnonymous || "").replace(/"/g, '""')}"`,
      r.rollupScope || "branch-only",
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
  
  // Aggregated ministry-wide total for types configured to roll up globally
  const ministryWideTotal = rawRecords
    .filter((r) => {
      const cfg = givingConfigs.find((c) => c.type === r.type);
      return cfg ? cfg.isMinistryWideRollup : r.type === "Partnership";
    })
    .reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Giving"
        subtitle="Tithes, offerings, partnership, seed, and project funds attribution"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-1 h-4 w-4" />
              Export
            </Button>
            {canConfig && <GivingConfigDialog configs={givingConfigs} />}
            {canModify && <RecordGivingDialog branchName={current.name} />}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard
          label={`${current.name} Total`}
          value={`$${total.toLocaleString()}`}
          icon={HandCoins}
          accent="gold"
        />
        <StatCard
          label="Tithes"
          value={`$${tithe.toLocaleString()}`}
          icon={HandCoins}
          accent="primary"
        />
        <StatCard
          label="Offerings"
          value={`$${offering.toLocaleString()}`}
          icon={HandCoins}
          accent="success"
        />
        <StatCard
          label="Ministry-Wide Rollup Total"
          value={`$${ministryWideTotal.toLocaleString()}`}
          icon={Globe}
          accent="blue"
        />
      </div>

      <SectionCard title="Recent Giving Records">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Branch</th>
                <th className="px-4 py-3 text-left">Giver</th>
                <th className="px-4 py-3 text-left">Rollup</th>
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
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.memberId ? (
                      <span className="font-medium text-foreground">Member ({r.memberId})</span>
                    ) : (
                      r.giverNameIfAnonymous || "Anonymous / Walk-in"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={
                        r.rollupScope === "ministry-wide"
                          ? "bg-primary/20 text-primary border-primary/30"
                          : "bg-secondary text-muted-foreground"
                      }
                    >
                      {r.rollupScope || "branch-only"}
                    </Badge>
                  </td>
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
              {records.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                    No giving records for this branch yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function RecordGivingDialog({ branchName }: { branchName: string }) {
  const membersList = useSyncExternalStore(subscribeMembers, getMembers, getMembers);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<GivingType>("Partnership");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("Sunday Service");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [memberId, setMemberId] = useState<string>("");
  const [giverNameIfAnonymous, setGiverNameIfAnonymous] = useState("");
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

    addGiving({
      type,
      amount: num,
      source,
      branch: branchName,
      memberId: isAnonymous ? null : memberId || null,
      giverNameIfAnonymous: isAnonymous ? giverNameIfAnonymous || "Anonymous Walk-in" : null,
      date,
    });

    toast.success(`${type} of $${num.toLocaleString()} recorded`);
    setOpen(false);
    setAmount("");
    setSource("Sunday Service");
    setGiverNameIfAnonymous("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-royal text-primary-foreground shadow-elegant">
          <Plus className="mr-1 h-4 w-4" />
          Record Giving
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Giving / Partnership</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Giving Type</Label>
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
            <Label>Amount (USD) *</Label>
            <Input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Source / Event</Label>
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Sunday Service, Building Fund, Monthly Partner…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Branch Attribution</Label>
            <Input value={branchName} disabled className="bg-secondary" />
          </div>
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="space-y-2 sm:col-span-2 border-t border-border pt-3 mt-1">
            <div className="flex items-center justify-between">
              <Label className="font-semibold">Walk-in / Anonymous Giver?</Label>
              <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
            </div>
            {isAnonymous ? (
              <div className="space-y-1.5 pt-1">
                <Label>Giver Name (Free Text)</Label>
                <Input
                  value={giverNameIfAnonymous}
                  onChange={(e) => setGiverNameIfAnonymous(e.target.value)}
                  placeholder="e.g. Bro. John (Walk-in)"
                />
              </div>
            ) : (
              <div className="space-y-1.5 pt-1">
                <Label>Link to Member Record</Label>
                <Select value={memberId} onValueChange={setMemberId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Search / select registered member..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {membersList.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} ({m.branch})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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

function GivingConfigDialog({ configs }: { configs: ReturnType<typeof getGivingConfigs> }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-1 h-4 w-4" />
          Rollup Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Ministry-Wide Giving Rollup</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Admin setting: Toggle which giving types aggregate into the global Christ Embassy ministry-wide total in addition to local branch totals.
        </p>
        <div className="divide-y divide-border py-2">
          {configs.map((c) => (
            <div key={c.type} className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-sm">{c.type}</p>
                <p className="text-xs text-muted-foreground">
                  {c.isMinistryWideRollup
                    ? "Rolls up into Ministry-Wide total + Branch total"
                    : "Counts towards Branch total only"}
                </p>
              </div>
              <Switch
                checked={c.isMinistryWideRollup}
                onCheckedChange={(checked) => {
                  updateGivingConfig(c.type, checked);
                  toast.success(`Updated ${c.type} rollup rule`);
                }}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
