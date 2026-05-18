import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="flex gap-2">{action}</div>}
    </div>
  );
}

export function StatCard({
  label, value, icon: Icon, change, accent = "primary", hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  accent?: "primary" | "gold" | "success" | "blue";
  hint?: string;
}) {
  const up = (change ?? 0) >= 0;
  const accentMap: Record<string, string> = {
    primary: "bg-gradient-royal text-gold",
    gold: "bg-gradient-gold text-gold-foreground",
    success: "bg-success/15 text-success",
    blue: "bg-primary/10 text-primary",
  };
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <span className={cn("grid h-11 w-11 place-items-center rounded-xl shadow-soft", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs">
        {change !== undefined ? (
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
            up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {up ? "+" : ""}{change}%
          </span>
        ) : <span />}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
    </div>
  );
}

export function SectionCard({ title, action, children, className }: {
  title?: string; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-soft", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          {title && <h3 className="font-display text-lg font-semibold">{title}</h3>}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
