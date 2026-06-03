import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CheckSquare, Plus, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/tasks")({ component: TasksPage });

type Task = { id: string; title: string; due: string; assignee: string; priority: "Low" | "Medium" | "High"; done: boolean };

const initial: Task[] = [
  { id: "t1", title: "Approve 3 new cell leaders", due: "2026-05-26", assignee: "Pst. D. Okafor", priority: "High", done: false },
  { id: "t2", title: "Confirm Sunday service rota", due: "2026-05-25", assignee: "Worship Team", priority: "Medium", done: false },
  { id: "t3", title: "Review weekly giving report", due: "2026-05-24", assignee: "Finance", priority: "Medium", done: true },
  { id: "t4", title: "Plan Foundation Module 4", due: "2026-06-01", assignee: "Discipleship", priority: "Low", done: false },
];

function TasksPage() {
  const [tasks, setTasks] = useState(initial);
  const [newTitle, setNewTitle] = useState("");

  function toggle(id: string) { setTasks((t) => t.map((x) => x.id === id ? { ...x, done: !x.done } : x)); }
  function add() {
    const title = newTitle.trim();
    if (!title) { toast.error("Enter a task title"); return; }
    const newTask: Task = { id: `t${Date.now()}`, title, due: new Date().toISOString().slice(0,10), assignee: "Unassigned", priority: "Medium", done: false };
    setTasks((t) => [newTask, ...t]);
    setNewTitle(""); toast.success("Task added");
  }

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="space-y-6">
      <PageHeader title="Tasks" subtitle="Coordinate ministry tasks across teams" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open" value={open.length} icon={Clock} accent="primary"/>
        <StatCard label="Done" value={done.length} icon={CheckCircle2} accent="success"/>
        <StatCard label="High priority" value={open.filter((t) => t.priority === "High").length} icon={CheckSquare} accent="gold"/>
      </div>

      <SectionCard title="Add task">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); add(); }}>
          <Input placeholder="Task title…" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <Button type="submit" className="bg-gradient-royal text-primary-foreground"><Plus className="mr-1 h-4 w-4"/>Add</Button>
        </form>
      </SectionCard>

      <SectionCard title="Tasks">
        <ul className="divide-y divide-border">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-center gap-3 py-3">
              <Checkbox checked={t.done} onCheckedChange={() => toggle(t.id)} />
              <div className="min-w-0 flex-1">
                <p className={t.done ? "line-through text-muted-foreground" : "font-semibold"}>{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.assignee} · due {new Date(t.due).toLocaleDateString()}</p>
              </div>
              <Badge variant="outline" className={t.priority === "High" ? "border-destructive/40 text-destructive" : t.priority === "Medium" ? "border-gold/40 text-gold-foreground bg-gold-soft" : ""}>{t.priority}</Badge>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
