import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, BarChart3, Building2, CheckCircle2, ChevronRight, Compass,
  Globe2, HeartHandshake, LineChart, ShieldCheck, Sparkles, Users2,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { stats, branches, STAGES } from "@/lib/data";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  { icon: Users2, title: "Membership Lifecycle", desc: "Track every soul from first visit to ministry leadership with rich profiles and history." },
  { icon: Compass, title: "Discipleship Journey", desc: "Visual stage timeline — Invitee, First Timer, Baptized, Foundation, Cell, Worker, Leader, Pastor." },
  { icon: BarChart3, title: "Attendance Analytics", desc: "Service, midweek and cell attendance with monthly reports and percentage indicators." },
  { icon: HeartHandshake, title: "Cell Ministry", desc: "Assign members, monitor cell leaders, and analyse cell growth across every region." },
  { icon: Globe2, title: "Multi-Branch Control", desc: "Compare branches, view regional pastors and roll up statistics across the global ministry." },
  { icon: ShieldCheck, title: "Role-Based Access", desc: "Pastors, leaders, workers and admins each see exactly what they need." },
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }),
};

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-hero/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo variant="light" />
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
            <a href="#features" className="hover:text-gold transition">Features</a>
            <a href="#journey" className="hover:text-gold transition">Journey</a>
            <a href="#branches" className="hover:text-gold transition">Churches</a>
            <a href="#stats" className="hover:text-gold transition">Impact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-gold">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild className="bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold">
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,oklch(0.74_0.13_85/.5),transparent_45%),radial-gradient(circle_at_80%_60%,oklch(0.6_0.22_320/.3),transparent_50%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:py-32">
          <motion.div initial="hidden" animate="show" variants={fade}>
            <Badge variant="outline" className="border-gold/40 bg-white/5 text-gold backdrop-blur">
              <Sparkles className="mr-1.5 h-3 w-3" /> Built for global ministry
            </Badge>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] text-balance sm:text-6xl lg:text-7xl">
              Shepherd every soul, <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">across every branch.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              Soul tracer is the membership and discipleship operating system for global ministries — from the first visit to ordination, beautifully tracked across every church under your covering.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold">
                <Link to="/register">Start tracking free <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10">
                <Link to="/dashboard">View live demo</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
              {["No card required", "Role-based access", "Multi-branch ready"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-gold" /> {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Hero card preview */}
          <motion.div initial={{ opacity: 0, y: 40, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-gold/20 blur-2xl" />
            <div className="relative rounded-2xl border border-white/15 bg-white/5 p-5 shadow-elegant backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold">This Sunday</p>
                  <p className="font-display text-3xl font-bold">10,240 in service</p>
                </div>
                <Badge className="bg-success/20 text-success border border-success/30">+8.2% WoW</Badge>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "First Timers", value: "342" },
                  { label: "Baptisms", value: "27" },
                  { label: "New Cell", value: "18" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-[11px] uppercase tracking-wider text-white/60">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3">
                {[
                  { name: "Esther Adebayo", stage: "Baptized", pct: 80 },
                  { name: "Michael Bello", stage: "First Timer", pct: 18 },
                  { name: "Grace Mensah", stage: "Foundation", pct: 50 },
                ].map((m) => (
                  <div key={m.name} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-white">{m.name}</span>
                      <span className="text-gold">{m.stage}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full bg-gradient-gold" style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden bg-border md:grid-cols-4">
          {[
            { label: "Members tracked", value: stats.totalMembers.toLocaleString() + "+" },
            { label: "Active branches", value: stats.branches.toString() },
            { label: "Cell groups", value: "1,240" },
            { label: "Pastors raised", value: stats.pastors.toString() },
          ].map((s, i) => (
            <motion.div key={s.label} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} custom={i}
              className="bg-card p-8 text-center">
              <p className="font-display text-4xl font-bold text-primary">{s.value}</p>
              <p className="mt-1 text-sm uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="border-gold/40 text-gold">Platform</Badge>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Everything your ministry needs, in one sanctuary</h2>
          <p className="mt-4 text-muted-foreground">From attendance registers to ordination records — modular tools for the way the body of Christ actually grows.</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div key={f.title} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} custom={i}
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-elegant">
              <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-royal text-gold shadow-soft">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* JOURNEY */}
      <section id="journey" className="bg-gradient-to-b from-secondary/40 to-background">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="outline" className="border-gold/40 text-gold">Discipleship</Badge>
              <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl text-balance">A clear path from the pew to the pulpit</h2>
              <p className="mt-4 text-muted-foreground">Every member moves along a visual journey — with mentors, completion dates, notes and notifications at every stage.</p>
              <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary-glow">
                <Link to="/dashboard/journey">Explore the journey <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <ol className="relative space-y-3 border-l-2 border-dashed border-gold/40 pl-6">
              {STAGES.map((s, i) => (
                <motion.li key={s} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative rounded-xl border border-border bg-card p-4 shadow-soft">
                  <span className="absolute -left-[34px] grid h-6 w-6 place-items-center rounded-full bg-gradient-gold text-[11px] font-bold text-gold-foreground ring-4 ring-background">
                    {i + 1}
                  </span>
                  <p className="font-semibold">{s}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* BRANCHES */}
      <section id="branches" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="outline" className="border-gold/40 text-gold">Multi-branch</Badge>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">One covering. Every branch in sight.</h2>
          </div>
          <p className="max-w-md text-muted-foreground">Roll-up dashboards, branch comparison, regional pastors — everything HQ needs to shepherd at scale.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {branches.slice(0, 8).map((b, i) => (
            <motion.div key={b.id} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} custom={i}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:shadow-elegant">
              <div className="flex items-start justify-between">
                <Building2 className="h-5 w-5 text-gold" />
                <Badge variant="secondary" className="bg-success/10 text-success">+{b.growth}%</Badge>
              </div>
              <p className="mt-4 font-display text-lg font-semibold">{b.name}</p>
              <p className="text-xs text-muted-foreground">{b.country}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
                <span className="font-bold text-primary">{b.members.toLocaleString()}</span>
                <span className="text-muted-foreground">members</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-hero p-10 text-white shadow-elegant sm:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <LineChart className="h-8 w-8 text-gold" />
              <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl text-balance">
                Bring your ministry into <span className="text-gold">crystal clarity.</span>
              </h2>
              <p className="mt-4 max-w-xl text-white/75">Launch in minutes. Onboard branches, import members, and start seeing the journey today.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild size="lg" className="bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold">
                <Link to="/register">Create your account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10">
                <Link to="/dashboard">Tour the dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Koinonia is purpose-built for global ministries that disciple, raise leaders, and plant churches in every nation.
            </p>
          </div>
          <div>
            <p className="font-semibold">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary">Features</a></li>
              <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              <li><Link to="/dashboard/branches" className="hover:text-primary">Branches</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Ministry</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-primary">Sign in</Link></li>
              <li><Link to="/register" className="hover:text-primary">Get started</Link></li>
              <li><Link to="/forgot-password" className="hover:text-primary">Reset password</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
            <p>© {new Date().getFullYear()} Koinonia Ministry Platform. All rights reserved.</p>
            <p className="font-display italic text-gold">"Go ye therefore, and teach all nations." — Matthew 28:19</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
