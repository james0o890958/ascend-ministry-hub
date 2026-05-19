import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/dashboard/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account, branch and notification preferences." />

      <Tabs defaultValue="profile">
        <TabsList className="bg-secondary">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="ministry">Ministry</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <SectionCard title="Your profile">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 ring-4 ring-gold/40"><AvatarImage src="https://i.pravatar.cc/120?img=12" /><AvatarFallback>DO</AvatarFallback></Avatar>
              <div className="space-x-2"><Button variant="outline">Upload new</Button><Button variant="ghost">Remove</Button></div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>First name</Label><Input defaultValue="Daniel" /></div>
              <div className="space-y-1.5"><Label>Last name</Label><Input defaultValue="Okafor" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Email</Label><Input defaultValue="daniel.okafor@ministry.org" /></div>
              <div className="space-y-1.5"><Label>Role</Label><Input defaultValue="Lead Pastor" /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+234 801 234 5678" /></div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-gradient-royal text-primary-foreground">Save changes</Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="ministry" className="mt-4">
          <SectionCard title="Ministry details">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Ministry name</Label><Input defaultValue="Soul Tracer Global" /></div>
              <div className="space-y-1.5"><Label>Headquarters</Label><Input defaultValue="Lagos, Nigeria" /></div>
              <div className="space-y-1.5"><Label>Founded</Label><Input defaultValue="1987" /></div>
              <div className="space-y-1.5"><Label>Vision statement</Label><Input defaultValue="Reaching the nations with the gospel of Christ." /></div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <SectionCard title="Notification preferences">
            <ul className="divide-y divide-border">
              {[
                ["New first-timers", "Get notified when a new soul visits."],
                ["Foundation graduations", "When students complete the curriculum."],
                ["Cell attendance alerts", "When cell attendance drops below 70%."],
                ["Ordinations & promotions", "Major leadership milestones."],
                ["Weekly digest email", "Every Monday at 6am."],
              ].map(([t, d], i) => (
                <li key={t} className="flex items-center justify-between py-4">
                  <div><p className="font-semibold">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
                  <Switch defaultChecked={i !== 4} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <SectionCard title="Security">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Current password</Label><Input type="password" /></div>
              <div className="space-y-1.5"><Label>New password</Label><Input type="password" /></div>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-xl border border-border p-4">
              <div><p className="font-semibold">Two-factor authentication</p><p className="text-sm text-muted-foreground">Add an extra layer of protection to your account.</p></div>
              <Switch />
            </div>
            <div className="mt-4 flex justify-end"><Button className="bg-gradient-royal text-primary-foreground">Update security</Button></div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
