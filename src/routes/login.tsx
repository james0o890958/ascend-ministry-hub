import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue shepherding your ministry."
      footer={<p className="text-center">New to Soul Tracer? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link></p>}
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="pastor@ministry.org" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" /><Label htmlFor="remember" className="text-sm font-normal">Remember me for 30 days</Label>
        </div>
        <Button asChild className="w-full bg-gradient-royal text-primary-foreground shadow-elegant hover:opacity-90" size="lg">
          <Link to="/dashboard">Sign in</Link>
        </Button>
        <div className="relative my-2 text-center text-xs uppercase tracking-widest text-muted-foreground">
          <span className="bg-background px-3 relative z-10">or continue with</span>
          <span className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" type="button">Google</Button>
          <Button variant="outline" type="button">Microsoft</Button>
        </div>
      </form>
    </AuthShell>
  );
}
