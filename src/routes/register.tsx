import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getBranches, getBranchById } from "@/lib/stores/branches-store";
import { addMember, toggleMemberMilestone } from "@/lib/stores/members-store";
import { setSession } from "@/lib/stores/session-store";
import { Sparkles, Mail, CheckCircle2, Award } from "lucide-react";
import { toast } from "sonner";
import { Member, MemberMilestone } from "@/types/domain";

export const Route = createFileRoute("/register")({ component: RegisterPage });

const DOMAIN = "@soultracker.com";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");
}

function RegisterPage() {
  const navigate = useNavigate();
  const branchesList = getBranches();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [branchId, setBranchId] = useState(branchesList[0]?.id || "b1");
  const [password, setPassword] = useState("");

  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [createdMember, setCreatedMember] = useState<Member | null>(null);
  const [selectedMilestones, setSelectedMilestones] = useState<Record<string, { completed: boolean; date?: string }>>({});

  const selectedBranch = getBranchById(branchId) || branchesList[0];
  const activeMilestones = selectedBranch?.milestones?.filter((m) => m.status === "active") || [];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!first || !last || (!email && !phone)) {
      toast.error("First name, last name, and contact details are required");
      return;
    }

    const memberId = `m_reg_${Date.now()}`;
    const firstStage = selectedBranch.stages?.[0] || "Invitee";

    const newMember: Member = {
      id: memberId,
      name: `${first} ${last}`,
      email: email || `${slugify(`${first}.${last}`)}@christembassy.org`,
      phone: phone || "+234 800 000 0000",
      branch: selectedBranch.name,
      role: "Member", // Defaults to Member per spec Section 4.1
      stage: firstStage, // Defaults to Invitee per spec Section 4.1
      milestones: [],
      mentor: "Unassigned",
      joinedAt: new Date().toISOString(),
      avatar: `https://i.pravatar.cc/120?img=${Math.floor(Math.random() * 70) + 1}`,
      status: "active",
    };

    addMember(newMember);
    setSession({
      memberId,
      role: "Member",
      branch: selectedBranch.name,
    });

    setCreatedMember(newMember);
    toast.success("Account created successfully!");
    
    // Redirect to onboarding step for retroactive milestone declaration (Section 4.1 & 4.2)
    setOnboardingOpen(true);
  };

  const handleSaveOnboarding = () => {
    if (createdMember) {
      Object.entries(selectedMilestones).forEach(([msId, data]) => {
        if (data.completed) {
          toggleMemberMilestone(createdMember.id, msId, true, data.date || new Date().toISOString().slice(0, 10));
        }
      });
    }
    toast.success("Welcome to Soul Tracer!");
    setOnboardingOpen(false);
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthShell
      title="Join Soul Tracer"
      subtitle="Create your Christ Embassy membership account."
      footer={
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleRegister}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>First name *</Label>
            <Input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Daniel" required />
          </div>
          <div className="space-y-2">
            <Label>Last name *</Label>
            <Input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Okafor" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email Address *</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="member@christembassy.org"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Phone Number *</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 803 000 0000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Your Branch *</Label>
          <Select value={branchId} onValueChange={setBranchId}>
            <SelectTrigger>
              <SelectValue placeholder="Select your branch" />
            </SelectTrigger>
            <SelectContent>
              {branchesList.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name} ({b.country || "Nigeria"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Password *</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required />
        </div>

        <p className="text-xs text-muted-foreground">
          By registering, your initial stage will be set to <strong>{selectedBranch.stages?.[0] || "Invitee"}</strong>.
        </p>

        <Button
          type="submit"
          className="w-full bg-gradient-royal text-primary-foreground shadow-elegant hover:opacity-90"
          size="lg"
        >
          Create account
        </Button>
      </form>

      {/* Onboarding Dialog: Retroactive Milestone Declaration (Section 4.2) */}
      <Dialog open={onboardingOpen} onOpenChange={setOnboardingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold" />
              Discipleship Onboarding
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Have you already completed any of these milestones prior to registering? Check any that apply:
          </p>
          <div className="space-y-3 py-2 max-h-64 overflow-y-auto">
            {activeMilestones.map((ms) => {
              const item = selectedMilestones[ms.id] || { completed: false };
              return (
                <div key={ms.id} className="flex items-start justify-between rounded-xl border border-border bg-card p-3">
                  <div>
                    <p className="font-semibold text-sm flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-gold" />
                      {ms.name}
                    </p>
                    {item.completed && (
                      <Input
                        type="date"
                        value={item.date || new Date().toISOString().slice(0, 10)}
                        onChange={(e) =>
                          setSelectedMilestones((prev) => ({
                            ...prev,
                            [ms.id]: { completed: true, date: e.target.value },
                          }))
                        }
                        className="mt-1 text-xs h-7 w-36"
                      />
                    )}
                  </div>
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={(checked) =>
                      setSelectedMilestones((prev) => ({
                        ...prev,
                        [ms.id]: { completed: Boolean(checked), date: item.date },
                      }))
                    }
                  />
                </div>
              );
            })}
            {activeMilestones.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No milestone catalog configured for this branch.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button className="bg-gradient-royal text-primary-foreground w-full" onClick={handleSaveOnboarding}>
              Complete Registration &amp; Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthShell>
  );
}
