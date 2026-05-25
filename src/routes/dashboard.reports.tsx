import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { branches, cellGroups } from "@/lib/data";
import { ReportComparison } from "@/components/dashboard/ReportComparison";

export const Route = createFileRoute("/dashboard/reports")({ component: ReportsPage });

function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="Compare churches and cells across metrics and timeframes" />

      <Tabs defaultValue="churches">
        <TabsList>
          <TabsTrigger value="churches">Compare churches</TabsTrigger>
          <TabsTrigger value="cells">Compare cells</TabsTrigger>
        </TabsList>
        <TabsContent value="churches" className="mt-4">
          <ReportComparison label="Churches" entities={branches.map((b) => ({ id: b.id, name: b.name }))} />
        </TabsContent>
        <TabsContent value="cells" className="mt-4">
          <ReportComparison label="Cells" entities={cellGroups.map((c) => ({ id: c.id, name: `${c.name} · ${c.branch}` }))} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
