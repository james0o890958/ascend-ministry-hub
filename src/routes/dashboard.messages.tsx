import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/messages")({ component: MessagesPage });

const threads = [
  { id: "1", name: "Pst. Grace Adeyemi", last: "See you at the leaders meeting.", time: "10m", unread: 2 },
  { id: "2", name: "Cell A-1 Leaders", last: "Outreach plan attached.", time: "1h", unread: 0 },
  { id: "3", name: "Esther Adebayo", last: "Thank you, Pastor.", time: "3h", unread: 0 },
  { id: "4", name: "Worship Team", last: "Rehearsal moved to 6pm.", time: "1d", unread: 5 },
];

const seed = [
  { from: "Pst. Grace Adeyemi", text: "Are we still on for Saturday?", mine: false },
  { from: "Me", text: "Yes — meeting starts at 10am sharp.", mine: true },
  { from: "Pst. Grace Adeyemi", text: "See you at the leaders meeting.", mine: false },
];

function MessagesPage() {
  const [active, setActive] = useState(threads[0].id);
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState(seed);
  const thread = threads.find((t) => t.id === active)!;

  function send() {
    if (!draft.trim()) return;
    setMsgs((m) => [...m, { from: "Me", text: draft, mine: true }]);
    setDraft(""); toast.success("Message sent");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" subtitle="Direct and group messages" />

      <SectionCard className="p-0 overflow-hidden">
        <div className="grid lg:grid-cols-[20rem_1fr] divide-x divide-border min-h-[28rem]">
          <div>
            <div className="p-3 border-b border-border"><Input placeholder="Search…"/></div>
            <ul className="divide-y divide-border">
              {threads.map((t) => (
                <li key={t.id}>
                  <button onClick={() => setActive(t.id)} className={cn("w-full text-left p-3 hover:bg-secondary/60 flex gap-3 items-center", active === t.id && "bg-secondary/70")}>
                    <Avatar className="h-9 w-9"><AvatarFallback>{t.name[0]}</AvatarFallback></Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{t.last}</p>
                    </div>
                    <div className="text-right text-xs"><div className="text-muted-foreground">{t.time}</div>{t.unread > 0 && <div className="mt-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-bold text-gold-foreground">{t.unread}</div>}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            <div className="p-4 border-b border-border"><p className="font-semibold">{thread.name}</p></div>
            <div className="flex-1 space-y-3 p-4 overflow-y-auto">
              {msgs.map((m, i) => (
                <div key={i} className={cn("flex", m.mine && "justify-end")}>
                  <div className={cn("max-w-[70%] rounded-2xl px-4 py-2 text-sm", m.mine ? "bg-gradient-royal text-primary-foreground" : "bg-secondary")}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-3 flex gap-2">
              <Textarea rows={1} placeholder="Type a message…" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} className="min-h-[2.5rem] resize-none" />
              <Button className="bg-gradient-royal text-primary-foreground" onClick={send}><Send className="h-4 w-4"/></Button>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
