import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BellRing, Check } from "lucide-react";
import { notifications } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/notifications")({ component: NotifPage });

function NotifPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" subtitle="All ministry notifications"
        action={<Button variant="outline" onClick={() => toast.success("All marked as read")}><Check className="mr-1 h-4 w-4"/>Mark all read</Button>}
      />
      <SectionCard>
        <ul className="divide-y divide-border">
          {notifications.concat(notifications).map((n, i) => (
            <li key={i} className="flex items-start gap-3 py-4">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-soft text-primary shrink-0"><BellRing className="h-4 w-4"/></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{n.title}</p>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.desc}</p>
              </div>
              {i < 2 && <Badge className="bg-gold text-gold-foreground">New</Badge>}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
