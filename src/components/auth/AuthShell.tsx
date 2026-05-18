import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";

export function AuthShell({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden overflow-hidden bg-gradient-hero text-white lg:flex">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,oklch(0.74_0.13_85/.5),transparent_45%),radial-gradient(circle_at_70%_80%,oklch(0.55_0.15_230/.45),transparent_50%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Logo variant="light" />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Koinonia Platform</p>
            <h2 className="mt-4 font-display text-5xl font-bold leading-tight text-balance">
              "Feed my sheep." <span className="block text-gold/90">— John 21:17</span>
            </h2>
            <p className="mt-6 max-w-md text-white/75">
              The discipleship operating system for global ministries. Track every soul, raise every leader, multiply every branch.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[["12k+","Members"],["36","Branches"],["48","Pastors"]].map(([v,l]) => (
                <div key={l} className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                  <p className="font-display text-2xl font-bold">{v}</p>
                  <p className="text-[11px] uppercase tracking-wider text-white/60">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Koinonia Ministry</p>
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="absolute right-6 top-6 lg:hidden"><Logo /></div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-sm text-muted-foreground">{footer}</div>}
          <p className="mt-10 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">← Back to home</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
