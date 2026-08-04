import { useState, useSyncExternalStore, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
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
import {
  HandCoins,
  Download,
  Plus,
  Trash2,
  Settings,
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Upload,
  Check,
  ArrowRight,
  HandHeart,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  addGiving,
  deleteGiving,
  getGiving,
  getGivingConfigs,
  updateGivingConfig,
  subscribeGiving,
  GIVING_TYPES,
  approveGivingRecord,
  rejectGivingRecord,
  getPledges,
  savePledges,
  addPledge,
  getBankDetails,
  type GivingType,
} from "@/lib/stores/giving-store";
import { getMembers, subscribeMembers } from "@/lib/stores/members-store";
import { useCurrentChurch } from "@/lib/current-church";
import { useRole } from "@/lib/role";
import {
  canRecordGiving,
  canConfigureGivingTypes,
  canSelfReportGiving,
  canVerifyGiving,
} from "@/lib/permissions";
import { PartnershipPledge } from "@/types/domain";

export const Route = createFileRoute("/dashboard/giving")({ component: GivingPage });

type Tab = "overview" | "pledges" | "pending";

function statusBadge(status?: string) {
  if (status === "verified")
    return (
      <Badge className="bg-green-500/20 text-green-600 border-green-500/30 gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Verified
      </Badge>
    );
  if (status === "rejected")
    return (
      <Badge className="bg-red-500/20 text-red-600 border-red-500/30 gap-1">
        <XCircle className="h-3 w-3" />
        Rejected
      </Badge>
    );
  return (
    <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 gap-1">
      <Clock className="h-3 w-3" />
      Pending
    </Badge>
  );
}

function GivingPage() {
  const { role, userId } = useRole();
  const { current } = useCurrentChurch();
  const canModify = canRecordGiving(role, current.name, current.name);
  const canConfig = canConfigureGivingTypes(role);
  const canSelf = canSelfReportGiving(role);
  const canVerify = canVerifyGiving(role, current.name, current.name);
  const [tab, setTab] = useState<Tab>("overview");

  const rawRecords = useSyncExternalStore(subscribeGiving, getGiving, getGiving);
  const givingConfigs = useSyncExternalStore(subscribeGiving, getGivingConfigs, getGivingConfigs);
  const allPledges = useSyncExternalStore(subscribeGiving, getPledges, getPledges);

  const records = rawRecords.filter((r) => r.branch === current.name || role === "Admin");
  const verifiedRecords = records.filter((r) => !r.status || r.status === "verified");
  const pendingRecords = records.filter((r) => r.status === "pending");
  const myPledges = allPledges.filter(
    (p) => p.branch === current.name && (role === "Admin" || p.memberId === userId)
  );
  const branchPledges = allPledges.filter((p) => p.branch === current.name);

  const total = verifiedRecords.reduce((s, r) => s + r.amount, 0);
  const tithe = verifiedRecords.filter((r) => r.type === "Tithe").reduce((s, r) => s + r.amount, 0);
  const offering = verifiedRecords.filter((r) => r.type === "Offering").reduce((s, r) => s + r.amount, 0);
  const ministryWideTotal = rawRecords
    .filter((r) => {
      const cfg = givingConfigs.find((c) => c.type === r.type);
      return (cfg ? cfg.isMinistryWideRollup : r.type === "Partnership") && r.status !== "rejected";
    })
    .reduce((s, r) => s + r.amount, 0);

  function handleExport() {
    if (records.length === 0) {
      toast.error("No giving records to export");
      return;
    }
    const headers = ["ID", "Date", "Type", "Source", "Branch", "Member ID", "Channel", "Status", "Receipt Ref", "Rollup", "Amount"];
    const rows = records.map((r) => [
      r.id, r.date, r.type,
      `"${r.source.replace(/"/g, '""')}"`,
      `"${r.branch.replace(/"/g, '""')}"`,
      `"${r.memberId || ""}"`,
      r.paymentChannel || "",
      r.status || "verified",
      r.receiptRef || "",
      r.rollupScope || "branch-only",
      r.amount,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `giving-report-${current.name.replace(/\s+/g, "-")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Giving report CSV downloaded");
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "overview", label: "Overview" },
    { key: "pledges", label: "Partnership Pledges", count: branchPledges.filter((p) => p.status === "active").length },
    ...(canVerify ? [{ key: "pending" as Tab, label: "Pending Verification", count: pendingRecords.length }] : []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Giving & Partnership"
        subtitle="Tithes, offerings, partnership, seed, and project funds attribution"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-1 h-4 w-4" />
              Export
            </Button>
            {canConfig && <GivingConfigDialog configs={givingConfigs} />}
            {canSelf && (
              <ReportGivingWizard
                branchName={current.name}
                memberId={userId}
                myPledges={myPledges}
              />
            )}
            {canModify && <RecordGivingDialog branchName={current.name} />}
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label={`${current.name} Verified Total`} value={`₦${total.toLocaleString()}`} icon={HandCoins} accent="gold" />
        <StatCard label="Tithes" value={`₦${tithe.toLocaleString()}`} icon={HandCoins} accent="primary" />
        <StatCard label="Offerings" value={`₦${offering.toLocaleString()}`} icon={HandCoins} accent="success" />
        <StatCard label="Ministry-Wide Rollup" value={`₦${ministryWideTotal.toLocaleString()}`} icon={Globe} accent="blue" />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg ${
              tab === t.key
                ? "text-primary border-b-2 border-primary -mb-px bg-primary/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {t.count != null && t.count > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-amber-500 text-white text-xs w-5 h-5">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <SectionCard title="Giving Records">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Source</th>
                  <th className="px-4 py-3 text-left">Channel</th>
                  <th className="px-4 py-3 text-left">Branch</th>
                  <th className="px-4 py-3 text-left">Giver</th>
                  <th className="px-4 py-3 text-left">Status</th>
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
                    <td className="px-4 py-3 text-muted-foreground">{r.paymentChannel || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.branch}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.memberId ? (
                        <span className="font-medium text-foreground">Member ({r.memberId})</span>
                      ) : (
                        r.giverNameIfAnonymous || "Anonymous / Walk-in"
                      )}
                    </td>
                    <td className="px-4 py-3">{statusBadge(r.status)}</td>
                    <td className="px-4 py-3 text-right font-semibold">₦{r.amount.toLocaleString()}</td>
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
                    <td colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                      No giving records for this branch yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Partnership Pledges Tab */}
      {tab === "pledges" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Partnership Pledges</h3>
            <NewPledgeDialog branchName={current.name} memberId={userId} />
          </div>
          {branchPledges.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              <HandHeart className="mx-auto h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">No partnership pledges yet</p>
              <p className="text-sm mt-1">Click "New Pledge" to create a commitment.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {branchPledges.map((p) => {
                const pct = Math.min(100, Math.round((p.fulfilledAmount / p.targetAmount) * 100));
                const remaining = p.targetAmount - p.fulfilledAmount;
                return (
                  <div
                    key={p.id}
                    className="rounded-xl border border-border bg-card p-5 space-y-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{p.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.memberName} · {p.branch}</p>
                      </div>
                      <Badge
                        className={
                          p.status === "completed"
                            ? "bg-green-500/20 text-green-600 border-green-400/30"
                            : "bg-primary/20 text-primary border-primary/30"
                        }
                      >
                        {p.status === "completed" ? "Completed" : "Active"}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">₦{p.fulfilledAmount.toLocaleString()}</span>
                        <span className="text-muted-foreground">of ₦{p.targetAmount.toLocaleString()}</span>
                      </div>
                      <Progress value={pct} className="h-2.5" />
                      <p className="text-xs text-muted-foreground">
                        {pct}% fulfilled
                        {remaining > 0 && ` · ₦${remaining.toLocaleString()} remaining`}
                      </p>
                    </div>

                    {p.status === "active" && (canSelf || canModify) && (
                      <ReportGivingWizard
                        branchName={p.branch}
                        memberId={p.memberId}
                        myPledges={[p]}
                        prefillPledgeId={p.id}
                        compact
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Pending Verification Tab */}
      {tab === "pending" && canVerify && (
        <SectionCard title={`Pending Verification · ${pendingRecords.length} submission${pendingRecords.length !== 1 ? "s" : ""}`}>
          {pendingRecords.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <CheckCircle2 className="mx-auto h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">All clear — nothing to verify</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRecords.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{r.type}</Badge>
                      <span className="text-xs text-muted-foreground">{r.paymentChannel || "—"}</span>
                      <span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</span>
                    </div>
                    <p className="font-semibold text-lg">₦{r.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.memberId ? `Member ID: ${r.memberId}` : r.giverNameIfAnonymous || "Anonymous"}
                      {r.receiptRef && (
                        <span className="ml-2 bg-secondary px-1.5 py-0.5 rounded text-[11px]">
                          Ref: {r.receiptRef}
                        </span>
                      )}
                    </p>
                    {r.pledgeId && (
                      <p className="text-xs text-primary">
                        Linked to pledge: {allPledges.find((p) => p.id === r.pledgeId)?.title || r.pledgeId}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        approveGivingRecord(r.id);
                        toast.success("Giving record verified and approved");
                      }}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Approve
                    </Button>
                    <RejectDialog recordId={r.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}
    </div>
  );
}

// ── Multi-Step Report Giving Wizard ──────────────────────────────────────────

type WizardStep = 1 | 2 | 3 | 4;

function ReportGivingWizard({
  branchName,
  memberId,
  myPledges,
  prefillPledgeId,
  compact,
}: {
  branchName: string;
  memberId: string;
  myPledges: PartnershipPledge[];
  prefillPledgeId?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<WizardStep>(1);
  const [type, setType] = useState<GivingType>("Tithe");
  const [amount, setAmount] = useState("");
  const [pledgeId, setPledgeId] = useState(prefillPledgeId || "");
  const [channel, setChannel] = useState<"Bank Transfer" | "Cash" | "POS" | "Cheque">("Bank Transfer");
  const [receiptRef, setReceiptRef] = useState("");
  const [receiptFileName, setReceiptFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const bankDetails = getBankDetails(branchName);

  function reset() {
    setStep(1);
    setType("Tithe");
    setAmount("");
    setPledgeId(prefillPledgeId || "");
    setChannel("Bank Transfer");
    setReceiptRef("");
    setReceiptFileName("");
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    setOpen(v);
  }

  function step1Next() {
    const num = Number(amount);
    if (!num || num <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setStep(2);
  }

  function step2Next() {
    if (!channel) {
      toast.error("Select a payment channel");
      return;
    }
    setStep(3);
  }

  function submit() {
    const num = Number(amount);
    const selectedPledge = myPledges.find((p) => p.id === pledgeId);
    addGiving({
      type,
      amount: num,
      source: selectedPledge ? selectedPledge.title : `${type} — Self-reported`,
      branch: branchName,
      memberId: memberId || null,
      date: new Date().toISOString().slice(0, 10),
      status: "pending",
      paymentChannel: channel,
      receiptRef: receiptRef || null,
      pledgeId: pledgeId || null,
    });
    setStep(4);
  }

  const stepLabels = ["Amount", "Bank Details", "Receipt", "Done"];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {compact ? (
          <Button size="sm" variant="outline" className="w-full">
            <HandCoins className="h-3.5 w-3.5 mr-1" />
            Fulfill Installment
          </Button>
        ) : (
          <Button className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm">
            <HandCoins className="mr-1.5 h-4 w-4" />
            Report Giving
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HandCoins className="h-5 w-5 text-primary" />
            Report Giving / Partner
          </DialogTitle>
        </DialogHeader>

        {/* Step Progress Indicator */}
        {step < 4 && (
          <div className="flex items-center gap-1 py-1">
            {stepLabels.slice(0, 3).map((label, i) => {
              const s = (i + 1) as WizardStep;
              return (
                <div key={s} className="flex items-center gap-1 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      step > s
                        ? "bg-green-500 text-white"
                        : step === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {step > s ? <Check className="h-3.5 w-3.5" /> : s}
                  </div>
                  <span className={`text-xs hidden sm:block ${step === s ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                  {i < 2 && <div className={`flex-1 h-px mx-1 ${step > s ? "bg-green-500" : "bg-border"}`} />}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Step 1: Category & Amount ── */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Giving Category</Label>
              <Select value={type} onValueChange={(v) => setType(v as GivingType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GIVING_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {type === "Partnership" && myPledges.length > 0 && (
              <div className="space-y-1.5">
                <Label>Link to Partnership Pledge (optional)</Label>
                <Select value={pledgeId} onValueChange={setPledgeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pledge..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No pledge</SelectItem>
                    {myPledges.filter((p) => p.status === "active").map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title} · ₦{(p.targetAmount - p.fulfilledAmount).toLocaleString()} remaining
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Amount (₦) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₦</span>
                <Input
                  type="number"
                  min="0"
                  className="pl-7"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <Button className="w-full" onClick={step1Next}>
              Next: Bank Details
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ── Step 2: Bank Details & Channel ── */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">Official Church Bank Account</p>
              {bankDetails ? (
                <>
                  <BankRow label="Bank Name" value={bankDetails.bankName} />
                  <BankRow label="Account Number" value={bankDetails.accountNumber} copyable />
                  <BankRow label="Account Name" value={bankDetails.accountName} />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Bank details not configured for this branch.</p>
              )}
            </div>

            <div className="rounded-lg bg-secondary/60 p-3 text-center">
              <p className="text-xs text-muted-foreground">Please transfer</p>
              <p className="text-2xl font-bold text-foreground">₦{Number(amount).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">to the account above, then continue</p>
            </div>

            <div className="space-y-1.5">
              <Label>Payment Channel</Label>
              <Select value={channel} onValueChange={(v) => setChannel(v as typeof channel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Bank Transfer", "Cash", "POS", "Cheque"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button className="flex-1" onClick={step2Next}>
                Next: Upload Receipt
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Receipt Upload ── */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Bank Reference / Session ID (optional)</Label>
              <Input
                value={receiptRef}
                onChange={(e) => setReceiptRef(e.target.value)}
                placeholder="e.g. TRX-20240517-001"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Upload Transfer Receipt (optional)</Label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-6 flex flex-col items-center gap-2 transition-colors text-muted-foreground hover:text-foreground"
              >
                <Upload className="h-7 w-7" />
                {receiptFileName ? (
                  <span className="text-sm font-medium text-primary">{receiptFileName}</span>
                ) : (
                  <>
                    <span className="text-sm font-medium">Click to upload receipt</span>
                    <span className="text-xs">PNG, JPG, PDF — max 5 MB</span>
                  </>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setReceiptFileName(f.name);
                }}
              />
            </div>

            <p className="text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              Your submission will be marked <strong>Pending Verification</strong>. A Pastor or Branch Admin will confirm your receipt and approve the record.
            </p>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={submit}>
                <Check className="mr-1.5 h-4 w-4" />
                Submit for Verification
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 4: Success ── */}
        {step === 4 && (
          <div className="py-6 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="h-9 w-9 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-bold">Receipt Submitted!</p>
              <p className="text-sm text-muted-foreground mt-1">
                ₦{Number(amount).toLocaleString()} — {type}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Sent to your Pastor for verification. You will be notified once confirmed.
              </p>
            </div>
            <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 gap-1">
              <Clock className="h-3 w-3" />
              Pending Verification
            </Badge>
            <Button className="w-full" onClick={() => { reset(); setOpen(false); }}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function BankRow({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="font-semibold">{value}</span>
        {copyable && (
          <button onClick={copy} className="text-muted-foreground hover:text-primary transition-colors">
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ── New Pledge Dialog ─────────────────────────────────────────────────────────

function NewPledgeDialog({ branchName, memberId }: { branchName: string; memberId: string }) {
  const members = useSyncExternalStore(subscribeMembers, getMembers, getMembers);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState(memberId || "");

  const branchMembers = members.filter((m) => m.branch === branchName);

  function submit() {
    const num = Number(targetAmount);
    if (!title.trim()) { toast.error("Pledge title is required"); return; }
    if (!num || num <= 0) { toast.error("Enter a valid target amount"); return; }
    const member = members.find((m) => m.id === selectedMemberId);
    addPledge({
      memberId: selectedMemberId,
      memberName: member?.name || "Member",
      branch: branchName,
      title: title.trim(),
      targetAmount: num,
      createdAt: new Date().toISOString().slice(0, 10),
    });
    toast.success(`Partnership pledge "${title}" created`);
    setOpen(false);
    setTitle("");
    setTargetAmount("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-1 h-4 w-4" />
          New Pledge
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Partnership Pledge</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label>Member</Label>
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Select member..." />
              </SelectTrigger>
              <SelectContent className="max-h-52">
                {branchMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Pledge Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rhapsody Partnership 2026"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Target Amount (₦)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₦</span>
              <Input
                type="number"
                min="0"
                className="pl-7"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Create Pledge</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Reject Dialog ─────────────────────────────────────────────────────────────

function RejectDialog({ recordId }: { recordId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  function submit() {
    rejectGivingRecord(recordId, reason || undefined);
    toast.error("Giving record declined");
    setOpen(false);
    setReason("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
          <XCircle className="h-3.5 w-3.5 mr-1" />
          Decline
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Decline this submission?</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-1">
          <Label>Reason (optional)</Label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Invalid receipt, amount mismatch..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={submit}>Decline</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Admin: Record Giving (Ledger Entry) ───────────────────────────────────────

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
  const [channel, setChannel] = useState<"Bank Transfer" | "Cash" | "POS" | "Cheque">("Cash");

  function submit() {
    const num = Number(amount);
    if (!num || num <= 0) { toast.error("Enter a valid amount"); return; }
    if (!source) { toast.error("Source is required"); return; }
    addGiving({
      type, amount: num, source,
      branch: branchName,
      memberId: isAnonymous ? null : memberId || null,
      giverNameIfAnonymous: isAnonymous ? giverNameIfAnonymous || "Anonymous Walk-in" : null,
      date,
      status: "verified",
      paymentChannel: channel,
    });
    toast.success(`${type} of ₦${num.toLocaleString()} recorded (verified)`);
    setOpen(false);
    setAmount("");
    setSource("Sunday Service");
    setGiverNameIfAnonymous("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-1 h-4 w-4" />
          Record Giving (Admin)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Giving — Admin Ledger Entry</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Giving Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as GivingType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {GIVING_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Amount (₦) *</Label>
            <Input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Source / Event</Label>
            <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Sunday Service, Building Fund…" />
          </div>
          <div className="space-y-1.5">
            <Label>Payment Channel</Label>
            <Select value={channel} onValueChange={(v) => setChannel(v as typeof channel)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Bank Transfer", "Cash", "POS", "Cheque"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <Label className="font-semibold">Walk-in / Anonymous?</Label>
              <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
            </div>
            {isAnonymous ? (
              <Input value={giverNameIfAnonymous} onChange={(e) => setGiverNameIfAnonymous(e.target.value)} placeholder="e.g. Bro. John (Walk-in)" />
            ) : (
              <Select value={memberId} onValueChange={setMemberId}>
                <SelectTrigger><SelectValue placeholder="Link to member..." /></SelectTrigger>
                <SelectContent className="max-h-56">
                  {membersList.map((m) => <SelectItem key={m.id} value={m.id}>{m.name} ({m.branch})</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Save & Verify</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Giving Config Dialog ──────────────────────────────────────────────────────

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
          Toggle which giving types aggregate into the global ministry-wide total.
        </p>
        <div className="divide-y divide-border py-2">
          {configs.map((c) => (
            <div key={c.type} className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-sm">{c.type}</p>
                <p className="text-xs text-muted-foreground">
                  {c.isMinistryWideRollup ? "Rolls up into Ministry-Wide + Branch total" : "Branch total only"}
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
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
