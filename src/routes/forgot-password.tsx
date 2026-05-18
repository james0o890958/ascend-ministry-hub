import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPage });

function ForgotPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a secure link to choose a new one."
      footer={<p className="text-center">Remembered it? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link></p>}
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label>Email address</Label>
          <Input type="email" placeholder="pastor@ministry.org" />
        </div>
        <Button className="w-full bg-gradient-royal text-primary-foreground shadow-elegant hover:opacity-90" size="lg">
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
