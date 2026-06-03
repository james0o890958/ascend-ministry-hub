import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CheckSquare, Plus, Clock, CheckCircle2, Feather } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/tasks")({ component: TasksPage });

type Priority = "Low" | "Medium" | "High";
type Task = {
  id: string;
  title: string;
  description?: string;
  tag?: string;
  due: string;
  assignee: string;
  priority: Priority;
  done: boolean;
};

const initial: Task[] = [
  { id: "t1", title: "Approve 3 new cell leaders", due: "2026-05-26", assignee: "Pst. D. Okafor", priority: "High", done: false, tag: "Leadership" },
  { id: "t2", title: "Confirm Sunday service rota", due: "2026-05-25", assignee: "Worship Team", priority: "Medium", done: false, tag: "Worship" },
  { id: "t3", title: "Review weekly giving report", due: "2026-05-24", assignee: "Finance", priority: "Medium", done: true, tag: "Finance" },
  { id: "t4", title: "Plan Foundation Module 4", due: "2026-06-01", assignee: "Discipleship", priority: "Low", done: false, tag: "Discipleship" },
];

type Filter = "all" | "open" | "done" | "high";

const priorityDot: Record<Priority, string> = {
  High: "bg-destructive",
  Medium: "bg-gold",
  Low: "bg-success",
};

function TasksPage() {
  const [tasks, setTasks] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [priority, setPriority] = useState<Priority>("High");
  const [due, setDue] = useState("");

  function toggle(id: string) {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  }

  function add() {
    const t = title.trim();
    if (!t) { toast.error("Enter a task title"); return; }
    const newTask: Task = {
      id: `t${Date.now()}`,
      title: t,
      description: description.trim() || undefined,
      tag: tag.trim() || undefined,
      due: due || new Date().toISOString().slice(0, 10),
      assignee: "Unassigned",
      priority,
      done: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    setTitle(""); setDescription(""); setTag(""); setPriority("High"); setDue("");
    toast.success("Task added");
  }

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  const high = tasks.filter((t) => t.priority === "High" && !t.done);

  const visible = useMemo(() => {
    switch (filter) {
      case "open": return open;
      case "done": return done;
      case "high": return tasks.filter((t) => t.priority === "High");
      default: return tasks;
    }
  }, [filter, tasks, open, done]);

  return (
    <div className="space-y-6">
      <PageHeader title="Tasks" subtitle="Coordinate ministry tasks across teams" />

      <div className="grid gap-4 sm:grid-cols-3">
        <FilterStat active={filter === "open"} onClick={() => setFilter(filter === "open" ? "all" : "open")}>
          <StatCard label="Open" value={open.length} icon={Clock} accent="primary" hint={filter === "open" ? "Filtering" : "Click to filter"} />
        </FilterStat>
        <FilterStat active={filter === "done"} onClick={() => setFilter(filter === "done" ? "all" : "done")}>
          <StatCard label="Done" value={done.length} icon={CheckCircle2} accent="success" hint={filter === "done" ? "Filtering" : "Click to filter"} />
        </FilterStat>
        <FilterStat active={filter === "high"} onClick={() => setFilter(filter === "high" ? "all" : "high")}>
          <StatCard label="High priority" value={high.length} icon={CheckSquare} accent="gold" hint={filter === "high" ? "Filtering" : "Click to filter"} />
        </FilterStat>
      </div>

      <SectionCard title="Add task">
        <form
          className="space-y-3"
          onSubmit={(e) => { e.preventDefault(); add(); }}
        >
          <Input
            placeholder="Task title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-full h-11 px-5"
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-2xl px-5 py-3 min-h-[64px]"
          />
          <Input
            placeholder="Tag (e.g. Worship, Finance)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="rounded-full h-11 px-5"
          />
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger className="rounded-full h-11 px-5">
              <span className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", priorityDot[priority])} />
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-destructive" />High priority</span></SelectItem>
              <SelectItem value="Medium"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-gold" />Medium priority</span></SelectItem>
              <SelectItem value="Low"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-success" />Low priority</span></SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="rounded-full h-11 px-5"
          />
          <Button
            type="submit"
            className="w-full h-12 rounded-full bg-gradient-royal text-primary-foreground shadow-elegant hover:opacity-95"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-background text-primary">
              <Plus className="h-4 w-4" />
            </span>
            Add new task
          </Button>
        </form>
      </SectionCard>

      <SectionCard
        title={
          filter === "all" ? "All tasks" :
          filter === "open" ? "Open tasks" :
          filter === "done" ? "Completed tasks" : "High priority tasks"
        }
        action={filter !== "all" ? (
          <Button variant="ghost" size="sm" onClick={() => setFilter("all")}>Clear filter</Button>
        ) : undefined}
      >
        {visible.length === 0 ? (
          <div className="rounded-2xl bg-muted/40 py-10 text-center">
            <Feather className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-primary">No tasks yet — add a new task ✨</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3 transition hover:bg-muted/40 -mx-2 px-2 rounded-lg">
                <Checkbox checked={t.done} onCheckedChange={() => toggle(t.id)} />
                <div className="min-w-0 flex-1">
                  <p className={t.done ? "line-through text-muted-foreground" : "font-semibold"}>{t.title}</p>
                  {t.description && <p className="text-xs text-muted-foreground line-clamp-1">{t.description}</p>}
                  <p className="text-xs text-muted-foreground">
                    {t.tag ? `${t.tag} · ` : ""}{t.assignee} · due {new Date(t.due).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    t.priority === "High" && "border-destructive/40 text-destructive",
                    t.priority === "Medium" && "border-gold/40 text-gold-foreground bg-gold-soft",
                  )}
                >
                  {t.priority}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}

function FilterStat({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left rounded-2xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "ring-2 ring-gold shadow-elegant"
      )}
    >
      {children}
    </button>
  );
}
