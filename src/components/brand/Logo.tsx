import { Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, variant = "default" }: { className?: string; variant?: "default" | "light" }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-royal shadow-soft ring-1 ring-gold/30">
        <Flame className="h-4.5 w-4.5 text-gold" strokeWidth={2.5} />
        <span className="absolute -inset-0.5 rounded-xl bg-gradient-gold opacity-0 blur-md transition group-hover:opacity-40" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-lg font-bold tracking-tight", variant === "light" ? "text-white" : "text-foreground")}>
          Koinonia
        </span>
        <span className={cn("text-[10px] font-medium uppercase tracking-[0.18em]", variant === "light" ? "text-gold/90" : "text-gold")}>
          Ministry Tracking
        </span>
      </span>
    </Link>
  );
}
