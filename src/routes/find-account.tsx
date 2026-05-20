import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/find-account")({ component: FindAccountPage });

function FindAccountPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <AuthShell
      title="Find my account"
      subtitle="Recover access using your name and phone number."
      footer={
        <p className="text-center">
          Remembered?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 1) {
            if (!name.trim()) return toast.error("Enter your name");
            setStep(2);
          } else if (step === 2) {
            setStep(3);
          } else {
            if (!phone.trim()) return toast.error("Enter your phone number");
            toast.success("Account found! A recovery link has been sent.");
          }
        }}
      >
        <div className="space-y-2">
          <Label>Full name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Daniel Okafor" disabled={step > 1} />
        </div>

        {step >= 2 && (
          <div className="rounded-lg border border-border bg-secondary/40 p-4">
            <p className="text-sm font-medium">We found a possible match</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Confirm this account is yours to continue.
            </p>
            <label className="mt-3 flex items-center gap-2 rounded-md border border-border bg-card p-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
              <span className="text-sm font-semibold">{name || "Daniel Okafor"}</span>
              <CheckCircle2 className="ml-auto h-4 w-4 text-success" />
            </label>
          </div>
        )}

        {step >= 3 && (
          <div className="space-y-2">
            <Label>Phone number</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" />
          </div>
        )}

        <Button type="submit" size="lg" className="w-full bg-gradient-royal text-primary-foreground shadow-elegant hover:opacity-90">
          {step === 1 ? "Search" : step === 2 ? "Confirm account" : "Recover account"}
        </Button>
      </form>
    </AuthShell>
  );
}
