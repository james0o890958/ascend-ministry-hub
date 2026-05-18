import { ReactNode, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Bell, ChevronDown, LayoutDashboard, Users, Compass, CalendarCheck,
  HeartHandshake, Crown, Building2, Settings, Search, Menu, X, LogOut,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { notifications } from "@/lib/data";
import { cn } from "@/lib/utils";

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/members", label: "Members", icon: Users },
  { to: "/dashboard/journey", label: "Journey", icon: Compass },
  { to: "/dashboard/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/dashboard/cells", label: "Cell Ministry", icon: HeartHandshake },
  { to: "/dashboard/leadership", label: "Leadership", icon: Crown },
  { to: "/dashboard/branches", label: "Branches", icon: Building2 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children }: { children?: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 transform border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-5 border-b border-sidebar-border">
          <Logo variant="light" />
          <button className="rounded-md p-1.5 text-white/70 hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">Ministry</p>
          {nav.map((item) => {
            const active = isActive(item.to, item.exact);
            return (
              <Link key={item.to} to={item.to as "/dashboard"} onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-gradient-to-r from-sidebar-accent to-sidebar-accent/40 text-white shadow-soft ring-1 ring-gold/30"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white"
                )}
              >
                <span className={cn(
                  "grid h-8 w-8 place-items-center rounded-lg transition",
                  active ? "bg-gold text-gold-foreground" : "bg-white/5 text-sidebar-foreground/70 group-hover:bg-white/10"
                )}>
                  <item.icon className="h-4 w-4" />
                </span>
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4">
          <div className="flex items-center gap-2 text-gold">
            <Crown className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">Pro tip</p>
          </div>
          <p className="mt-2 text-xs text-white/70">Schedule monthly branch reviews to track discipleship velocity.</p>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="lg:pl-72">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <button className="rounded-md p-2 hover:bg-secondary lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search members, cells, branches…" className="pl-9 bg-secondary/60 border-transparent focus-visible:bg-background" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold ring-2 ring-background" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <p className="font-semibold">Notifications</p>
                    <Badge variant="secondary" className="bg-gold-soft text-primary">{notifications.length} new</Badge>
                  </div>
                  <ul className="divide-y divide-border">
                    {notifications.map((n) => (
                      <li key={n.id} className="p-4 hover:bg-secondary/60 transition">
                        <div className="flex justify-between gap-3">
                          <p className="text-sm font-medium">{n.title}</p>
                          <span className="text-xs text-muted-foreground">{n.time}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{n.desc}</p>
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-3 hover:shadow-soft transition">
                    <Avatar className="h-8 w-8 ring-2 ring-gold/40">
                      <AvatarImage src="https://i.pravatar.cc/80?img=12" />
                      <AvatarFallback>DO</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-left text-xs sm:block">
                      <span className="block font-semibold">Pst. D. Okafor</span>
                      <span className="block text-muted-foreground">Lead Pastor</span>
                    </span>
                    <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/dashboard/settings">Settings</Link></DropdownMenuItem>
                  <DropdownMenuItem>Switch branch</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="text-destructive"><LogOut className="mr-2 h-4 w-4" />Sign out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
