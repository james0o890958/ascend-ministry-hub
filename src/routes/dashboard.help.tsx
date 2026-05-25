import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { LifeBuoy, BookOpen, Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard/help")({ component: HelpPage });

function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Help & Support" subtitle="Guides, FAQs and ways to reach our team" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: BookOpen, title: "Documentation", desc: "Read our quick-start guides." },
          { icon: MessageCircle, title: "Live chat", desc: "Chat with a specialist now." },
          { icon: Mail, title: "Email support", desc: "support@soultracker.com" },
          { icon: LifeBuoy, title: "Submit a ticket", desc: "Track issues end to end." },
        ].map((c) => (
          <SectionCard key={c.title}>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-royal text-primary-foreground"><c.icon className="h-5 w-5"/></span>
            <h3 className="mt-3 font-display text-lg font-bold">{c.title}</h3>
            <p className="text-sm text-muted-foreground">{c.desc}</p>
            <Button variant="outline" className="mt-3">Open</Button>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
