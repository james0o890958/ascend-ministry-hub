import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { LifeBuoy, BookOpen, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/help")({ component: HelpPage });

function HelpPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);

  const [chatMsg, setChatMsg] = useState("");
  const [chatLog, setChatLog] = useState<string[]>([
    "Hello! How can we assist your ministry today?",
  ]);

  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketBody, setTicketBody] = useState("");

  const handleAction = (title: string) => {
    if (title === "Documentation") {
      toast.info("Opening Soul Tracer Documentation");
      window.open("DOCUMENTATION.md", "_blank");
    } else if (title === "Live chat") {
      setChatOpen(true);
    } else if (title === "Email support") {
      window.location.href = "mailto:support@soultracker.com?subject=Ministry%20Hub%20Support";
    } else if (title === "Submit a ticket") {
      setTicketOpen(true);
    }
  };

  function sendChat() {
    if (!chatMsg.trim()) return;
    setChatLog((prev) => [
      ...prev,
      `You: ${chatMsg}`,
      "Agent: Thanks for reaching out! A support specialist is joining your chat.",
    ]);
    setChatMsg("");
  }

  function submitTicket() {
    if (!ticketSubject.trim()) {
      toast.error("Enter a subject");
      return;
    }
    toast.success(`Support ticket #${Math.floor(1000 + Math.random() * 9000)} created!`, {
      description: "Our support team will respond within 2 hours.",
    });
    setTicketOpen(false);
    setTicketSubject("");
    setTicketBody("");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Help & Support" subtitle="Guides, FAQs and ways to reach our team" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BookOpen, title: "Documentation", desc: "Read our quick-start guides." },
          { icon: MessageCircle, title: "Live chat", desc: "Chat with a specialist now." },
          { icon: Mail, title: "Email support", desc: "support@soultracker.com" },
          { icon: LifeBuoy, title: "Submit a ticket", desc: "Track issues end to end." },
        ].map((c) => (
          <SectionCard key={c.title}>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-royal text-primary-foreground">
              <c.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-display text-lg font-bold">{c.title}</h3>
            <p className="text-sm text-muted-foreground">{c.desc}</p>
            <Button variant="outline" className="mt-4 w-full" onClick={() => handleAction(c.title)}>
              Open
            </Button>
          </SectionCard>
        ))}
      </div>

      {/* Live Chat Modal */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Live Support Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="h-48 overflow-y-auto rounded-xl border border-border bg-secondary/30 p-3 text-xs space-y-2">
              {chatLog.map((msg, i) => (
                <div key={i} className="p-2 rounded-lg bg-card border border-border">
                  {msg}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Type your message..."
              />
              <Button className="bg-gradient-royal text-primary-foreground" onClick={sendChat}>
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Modal */}
      <Dialog open={ticketOpen} onOpenChange={setTicketOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Support Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <div className="space-y-1.5">
              <Label>Subject *</Label>
              <Input
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Issue with cell report sync..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={ticketBody}
                onChange={(e) => setTicketBody(e.target.value)}
                placeholder="Provide steps to reproduce or detail your question..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTicketOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-royal text-primary-foreground" onClick={submitTicket}>
              Submit ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
