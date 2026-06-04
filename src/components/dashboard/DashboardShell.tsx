import { ReactNode, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Bell, ChevronDown, LayoutDashboard, Church, HeartHandshake, Sparkles,
  CalendarDays, CheckSquare, HandCoins, MessageSquare, BellRing, BarChart3,
  Settings, LifeBuoy, Search, Menu, X, LogOut, ChevronsLeft, ChevronsRight,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { notifications } from "@/lib/data";
import { useRole, ROLES, Role } from "@/lib/role";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean; roles?: Role[] };

const nav: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/church", label: "Church Ministry", icon: Church, roles: ["Admin", "Pastor"] },
  { to: "/dashboard/cells", label: "Cell Ministry", icon: HeartHandshake, roles: ["Admin", "Pastor", "Cell Leader"] },
  { to: "/dashboard/groups", label: "Souls", icon: Sparkles },
  { to: "/dashboard/events", label: "Events", icon: CalendarDays },
  { to: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/dashboard/giving", label: "Giving", icon: HandCoins },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/notifications", label: "Notifications", icon: BellRing },
  { to: "/dashboard/reports", label: "Reports", icon: BarChart3, roles: ["Admin", "Pastor", "Cell Leader"] },
];

export function DashboardShell({ children }: { children?: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role, setRole } = useRole();

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  const visible = nav.filter((n) => !n.roles || n.roles.includes(role));

  return (
    <div className="min-h-screen bg-secondary/30">
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
        <nav className="flex flex-col gap-1 p-4 overflow-y-auto h-[calc(100vh-4rem)] pb-32">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">Ministry</p>
          {visible.map((item) => {
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
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-sidebar-border bg-sidebar text-sidebar-foreground shadow-elegant backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button className="rounded-md p-2 text-white hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden max-w-md flex-1 sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <Input placeholder="Search…" className="pl-9 bg-white/10 border-white/15 text-white placeholder:text-white/60 focus-visible:bg-white/15 focus-visible:ring-gold/40" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/15 hover:text-white">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold ring-2 ring-sidebar" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <p className="font-semibold">Notifications</p>
                    <Badge variant="secondary" className="bg-gold-soft text-primary">{notifications.length} new</Badge>
                  </div>
                  <ul className="divide-y divide-border max-h-80 overflow-y-auto">
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
                  <div className="border-t border-border p-2">
                    <Button asChild variant="ghost" size="sm" className="w-full"><Link to="/dashboard/notifications">View all</Link></Button>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 p-1 pr-3 text-white hover:bg-white/20 transition">
                    <Avatar className="h-8 w-8 ring-2 ring-gold/60">
                      <AvatarImage src="https://i.pravatar.cc/80?img=12" />
                      <AvatarFallback>DO</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-left text-xs sm:block">
                      <span className="block font-semibold">Pst. D. Okafor</span>
                      <span className="block text-white/70">{role}</span>
                    </span>
                    <ChevronDown className="hidden h-4 w-4 text-white/70 sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/dashboard/profile"><Avatar className="mr-2 h-4 w-4"><AvatarFallback>P</AvatarFallback></Avatar>Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/dashboard/settings"><Settings className="mr-2 h-4 w-4"/>Settings</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/dashboard/help"><LifeBuoy className="mr-2 h-4 w-4"/>Help &amp; Support</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">View as</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={role} onValueChange={(v) => setRole(v as Role)}>
                    {ROLES.map((r) => (
                      <DropdownMenuRadioItem key={r} value={r}>{r}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="text-destructive"><LogOut className="mr-2 h-4 w-4" />Logout</Link>
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
