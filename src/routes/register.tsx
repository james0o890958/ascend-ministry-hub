import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { branches } from "@/lib/data";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  return (
    <AuthShell
      title="Plant your church on Koinonia"
      subtitle="Create your ministry workspace in minutes."
      footer={<p className="text-center">Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link></p>}
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>First name</Label><Input placeholder="Daniel" /></div>
          <div className="space-y-2"><Label>Last name</Label><Input placeholder="Okafor" /></div>
        </div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="pastor@ministry.org" /></div>
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
