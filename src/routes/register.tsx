import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { branches } from "@/lib/data";
import { Sparkles, Mail, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/register")({ component: RegisterPage });

const DOMAIN = "@soultracker.com";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/(^\.|\.$)/g, "");
}

function RegisterPage() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [noEmail, setNoEmail] = useState(false);
  const [localPart, setLocalPart] = useState("");

  const suggested = first || last ? `${slugify(`${first}.${last}`)}` || slugify(first) : "";
  const finalGenerated = (localPart || suggested) + DOMAIN;

  return (
    <AuthShell
      title="Plant your church on Soul Tracer"
      subtitle="Create your ministry workspace in minutes."
      footer={<p className="text-center">Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link></p>}
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>First name</Label><Input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Daniel" /></div>
          <div className="space-y-2"><Label>Last name</Label><Input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Okafor" /></div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          {!noEmail ? (
            <>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="pastor@ministry.org" />
              <button type="button" onClick={() => setNoEmail(true)} className="text-xs text-primary hover:underline">
                Don't have an email?
              </button>
            </>
          ) : (
            <>
              <div className="flex items-stretch overflow-hidden rounded-md border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
                <Input
                  value={localPart}
                  onChange={(e) => setLocalPart(slugify(e.target.value))}
                  placeholder={suggested || "preferred.name"}
                  className="flex-1 border-0 shadow-none focus-visible:ring-0"
                />
                <span className="flex items-center bg-secondary/60 px-3 text-sm font-medium text-muted-foreground border-l border-input">
                  {DOMAIN}
                </span>
              </div>
              <div className="rounded-lg border border-gold/30 bg-gold-soft/40 p-3 text-xs">
                <p className="flex items-center gap-1.5 font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5 text-gold" /> How it works
                </p>
                <ol className="mt-2 space-y-1.5 text-muted-foreground">
                  <li className="flex gap-2"><Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> We auto-suggest <span className="font-mono text-foreground">{suggested || "first.last"}{DOMAIN}</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> Edit it to something you prefer.</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> Your inbox is created at <span className="font-mono text-foreground">{finalGenerated || `you${DOMAIN}`}</span></li>
                </ol>
              </div>
              <button type="button" onClick={() => setNoEmail(false)} className="text-xs text-muted-foreground hover:text-primary hover:underline">
                I have an email after all
              </button>
            </>
          )}
        </div>

        <div className="space-y-2">
          <Label>Branch</Label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Select your branch" /></SelectTrigger>
            <SelectContent>
              {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name} — {b.country}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="At least 8 characters" /></div>
        <p className="text-xs text-muted-foreground">By creating an account you agree to our terms and ministry covenant.</p>
        <Button asChild className="w-full bg-gradient-royal text-primary-foreground shadow-elegant hover:opacity-90" size="lg">
          <Link to="/dashboard">Create account</Link>
        </Button>
      </form>
    </AuthShell>
  );
}
