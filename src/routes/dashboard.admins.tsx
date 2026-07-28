import { useState, useSyncExternalStore } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, UserPlus, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addNotification } from "@/lib/notifications-store";
import { useRole } from "@/lib/role";
import { getAdmins, subscribeAdmins, inviteAdmin, removeAdmin } from "@/lib/admins-store";

export const Route = createFileRoute("/dashboard/admins")({ component: AdminsPage });

function AdminsPage() {
  const { role, userName } = useRole();
  const admins = useSyncExternalStore(subscribeAdmins, getAdmins, getAdmins);

  if (role !== "Admin") {
    return (
      <SectionCard title="Restricted">
        <p className="text-sm text-muted-foreground">
          Only Admins can view and manage administrators.
        </p>
      </SectionCard>
    );
  }

  const active = admins.filter((a) => a.status === "Active").length;
  const pending = admins.filter((a) => a.status === "Pending Invite").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrators"
        subtitle="Invite and manage other admins across the ministry"
        action={<InviteAdminDialog invitedBy={userName} />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total admins" value={admins.length} icon={Shield} accent="primary" />
        <StatCard label="Active" value={active} icon={Shield} accent="success" />
        <StatCard label="Pending invites" value={pending} icon={Mail} accent="gold" />
      </div>

      <SectionCard title="All administrators">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Admin</th>
                <th className="px-4 py-3 text-left">Scope</th>
                <th className="px-4 py-3 text-left">Invited by</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {admins.map((a) => (
                <tr key={a.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3">
                      <Link
                        to="/dashboard/members/$id"
                        params={{ id: "m1" }}
                        className="flex items-center gap-3 group hover:opacity-80 transition"
                      >
                        <Avatar className="h-8 w-8 ring-1 ring-gold/30">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">{a.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold group-hover:text-primary group-hover:underline transition">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{a.email}</p>
                        </div>
                      </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{a.scope}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.invitedBy}</td>
                  <td className="px-4 py-3">
                    {a.status === "Active" ? (
                      <Badge className="bg-success/15 text-success border-success/30">Active</Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-gold/40 text-gold-foreground bg-gold-soft"
                      >
                        Pending
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        removeAdmin(a.id);
                        toast.success(`${a.name} removed`);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function InviteAdminDialog({ invitedBy }: { invitedBy: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [scope, setScope] = useState("Global");

  function submit() {
    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }
    const tempPass = `ST-ADM-${Math.floor(1000 + Math.random() * 9000)}`;
    inviteAdmin({ name, email, scope, invitedBy });
    addNotification({
      title: `Admin Invitation Sent: ${name}`,
      desc: `Invited as ${scope} admin by ${invitedBy}. Temp Passkey: ${tempPass}`,
      time: "Just now",
    });
    toast.success(`Admin invite sent to ${email}`, {
      description: `Temporary Passkey: ${tempPass}`,
    });
    setOpen(false);
    setName("");
    setEmail("");
    setScope("Global");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-royal text-primary-foreground">
          <UserPlus className="mr-1 h-4 w-4" />
          Invite admin
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite another admin</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pst. Jane Doe"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@ministry.org"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Scope</Label>
            <Input
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="Global, region, or branch"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-gradient-royal text-primary-foreground" onClick={submit}>
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
