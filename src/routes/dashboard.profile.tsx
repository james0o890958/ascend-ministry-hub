import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { memberJourney } from "@/lib/data";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/dashboard/profile")({ component: ProfilePage });

function ProfilePage() {
  const { role, userId } = useRole();
  const [name, setName] = useState("Daniel Okafor");
  const [email, setEmail] = useState("daniel.okafor@ministry.org");
  const [phone, setPhone] = useState("+234 801 234 5678");
  const journey = memberJourney(userId);

  const kindColor: Record<string, string> = {
    "Event Attended": "bg-primary/10 text-primary border-primary/20",
    "Role Held": "bg-gold-soft text-primary border-gold/30",
    "Group Joined": "bg-success/15 text-success border-success/30",
    "Stage": "bg-gradient-gold text-gold-foreground border-transparent",
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle="Manage your personal info and view your spiritual journey." />

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Personal info</TabsTrigger>
          <TabsTrigger value="journey">My journey</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <SectionCard title="Personal info">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 ring-4 ring-gold/40"><AvatarImage src="https://i.pravatar.cc/120?img=12" /><AvatarFallback>DO</AvatarFallback></Avatar>
              <div className="space-x-2"><Button variant="outline">Upload new</Button><Button variant="ghost">Remove</Button></div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Role</Label><Input value={role} disabled /></div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button className="bg-gradient-royal text-primary-foreground" onClick={() => toast.success("Profile updated")}>Save changes</Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="journey" className="mt-4">
          <SectionCard title="My spiritual journey">
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Event / Role / Group</th>
                    <th className="px-4 py-3 text-left">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {journey.map((j, i) => (
                    <tr key={i} className="hover:bg-secondary/40">
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{new Date(j.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className={kindColor[j.kind]}>{j.kind}</Badge></td>
                      <td className="px-4 py-3 font-semibold">{j.label}</td>
                      <td className="px-4 py-3 text-muted-foreground">{j.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
