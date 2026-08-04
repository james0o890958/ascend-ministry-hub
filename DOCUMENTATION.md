# Soul Tracer — Master Technical & Product Documentation

> **Soul Tracer** is an enterprise-grade ministry tracking platform for global churches. It shepherds every soul from first contact through salvation, water baptism, foundation school, cell group involvement, workforce service, and church leadership — across multiple branches of **Christ Embassy**.

This document serves as the **authoritative live reference** for the entire codebase architecture, tech stack, domain data models, state stores, theming, responsive strategies, and backend REST API specifications.

---

## 1. Product & Architecture Overview

### 1.1 Core Concepts & Lifecycle Flow

Soul Tracer manages five independent concepts:

1. **Branch**: Physical or regional church assembly under Christ Embassy (e.g. _Christ Embassy Ebute 2_, _Lagos Central_). Configurable stage sequence & milestone catalog per branch. Archived on deletion.
2. **Role**: Fixed enum driving system permissions (`Admin`, `Branch Admin`, `Pastor`, `PCF Leader`, `Cell Leader`, `Member`).
3. **Member Stage**: Configurable ordered journey sequence per branch (defaults to standard 8 stages: _Invitee_, _First Timer_, _Regular Attendee_, _Baptized Member_, _Foundation School Student_, _Foundation School Graduate_, _Cell Member_, _Workforce Member_). The landing page displays an extended 10-stage journey that also includes _Leader_ and _Pastor_.
4. **Milestone**: Configurable non-sequential discipleship catalog per branch. Auto-suggests stage advancement upon completion.
5. **Soul**: 4-stage pipeline (_Contacted_, _Visited_, _Following Up_, _Converted_). On conversion, soul record is archived and linked to resulting `Member` record (`originSoulId`).

```
SOUL PIPELINE (4 Stages):
Contacted → Visited → Following Up → Converted (Archived & Linked to Member)

MEMBER JOURNEY (Configurable Sequence, default 8 stages):
Invitee → First Timer → Regular Attendee → Baptized Member →
Foundation School Student → Foundation School Graduate → Cell Member → Workforce Member
```

---

### 1.2 User Roles & Access Matrix (`src/lib/permissions.ts`)

| Action                          | Admin           | Branch Admin     | Pastor           | PCF Leader       | Cell Leader      | Member           |
| ------------------------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Switch branch (topbar)          | ✅ all branches | ❌ locked to own | ❌ locked to own | ❌ locked to own | ❌ locked to own | ❌ locked to own |
| Create/archive a Branch         | ✅              | ❌               | ❌               | ❌               | ❌               | ❌               |
| Assign Branch Admin/Pastor      | ✅              | ❌               | ❌               | ❌               | ❌               | ❌               |
| Assign/remove roles             | ✅ (any branch) | ✅ own branch    | ✅ own branch    | ❌               | ❌               | ❌               |
| Edit Member Stage sequence      | ✅              | ✅ own branch    | ✅ own branch    | ❌               | ❌               | ❌               |
| Edit Milestone catalog          | ✅              | ✅ own branch    | ✅ own branch    | ❌               | ❌               | ❌               |
| Create/edit Cell, assign leader | ✅              | ✅ own branch    | ✅ own branch    | ❌               | ❌               | ❌               |
| Create global event             | ✅              | ❌               | ❌               | ❌               | ❌               | ❌               |
| Create branch-local event       | ✅              | ✅ own branch    | ✅ own branch    | ❌               | ❌               | ❌               |
| Record giving (on behalf)       | ✅              | ✅ own branch    | ✅ own branch    | ❌               | ❌               | ❌               |
| Self-report giving              | ✅              | ✅               | ✅               | ✅               | ✅               | ✅               |
| Verify/reject giving            | ✅              | ✅ own branch    | ✅ own branch    | ❌               | ❌               | ❌               |
| Configure giving types          | ✅              | ❌               | ❌               | ❌               | ❌               | ❌               |
| Set higher starting stage       | ✅              | ✅               | ✅               | ✅               | ✅               | ❌               |
| View global KPIs                | ✅              | ❌               | ❌               | ❌               | ❌               | ❌               |
| View own-branch KPIs            | ✅              | ✅               | ✅               | ✅ (own cells)   | ✅ (own cell)    | ❌               |
| Add/edit Souls & follow-ups     | ✅              | ✅               | ✅               | ✅               | ✅               | ✅               |
| Convert Soul → Member           | ✅              | ✅               | ✅               | ✅               | ✅               | ❌               |
| View profile & giving history   | ✅              | ✅               | ✅               | ✅               | ✅               | ✅               |
| Register for events             | ✅              | ✅               | ✅               | ✅               | ✅               | ✅               |

### 1.3 Currency Specification

All monetary inputs, metrics, KPIs, and reports are formatted and processed using the Naira (`₦`) symbol as the system-wide base currency.

---

## 2. Tech Stack

### 2.1 Core Framework

| Technology | Version | Purpose |
| --- | --- | --- |
| **React** | 19.x | UI rendering |
| **TanStack Start** | 1.x | Full-stack React framework (SSR-capable) |
| **TanStack Router** | 1.x | File-based routing with type safety |
| **TanStack React Query** | 5.x | Async state management |
| **Vite** | 7.x | Build tooling & dev server |
| **TypeScript** | 5.x | Type safety |

### 2.2 Styling & UI

| Technology | Purpose |
| --- | --- |
| **Tailwind CSS** 4.x | Utility-first CSS (v4 with `@theme inline` syntax) |
| **shadcn/ui** (Radix primitives) | 46 pre-built accessible UI components |
| **Framer Motion** 12.x | Animations & transitions |
| **Lucide React** | Icon library |
| **Recharts** 2.x | Data visualization / charts |

### 2.3 Forms & Utilities

| Technology | Purpose |
| --- | --- |
| **React Hook Form** + **Zod** | Form handling with schema validation |
| **date-fns** | Date formatting & manipulation |
| **Sonner** | Toast notifications |
| **cmdk** | Command palette / search |

### 2.4 Deployment Targets

The project includes config files for multiple deployment targets:
- **Vercel** (`vercel.json`)
- **Netlify** (`netlify.toml`)
- **Cloudflare Workers** (`wrangler.jsonc`, `@cloudflare/vite-plugin`)

---

## 3. Theming & Design System

### 3.1 Typography

| Token | Font | Usage |
| --- | --- | --- |
| `--font-sans` | Plus Jakarta Sans | Body text, UI, buttons, labels, nav — clean modern sans-serif |
| `--font-display` | Merriweather | Headings (`h1`–`h3`), `.font-display` — authoritative serif |
| `--font-serif` | Merriweather | Serif fallback |

Both fonts are loaded from Google Fonts in the root layout (`__root.tsx`).

### 3.2 Theme Provider (`src/lib/theme.tsx`)

- **Modes**: `light`, `dark`, `system`
- **Storage key**: `soul-tracer-theme` in `localStorage`
- **Mechanism**: Adds `.dark` or `.light` class to `<html>` element
- **Toggle**: Sun/Moon icon button present in both the landing page header and the dashboard topbar

### 3.3 Design Tokens (CSS Custom Properties)

All design tokens are defined in `src/styles.css` using `oklch()` color space with full light/dark mode overrides:

**Surfaces**: `--background`, `--foreground`, `--card`, `--popover`
**Brand**: `--primary` (Royal Blue), `--gold` (Gold accent), `--success`, `--destructive`
**Chrome**: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`

**Gradients** (override in dark mode for proper contrast):
- `--gradient-hero`: Landing page hero & CTA background
- `--gradient-royal`: Feature icon backgrounds, sidebar accents
- `--gradient-gold`: Gold CTA buttons, progress bars

**Shadows** (override in dark mode — black-based instead of blue-tinted):
- `--shadow-soft`, `--shadow-elegant`, `--shadow-gold`

---

## 4. Persistence Layer (`localStorage` Schema)

State is managed via modular reactive stores using `useSyncExternalStore`-compatible patterns and persisted in `localStorage` under `soultracer:*` keys:

| Key | Contents | Description |
| --- | --- | --- |
| `soultracer:branches` | `Branch[]` | Includes each branch's custom `stages[]` and `milestones[]` catalog |
| `soultracer:members` | `Member[]` | Member roster, roles, stages, milestones checklist, and branch attribution |
| `soultracer:souls` | `Soul[]` | 4-stage soul pipeline, notes, follow-up logs, badges, prayers, growth metrics, and conversion history |
| `soultracer:cells` | `CellGroup[]` | Cell groups and leadership assignments scoped to branches |
| `soultracer:events` | `ChurchEvent[]` | Global (`scope = global`) and branch-local events and member registrations |
| `soultracer:giving` | `GivingRecord[]` | Member-linked and walk-in giving records with branch attribution, verification status, payment channel, and receipt tracking |
| `soultracer:giving_configs` | `GivingTypeConfig[]` | Admin-configurable flags for ministry-wide rollup per giving type |
| `soultracer:pledges` | `PartnershipPledge[]` | Member partnership pledges with target/fulfilled amounts and completion status |
| `soultracer:bank_details` | `ChurchBankDetail[]` | Bank account details per branch (bank name, account number, account name) |
| `soultracer:currentSession` | `SessionState` | Active simulated user session (`{ memberId, role, branch }`) |

### 4.1 Store Modules (`src/lib/stores/`)

| File | localStorage Key | Description |
| --- | --- | --- |
| `branches-store.ts` | `soultracer:branches` | CRUD for branches with stage/milestone configuration |
| `members-store.ts` | `soultracer:members` | Member CRUD, role assignment, stage advancement |
| `souls-store.ts` | `soultracer:souls` | Soul pipeline CRUD, follow-ups, prayers, badges, conversion |
| `cells-store.ts` | `soultracer:cells` | Cell group management and leader assignment |
| `events-store.ts` | `soultracer:events` | Event CRUD and member registration |
| `giving-store.ts` | `soultracer:giving`, `soultracer:giving_configs`, `soultracer:pledges`, `soultracer:bank_details` | Full giving subsystem: transactions, type configs, partnership pledges, bank details |
| `session-store.ts` | `soultracer:currentSession` | Simulated session (member ID, role, branch) |
| `seed-data.ts` | _(initializes all keys)_ | Initial seed data for all stores, runs on first load |

### 4.2 In-Memory Stores (no localStorage persistence)

| File | Description |
| --- | --- |
| `admins-store.ts` | Admin invite/removal records (`AdminRecord[]`) |
| `cell-meetings-store.ts` | Cell meeting scheduling (`CellMeeting[]`) |
| `notifications-store.ts` | In-app notification feed (`NotificationItem[]`) |

### 4.3 React Context Providers

| File | Context | Description |
| --- | --- | --- |
| `theme.tsx` | `ThemeProvider` | Dark/light/system theme with localStorage persistence |
| `current-church.tsx` | `CurrentChurchProvider` | Active branch selection, branch switching for Admins |
| `role.tsx` | `RoleProvider` | Active user role, role simulation for demo purposes |

---

## 5. Frontend Routes & Pages

All routes are defined as file-based routes in `src/routes/` using TanStack Router conventions.

### 5.1 Public Routes

| File | Path | Description |
| --- | --- | --- |
| `index.tsx` | `/` | Landing page — hero, features, journey, branches, CTA, footer |
| `login.tsx` | `/login` | Login form |
| `register.tsx` | `/register` | Registration form |
| `forgot-password.tsx` | `/forgot-password` | Password reset flow |
| `find-account.tsx` | `/find-account` | Account lookup |

### 5.2 Dashboard Routes (under `/dashboard`)

| File | Path | Description |
| --- | --- | --- |
| `dashboard.tsx` | `/dashboard` | Dashboard layout wrapper (DashboardShell) |
| `dashboard.index.tsx` | `/dashboard` | Dashboard home — KPIs, charts, recent activity |
| `dashboard.members.index.tsx` | `/dashboard/members` | Members roster with filters and search |
| `dashboard.members.$id.tsx` | `/dashboard/members/:id` | Individual member profile and journey |
| `dashboard.groups.index.tsx` | `/dashboard/groups` | Groups overview |
| `dashboard.groups.$id.tsx` | `/dashboard/groups/:id` | Group detail with members and activity |
| `dashboard.cells.tsx` | `/dashboard/cells` | Cell group management |
| `dashboard.events.index.tsx` | `/dashboard/events` | Events list |
| `dashboard.events.$id.tsx` | `/dashboard/events/:id` | Event detail and registrations |
| `dashboard.events.new.tsx` | `/dashboard/events/new` | Create new event |
| `dashboard.giving.tsx` | `/dashboard/giving` | Giving/finance — transactions, pledges, bank details, verification |
| `dashboard.church.index.tsx` | `/dashboard/church` | Branch management — list, compare, configure |
| `dashboard.church.$id.tsx` | `/dashboard/church/:id` | Individual branch detail and settings |
| `dashboard.tasks.tsx` | `/dashboard/tasks` | Task management |
| `dashboard.messages.tsx` | `/dashboard/messages` | Messaging |
| `dashboard.notifications.tsx` | `/dashboard/notifications` | Notification feed |
| `dashboard.reports.tsx` | `/dashboard/reports` | Reports and analytics |
| `dashboard.leadership.tsx` | `/dashboard/leadership` | Leadership pipeline |
| `dashboard.admins.tsx` | `/dashboard/admins` | Admin user management and invitations |
| `dashboard.invitees.tsx` | `/dashboard/invitees` | Invitee tracking |
| `dashboard.settings.tsx` | `/dashboard/settings` | App and branch settings |
| `dashboard.profile.tsx` | `/dashboard/profile` | User profile |
| `dashboard.help.tsx` | `/dashboard/help` | Help and support |

---

## 6. Component Architecture

### 6.1 Component Directories (`src/components/`)

| Directory | Contents |
| --- | --- |
| `ui/` | 46 shadcn/ui primitives (Button, Dialog, Table, Tabs, Select, Chart, Sidebar, etc.) |
| `dashboard/` | `DashboardShell.tsx` (main layout with sidebar, topbar, search, notifications, theme toggle, branch switcher), `ReportComparison.tsx` (multi-branch analytics), `ui.tsx` (shared dashboard UI primitives) |
| `brand/` | `Logo.tsx` — Soul Tracer logo with light/dark variants |
| `auth/` | `AuthShell.tsx` — shared authentication page layout |

### 6.2 DashboardShell (`src/components/dashboard/DashboardShell.tsx`)

The main dashboard chrome providing:
- **Collapsible sidebar** with role-filtered navigation
- **Top bar** with branch switcher (Admin only), global search, notification bell, theme toggle, user avatar dropdown
- **Role simulation** dropdown for demo/testing
- **Responsive drawer** on mobile viewports

---

## 7. Responsive Breakpoints & Device Support

Soul Tracer enforces high-aesthetic UI responsiveness across device breakpoints (`xs` < 480px, `sm` 480-639px, `md` 640-1023px, `lg` 1024-1279px, `xl` 1280-1535px, `2xl` >= 1536px):

- **Navigation**: Collapsible sidebar on desktop, slide-over drawer on mobile.
- **Topbar**: Dynamic Branch Switcher dropdown locked for non-Admins.
- **Tables**: Horizontal scroll overflow containers on mobile with touch-friendly actions.

---

## 8. Domain Type Reference (`src/types/domain.ts`)

### 8.1 Enums & Constants

```typescript
type Role = "Admin" | "Branch Admin" | "Pastor" | "PCF Leader" | "Cell Leader" | "Member";
type SoulStage = "Contacted" | "Visited" | "Following Up" | "Converted";
type SoulBadge = "Born Again" | "Baptized" | "Spirit Filled" | "New Convert" | "Faithful Attender" | "Tithing";
type GivingType = "Tithe" | "Offering" | "Project" | "Partnership" | "Seed";
type MemberOrigin = "evangelism" | "direct" | "transfer";
type EventScope = "global" | "branch";
```

### 8.2 Key Types

- **`Branch`**: id, name, location, country, pastor, status, stages[], milestones[], growth, membersCount, leadersCount
- **`Member`**: id, name, email, phone, branch, role, stage, milestones[], badges, cellId, mentor, joinedAt, avatar, status, originType, originSoulId, originBranch, attendance
- **`Soul`**: id, name, phone, email, stage, branch, invitedBy, mentor, badges[], milestones[], prayers[], followUps[], noteLog[], growth metrics (discipleship, bibleStudy, churchInvolvement, followUpCompletion)
- **`CellGroup`**: id, name, branch, leaderId, leader, members[], status, attendance, growth
- **`ChurchEvent`**: id, name, date, type, scope, branch, attendees, capacity, registeredMemberIds[], description
- **`GivingRecord`**: id, date, type, source, amount, branch, memberId, status (pending/verified/rejected), paymentChannel, receiptRef, receiptUrl, pledgeId, rejectionReason
- **`PartnershipPledge`**: id, memberId, memberName, branch, title, targetAmount, fulfilledAmount, status, createdAt
- **`ChurchBankDetail`**: branch, bankName, accountNumber, accountName
- **`GivingTypeConfig`**: type, isMinistryWideRollup
- **`SessionState`**: memberId, role, branch

---

## 9. Backend REST API Specifications (`soultracer-api`)

> **Note**: The frontend currently operates entirely on `localStorage` with seed data. The Laravel backend specification below represents the planned API contract for production deployment.

The Laravel backend (`soultracer-api`) provides RESTful endpoints under `/api/v1/` authenticated via Laravel Sanctum bearer tokens.

### 9.1 Endpoint Catalog

| Group | Method | Endpoint | Description & Access |
| --- | --- | --- | --- |
| **Auth** | `POST` | `/api/v1/auth/login` | Authenticate user & return Sanctum token + member profile |
| **Auth** | `POST` | `/api/v1/auth/logout` | Revoke active access token |
| **Auth** | `GET` | `/api/v1/auth/me` | Fetch active user session profile |
| **Branches** | `GET` | `/api/v1/branches` | List branches (Admin: all, Others: own branch) |
| **Branches** | `POST` | `/api/v1/branches` | Create branch (Admin only) |
| **Branches** | `PUT` | `/api/v1/branches/{branch}` | Update stage sequence, milestone catalog, or details |
| **Members** | `GET` | `/api/v1/members` | Roster list filtered by branch/role/stage |
| **Members** | `POST` | `/api/v1/members` | Register new member record |
| **Members** | `PATCH` | `/api/v1/members/{member}/role` | Assign role (Admin or Branch Admin/Pastor of branch) |
| **Souls** | `GET` | `/api/v1/souls` | List souls in 4-stage pipeline |
| **Souls** | `POST` | `/api/v1/souls` | Add new soul record |
| **Souls** | `POST` | `/api/v1/souls/{soul}/follow-ups` | Add follow-up log entry |
| **Souls** | `POST` | `/api/v1/souls/{soul}/convert` | Convert soul to member (archives soul, creates member with `origin_soul_id`) |
| **Cells** | `GET` | `/api/v1/cells` | List cell groups in branch |
| **Events** | `GET` | `/api/v1/events` | List global & branch-local events |
| **Events** | `POST` | `/api/v1/events/{event}/register` | Register member for an event |
| **Giving** | `GET` | `/api/v1/giving` | List giving transactions (amounts in Naira `₦`) |
| **Giving** | `POST` | `/api/v1/giving` | Record giving (walk-in or member-linked) |
| **Giving** | `GET/PUT` | `/api/v1/giving/configs` | Manage giving type ministry-wide rollup settings |
| **Giving** | `GET` | `/api/v1/giving/pledges` | List partnership pledges |
| **Giving** | `POST` | `/api/v1/giving/pledges` | Create or update partnership pledge |
| **Giving** | `PATCH` | `/api/v1/giving/{id}/verify` | Verify or reject a pending giving record |

---

## 10. Maintenance Directive

> **Crucial Rule for Agents & Developers**:
> Whenever a new feature, data store, route, or API schema is added or modified, **`DOCUMENTATION.md` must be updated immediately** in the same change so it remains the living, accurate source of truth for the Soul Tracer platform.
