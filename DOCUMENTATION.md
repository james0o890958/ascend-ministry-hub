# Soul Tracer — Project Documentation

> **Soul Tracer** is a ministry tracking platform for churches: it follows every soul from first contact through salvation, baptism, foundation school, cell membership and leadership — across multiple branches of a global ministry.

This document is the complete technical and product reference for the codebase as it stands today. It is written for a new developer (or AI agent) joining the project.

---

## 1. Product overview

### 1.1 What the app does
Soul Tracer is a multi-role dashboard application for church ministries. It models the full **membership lifecycle**:

```
Invitee → First Timer → Regular Attendee → Baptized Member →
Foundation School Student → Foundation School Graduate →
Cell Member → Workforce Member → Leader → Pastor
```

It also tracks **Souls** — people being prayed for, followed up, discipled or ministered to who do *not* yet have a platform account. A Soul can later be **converted into a User**.

### 1.2 Primary user roles
Defined in `src/lib/role.tsx`:

| Role | What they see |
|------|---------------|
| **Admin** | Global KPIs across all branches, all menu items, leader approval |
| **Pastor** | Their branch's KPIs, cells, members, reports |
| **Cell Leader** | Their cell only — members, attendance, invitees |
| **Member** | Personal journey, events they're invited to |

The current role is held in `RoleProvider` (in-memory) and can be switched at runtime from the avatar dropdown (`View as …`). The sidebar filters nav items by role via the `roles?: Role[]` field on each `NavItem`.

### 1.3 Current state of the data layer
**There is no backend yet.** All data is dummy/seed data in:
- `src/lib/data.ts` — branches, members, events, invitees, cells, notifications, growth/attendance series, leader requests
- `src/lib/souls.ts` — souls store (with `getSouls`, `getSoulById`, `addSoulToStore` for in-memory persistence across navigation)

If/when Lovable Cloud is enabled, these stores become the canonical shape for the eventual Postgres schema.

---

## 2. Technology stack

| Layer | Choice |
|-------|--------|
| Framework | **TanStack Start v1** (React 19, SSR, server functions) |
| Routing | TanStack Router file-based (`src/routes/`) |
| Build / dev | Vite 7 via `@lovable.dev/vite-tanstack-config` |
| Runtime target | **Cloudflare Workers** (see `wrangler.jsonc`, `src/server.ts`) |
| Styling | **Tailwind CSS v4** (via `@tailwindcss/vite`, configured in `src/styles.css`) |
| Component library | **shadcn/ui** (Radix primitives in `src/components/ui/*`) |
| Data fetching | TanStack Query 5 (provider in `src/router.tsx`) |
| Forms | `react-hook-form` + `@hookform/resolvers` (zod-ready) |
| Charts | `recharts` |
| Animation | `framer-motion` |
| Icons | `lucide-react` |
| Toasts | `sonner` |
| Fonts | `Playfair Display` (display) + `Plus Jakarta Sans` (sans), loaded via `<link>` in `__root.tsx` |

Lint: `eslint`. Format: `prettier`. Type-check: `tsgo`.

---

## 3. Project structure

```
.
├── src/
│   ├── routes/                 # File-based routes (TanStack Router)
│   ├── components/
│   │   ├── auth/AuthShell.tsx
│   │   ├── brand/Logo.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardShell.tsx  # Sidebar + topbar layout
│   │   │   ├── ReportComparison.tsx
│   │   │   └── ui.tsx              # PageHeader, StatCard, SectionCard
│   │   └── ui/                     # shadcn/ui primitives
│   ├── lib/
│   │   ├── data.ts                 # Dummy seed data
│   │   ├── souls.ts                # Souls in-memory store (+ updateSoul, addSoulFollowUp)
│   │   ├── events-store.ts         # In-memory events store with subscribe (useSyncExternalStore)
│   │   ├── giving-store.ts         # In-memory giving/partnership store with subscribe
│   │   ├── admins-store.ts         # In-memory admin roster + invites (Admin-only)
│   │   ├── role.tsx                # RoleProvider + useRole
│   │   ├── current-church.tsx      # CurrentChurchProvider + useCurrentChurch
│   │   ├── utils.ts                # cn()
│   │   ├── error-capture.ts        # SSR error capture for branded 500 page
│   │   └── error-page.ts           # renderErrorPage()
│   ├── hooks/use-mobile.tsx
│   ├── styles.css                  # Tailwind v4 entry + theme tokens
│   ├── router.tsx                  # createRouter (+ QueryClient context)
│   ├── start.ts                    # createStart + request middleware
│   ├── server.ts                   # Worker fetch handler (SSR + error wrap)
│   └── routeTree.gen.ts            # AUTO-GENERATED — never edit
├── vite.config.ts                  # Re-export of @lovable.dev/vite-tanstack-config
├── wrangler.jsonc                  # Cloudflare Worker config
├── components.json                 # shadcn config
└── package.json
```

### 3.1 What is generated vs. authored
- `src/routeTree.gen.ts` — **generated** by the TanStack Router Vite plugin from filenames in `src/routes/`. Never edit by hand.
- Everything else under `src/` is authored.

---

## 4. Routing

### 4.1 Conventions
TanStack Router uses **flat dot-separated filenames** that map directly to URLs:

| File | URL |
|------|-----|
| `index.tsx` | `/` |
| `login.tsx` | `/login` |
| `dashboard.tsx` | `/dashboard` (layout — renders `<Outlet />`) |
| `dashboard.index.tsx` | `/dashboard` (leaf, the overview page) |
| `dashboard.groups.index.tsx` | `/dashboard/groups` (souls list) |
| `dashboard.groups.$id.tsx` | `/dashboard/groups/:id` (soul profile) |
| `dashboard.members.$id.tsx` | `/dashboard/members/:id` |
| `dashboard.church.$id.tsx` | `/dashboard/church/:id` |
| `dashboard.events.$id.tsx` | `/dashboard/events/:id` |
| `dashboard.events.new.tsx` | `/dashboard/events/new` (create event form) |
| `dashboard.admins.tsx` | `/dashboard/admins` (Admin-only roster + invites) |

The string in `createFileRoute("...")` MUST match the generated route ID — see the bottom of `src/routeTree.gen.ts` to verify.

### 4.2 Root route
`src/routes/__root.tsx` defines:
- HTML shell (`<html>`, `<head>`, `<body>`) via `shellComponent`
- Default SEO meta tags (title, description, OG, Twitter)
- Google Fonts `<link>` tags (Plus Jakarta Sans + Playfair Display)
- The Tailwind stylesheet import (`appCss`)
- `<QueryClientProvider>` + `<Toaster>`
- A branded `404` `notFoundComponent` and a branded `errorComponent` with a "Try again" button that calls both `router.invalidate()` and `reset()`

### 4.3 Dashboard layout
`src/routes/dashboard.tsx` wraps every `/dashboard/*` route with:
```tsx
<RoleProvider>
  <CurrentChurchProvider>
    <DashboardShell><Outlet /></DashboardShell>
  </CurrentChurchProvider>
</RoleProvider>
```
So role and current-church context are available to every dashboard page. Adding a new dashboard page = drop a file in `src/routes/dashboard.*.tsx` and it inherits the shell.

### 4.4 Route inventory

**Public**
- `/` — Marketing landing page (`index.tsx`) — hero, features, branches, stage timeline (uses `framer-motion`)
- `/login`, `/register`, `/forgot-password`, `/find-account` — wrapped in `AuthShell`

**Dashboard (under `/dashboard/*`)**

| Path | File | Purpose |
|------|------|---------|
| `/dashboard` | `dashboard.index.tsx` | Role-aware KPI overview |
| `/dashboard/church` | `dashboard.church.index.tsx` | Branch list |
| `/dashboard/church/:id` | `dashboard.church.$id.tsx` | Branch detail |
| `/dashboard/cells` | `dashboard.cells.tsx` | Cell ministry list |
| `/dashboard/groups` | `dashboard.groups.index.tsx` | **Souls** list with filter, add-soul dialog |
| `/dashboard/groups/:id` | `dashboard.groups.$id.tsx` | **Soul profile** (Metronic-style scroll-spy page) |
| `/dashboard/events` | `dashboard.events.index.tsx` | Events list (reads from `events-store`) |
| `/dashboard/events/new` | `dashboard.events.new.tsx` | Full-page **New Event** form (Admin / Pastor / Cell Leader) |
| `/dashboard/events/:id` | `dashboard.events.$id.tsx` | Event detail (attendees) |
| `/dashboard/members` | `dashboard.members.index.tsx` | Member directory |
| `/dashboard/members/:id` | `dashboard.members.$id.tsx` | Member profile + journey timeline |
| `/dashboard/tasks` | `dashboard.tasks.tsx` | Tasks board (Open / Done / High priority filters, edit + delete) |
| `/dashboard/giving` | `dashboard.giving.tsx` | Giving + partnership records (Admin / Pastor can add & delete) |
| `/dashboard/admins` | `dashboard.admins.tsx` | **Admin roster + invite dialog** (Admin-only) |
| `/dashboard/leadership` | `dashboard.leadership.tsx` | Leader-request approval queue |
| `/dashboard/invitees` | `dashboard.invitees.tsx` | Personal invitees |
| `/dashboard/messages` | `dashboard.messages.tsx` | Inbox |
| `/dashboard/notifications` | `dashboard.notifications.tsx` | Full notifications list |
| `/dashboard/reports` | `dashboard.reports.tsx` | Reports + branch comparison |
| `/dashboard/profile` | `dashboard.profile.tsx` | Current user profile |
| `/dashboard/settings` | `dashboard.settings.tsx` | App settings |
| `/dashboard/help` | `dashboard.help.tsx` | Help & support |

---

## 5. Design system

### 5.1 Theme tokens
All colors, gradients and shadows are defined as semantic tokens in `src/styles.css` under `@theme inline { … }` and consumed via Tailwind utility classes (`bg-primary`, `text-gold`, `bg-gradient-royal`, `shadow-elegant`, etc.).

**Brand palette**
- **Royal blue** — primary (`bg-primary`, `text-primary`, `bg-gradient-royal`)
- **Gold** — accent (`text-gold`, `bg-gold`, `bg-gold-soft`, `bg-gradient-gold`)
- `success`, `destructive`, `muted`, `border`, `card`, `sidebar`, `sidebar-accent`, `sidebar-border` — all token-driven

**Never** hardcode `text-white`, `bg-black`, `#hex` color utilities in components — they bypass theming.

**Typography**
- `font-display` → Playfair Display (page titles, stat values)
- `font-sans` → Plus Jakarta Sans (body, default)

### 5.2 Reusable dashboard primitives
`src/components/dashboard/ui.tsx` exports three building blocks used across nearly every dashboard page:

- **`<PageHeader title subtitle action />`** — large display title + subtitle + right-aligned action slot
- **`<StatCard label value icon change accent hint />`** — KPI card with icon, optional trend %, gradient accent (`primary | gold | success | blue`), hover lift
- **`<SectionCard title action>{children}</SectionCard>`** — bordered card with optional header row

### 5.3 Sidebar / shell
`src/components/dashboard/DashboardShell.tsx` provides:
- **Collapsible sidebar** — toggle button persists collapse state; when collapsed, hovering the sidebar expands it (`group/sidebar` + `lg:hover:w-72`) and reveals labels
- **Role-filtered nav** — `nav[].roles` controls visibility
- **Mobile drawer** — slides in on `<lg`, dimmed overlay
- **Sticky top bar** — search, notifications popover (uses `notifications` from `data.ts`), avatar menu with role switcher and logout link
- Active link gets `bg-gradient-to-r from-sidebar-accent`, a gold icon background and a small gold dot indicator

---

## 6. Key features deep-dive

### 6.1 Souls (`/dashboard/groups`)
A **Soul** = a person being followed up who does not yet have a platform account.

**Model** (`src/lib/souls.ts`):
```ts
Soul {
  id, name, phone, email?, location?,
  stage: "Contacted" | "Visited" | "Following Up" | "Converted" | "Discipled",
  invitedBy, date, mentor, avatar?,
  badges: SoulBadge[],          // Born Again, Baptized, Spirit Filled, ...
  milestones: SoulMilestone[],  // Salvation / Baptism / Discipleship / Ministry / Moment
  prayers: SoulPrayer[],        // Active | Answered
  followUps: SoulFollowUp[],    // Call / Visit / Meeting / Message
  noteLog: SoulNote[],
  growth: { discipleship, bibleStudy, churchInvolvement, followUpCompletion }  // 0..100
}
```

**List page** (`dashboard.groups.index.tsx`) — search by name/inviter, filter by stage, "Add soul" dialog (writes to `addSoulToStore`), grid of cards each with a single **View** button → `/dashboard/groups/$id`.

**Profile page** (`dashboard.groups.$id.tsx`) — Metronic-inspired single scrollable page with:
- Profile header: avatar, name, stage, mentor, date added, quick stats, spiritual badges
- Sticky scroll-spy nav: Overview · Spiritual Journey · Prayer Requests · Follow-Up History · Notes · Growth Tracker
- Header action buttons including **Convert to User**

### 6.2 Tasks (`/dashboard/tasks`)
Tabs/chips for **Open**, **Done**, **High priority** filter the task list. Each task supports **edit** and **delete**. Brand colors maintained.

### 6.3 Role-aware overview (`/dashboard`)
The dashboard root computes a different set of KPI rows based on `useRole()`, so an Admin sees global stats, a Pastor sees their branch, a Cell Leader sees their cell, a Member sees personal stats.

### 6.4 Branch-aware UI
`CurrentChurchProvider` (`src/lib/current-church.tsx`) holds the currently-selected branch so branch-scoped pages can switch context without prop drilling.

---

## 7. SSR, server runtime & errors

### 7.1 The Worker entry
`src/server.ts` is the Cloudflare Worker `fetch` handler. It:
1. Delegates to TanStack Start's bundled `server-entry`
2. Wraps the response in `normalizeCatastrophicSsrResponse` — h3 sometimes swallows in-handler throws into a JSON 500 (`{"unhandled":true,"message":"HTTPError"}`); we detect that shape and replace it with our branded HTML error page (`renderErrorPage()`)
3. Falls back to the branded error page on any other thrown error

`vite.config.ts` redirects TanStack Start's server entry to `server` so this wrapper runs in both dev and production builds.

### 7.2 Request middleware
`src/start.ts` registers an `errorMiddleware` that catches errors thrown inside server functions and returns the branded HTML 500.

### 7.3 Constraints (Cloudflare workerd)
- `process.env` is server-only — read inside `.handler()`, never at module scope of shared files
- No `child_process`, `sharp`, `canvas`, `puppeteer`, `fs.watch`
- Public client config goes through `import.meta.env.VITE_*`

---

## 8. State, data flow and persistence

### 8.1 Today
- **React state + Context** for role (`RoleProvider`) and current church (`CurrentChurchProvider`)
- **Module-level store** for souls (`soulStore` in `src/lib/souls.ts`) — persists across route changes within a session but resets on full reload
- **Seed data** in `src/lib/data.ts` is treated as read-only

### 8.2 When persistence is needed
Enable **Lovable Cloud** to get a Postgres database, auth, storage, edge functions and secrets. The shapes in `data.ts` / `souls.ts` are the natural starting schema. Auth-protected server functions should use `requireSupabaseAuth` middleware and the project-managed Supabase clients (see project rules).

---

## 9. Adding things — recipes

### 9.1 Add a new dashboard page
1. Create `src/routes/dashboard.<thing>.tsx`
2. Export `Route = createFileRoute("/dashboard/<thing>")({ component: MyPage })`
3. Use `PageHeader`, `StatCard`, `SectionCard` for layout consistency
4. Add an entry to `nav[]` in `DashboardShell.tsx` (with optional `roles` array)
5. The TanStack Router plugin regenerates `routeTree.gen.ts` automatically

### 9.2 Add a new dynamic route
- File: `src/routes/dashboard.thing.$id.tsx`
- Component reads params: `const { id } = Route.useParams()`
- Link to it: `<Link to="/dashboard/thing/$id" params={{ id }}>View</Link>` — never `<a href>`

### 9.3 Add a shadcn component
Already-installed primitives live in `src/components/ui/*`. To add another, install via shadcn conventions (Radix dep + a wrapper in `src/components/ui/`).

### 9.4 Add a new color / gradient
Define the token in `src/styles.css` under `@theme inline`, then use it via Tailwind utility (`bg-<token>`). Never hex-literal in a component.

---

## 10. Running, building, deploying

```bash
bun dev           # vite dev server (used in the sandbox preview)
bun run build     # production build (Cloudflare Worker target)
bun run build:dev # development-mode build (used for build-time checks)
bun run preview   # preview production build locally
bun run lint
bun run format
```

The build target is a Cloudflare Worker — `wrangler.jsonc` sets `main: src/server.ts`. The `@cloudflare/vite-plugin` (auto-included by `@lovable.dev/vite-tanstack-config`) bundles everything for `workerd`. Lovable handles publishing — there is no separate deploy step.

---

## 11. Known invariants & gotchas

1. **Never edit `src/routeTree.gen.ts`** — it is regenerated every build.
2. **`createFileRoute("...")` string must match the filename** — mismatch crashes the build with a route-tree path error.
3. **Layout routes must render `<Outlet />`** — `dashboard.tsx` does this. Removing it makes every child page blank.
4. **Souls persistence is module-level**, not React state. Always call `getSouls()` / `addSoulToStore()` rather than rebuilding an array from seed.
5. **Tailwind v4** uses `@theme inline` + native `@import` in `src/styles.css`. Don't add a legacy `tailwind.config.js`. Don't `@import` remote URLs from CSS — use a `<link>` in `__root.tsx`.
6. **Brand colors are blue + gold** — keep that direction unless the user asks otherwise.
7. **Hover-expand sidebar** depends on the `group/sidebar` class + `lg:hover:w-72`; don't replace the outer `<aside>` without preserving both.

---

## 12. File-by-file quick index

**Routes:** see §4.4. **Lib:**
- `src/lib/data.ts` — branches, members, events, invitees, cells, notifications, growth/attendance series, leader requests, member journey, attendance-for-date
- `src/lib/souls.ts` — Soul types + in-memory store
- `src/lib/role.tsx` — `RoleProvider`, `useRole`, `ROLES`
- `src/lib/current-church.tsx` — `CurrentChurchProvider`, `useCurrentChurch`
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge)
- `src/lib/error-capture.ts` + `error-page.ts` — SSR error capture + branded 500 HTML

**Components:**
- `src/components/dashboard/DashboardShell.tsx` — sidebar + topbar
- `src/components/dashboard/ui.tsx` — `PageHeader`, `StatCard`, `SectionCard`
- `src/components/dashboard/ReportComparison.tsx` — branch comparison chart used in Reports
- `src/components/auth/AuthShell.tsx` — auth pages frame
- `src/components/brand/Logo.tsx` — logo (light/dark variants)
- `src/components/ui/*` — shadcn primitives

---

## 13. Where to extend next

Likely near-term work (informed by the codebase's current shape):
- Enable **Lovable Cloud** and move `souls` + `members` + `events` to Postgres, behind `requireSupabaseAuth` server functions
- Real authentication on `/login` and `/register`
- Implement **Convert Soul to User** action on the soul profile page
- Persist task edits/deletes from `/dashboard/tasks` to the database
- Wire the topbar **Search** to a real query across members / souls / events
- Replace the in-memory role switcher with role rows in a `user_roles` table (per the project's user-roles rule)

---

*End of documentation.*
