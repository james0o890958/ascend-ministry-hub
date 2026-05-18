import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatCard } from "@/components/dashboard/ui";
import { Crown, Sparkles, GraduationCap, Award, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { members } from "@/lib/data";

export const Route = createFileRoute("/dashboard/leadership")({ component: LeadershipPage });

const trainings = [
  { title: "Foundation Leadership 101", cohort: "Spring", students: 86, completion: 92 },
  { title: "Workers in Training", cohort: "Q3", students: 142, completion: 74 },
  { title: "Pastoral Formation", cohort: "Year 2", students: 24, completion: 61 },
  { title: "Cell Leader Bootcamp", cohort: "Aug", students: 58, completion: 88 },
];

const departments = ["Ushering", "Choir", "Media", "Children's Church", "Protocol", "Hospitality", "Sanctuary", "Evangelism"];

function LeadershipPage() {
  const leaders = members.slice(0, 8);
  return (
    <div className="space-y-6">
      <PageHeader title="Leadership Development" subtitle="Training, workers, ordinations and ministry deployments." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Workers" value="1,840" icon={Sparkles} change={4.2} accent="primary" />
        <StatCard label="Leaders" value="624" icon={Crown} change={3.1} accent="gold" />
        <StatCard label="In training" value="310" icon={GraduationCap} change={9.8} accent="success" />
        <StatCard label="Ordinations YTD" value="14" icon={Award} change={2.0} accent="blue" />
      </div>

      <Tabs defaultValue="training">
        <TabsList className="bg-secondary">
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="leaders">Leaders</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="ordinations">Ordinations</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="mt-4">
          <SectionCard title="Active training programs">
            <div className="grid gap-4 sm:grid-cols-2">
              {trainings.map((t) => (
                <div key={t.title} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-lg font-semibold">{t.title}</p>
                      <p className="text-xs text-muted-foreground">Cohort: {t.cohort} • {t.students} students</p>
                    </div>
                    <Badge variant="outline" className="border-gold/40 text-primary">{t.completion}%</Badge>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-gradient-gold" style={{ width: `${t.completion}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="leaders" className="mt-4">
          <SectionCard title="Active leaders">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {leaders.map((m) => (
                <div key={m.id} className="rounded-xl border border-border p-4 text-center">
                  <Avatar className="mx-auto h-14 w-14 ring-2 ring-gold/40"><AvatarImage src={m.avatar} /><AvatarFallback>{m.name[0]}</AvatarFallback></Avatar>
                  <p className="mt-2 font-semibold">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.branch}</p>
                  <Badge className="mt-2 bg-gradient-gold text-gold-foreground">Leader</Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="departments" className="mt-4">
          <SectionCard title="Department assignments">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {departments.map((d, i) => (
                <div key={d} className="rounded-xl border border-border p-5">
                  <p className="font-display text-base font-semibold">{d}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{40 + ((i * 17) % 60)} active workers</p>
                  <div className="mt-3 flex -space-x-2">
                    {members.slice(i, i + 4).map((m) => (
                      <Avatar key={m.id} className="h-7 w-7 border-2 border-card"><AvatarImage src={m.avatar} /><AvatarFallback>{m.name[0]}</AvatarFallback></Avatar>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="ordinations" className="mt-4">
          <SectionCard title="Pastor ordination history">
            <ol className="relative space-y-3 border-l-2 border-dashed border-gold/40 pl-6">
              {[
                { date: "Dec 14, 2025", who: "Pst. Samuel Idowu", branch: "Toronto North" },
                { date: "Sep 2, 2025", who: "Pst. Faith Wanjiru", branch: "Nairobi Light" },
                { date: "Jun 18, 2025", who: "Pst. Michael Eze", branch: "Houston Citadel" },
                { date: "Mar 4, 2025", who: "Pst. Ruth Akande", branch: "London Bridge" },
              ].map((o, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[34px] grid h-7 w-7 place-items-center rounded-full bg-gradient-gold text-gold-foreground ring-4 ring-background">
                    <Crown className="h-3.5 w-3.5" />
                  </span>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-display font-semibold">{o.who}</p>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{o.date}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Branch: {o.branch}</p>
                  </div>
                </li>
              ))}
            </ol>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
