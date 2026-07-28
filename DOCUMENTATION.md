# Soul Tracer — Master Technical & Product Documentation

> **Soul Tracer** is an enterprise-grade ministry tracking platform for global churches. It shepherds every soul from first contact through salvation, water baptism, foundation school, cell group involvement, workforce service, and church leadership — across multiple branches of a global ministry.

This document serves as the **authoritative live reference** for the entire codebase architecture, data models, state stores, device responsive strategies, and backend REST API specifications.

---

## 1. Product & Architecture Overview

### 1.1 Core Mission & Lifecycle Flow

Soul Tracer tracks the complete spiritual and discipleship lifecycle:

```
Contacted → Visited → Following Up → Converted (Registered Member) →
First Timer → Regular Attendee → Water Baptized → Foundation School Student →
Foundation School Graduate → Cell Member → Workforce Member → Cell Leader → Pastor → Admin
```

The system manages both:

1. **Souls**: Contacts, visitors, and converts being prayed for and discipled before or after registering.
2. **Members**: Registered church members with profile pages, attendance histories, cell groups, and giving records.

---

### 1.2 User Roles & Access Matrix (`src/lib/role.tsx`)

| Role            | Access Scope                                                                          | Menu Items Visible                                                                                                                   |
| :-------------- | :------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Admin**       | Global KPIs, all churches, full member directory, financial reports, admin management | All 11 navigation sections (Overview, Church, Cells, Souls, Events, Tasks, Giving, Messages, Notifications, Reports, Administrators) |
| **Pastor**      | Branch KPIs, branch cells, branch members, branch giving, event management            | Overview, Church, Cells, Souls, Events, Tasks, Giving, Messages, Notifications, Reports                                              |
| **Cell Leader** | Assigned cell groups, cell members, cell meetings, soul follow-ups                    | Overview, Cells, Souls, Events, Tasks, Messages, Notifications, Reports                                                              |
| **Member**      | Personal journey, assigned cell, invited events, prayer requests                      | Overview, Souls, Events, Tasks, Messages, Notifications                                                                              |

Role switching is available in runtime via the avatar dropdown (`View as...`) for testing and previewing role-scoped experiences.

---

## 2. In-Memory Reactive Data Stores

Since the project is currently in the frontend stage, state is managed via reactive in-memory stores using `useSyncExternalStore` for real-time reactivity without state lag:

| Data Store File                  | Key Exports                                                                                                                                      | Description                                                                                                             |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| `src/lib/members-store.ts`       | `getMembers()`, `getMemberById()`, `addMember()`, `importMembers()`, `subscribeMembers()`                                                        | Centralized member repository for list view (`/dashboard/members`) and member profile pages (`/dashboard/members/$id`). |
| `src/lib/souls.ts`               | `getSouls()`, `getSoulById()`, `addSoulToStore()`, `updateSoul()`, `addSoulFollowUp()`, `addSoulNote()`, `addSoulPrayer()`, `addSoulMilestone()` | Tracks souls through discipleship stages (_Contacted_, _Visited_, _Following Up_, _Converted_, _Discipled_).            |
| `src/lib/cell-meetings-store.ts` | `getCellMeetings()`, `addCellMeeting()`, `subscribeCellMeetings()`                                                                               | Cell group meeting schedule store with dynamic notification triggers.                                                   |
| `src/lib/notifications-store.ts` | `getNotifications()`, `addNotification()`, `markAllNotificationsRead()`, `subscribeNotifications()`                                              | Real-time topbar notification center for follow-ups, cell meetings, main church events, and admin invites.              |
| `src/lib/events-store.ts`        | `getEvents()`, `addEvent()`, `subscribeEvents()`                                                                                                 | Main church events repository published by Pastors & Admins.                                                            |
| `src/lib/giving-store.ts`        | `getGiving()`, `addGiving()`, `subscribeGiving()`                                                                                                | Tithes, offerings, partnership, and project funds giving store.                                                         |
| `src/lib/admins-store.ts`        | `getAdmins()`, `inviteAdmin()`, `removeAdmin()`, `subscribeAdmins()`                                                                             | Ministry administrator roster and invitation passkey generator.                                                         |
| `src/lib/current-church.tsx`     | `useCurrentChurch()`, `CurrentChurchProvider`                                                                                                    | Global branch selector context (_Lagos Central_, _Abuja Cathedral_, _Port Harcourt_, _All Branches_).                   |

---

## 3. Comprehensive Device Breakpoint & Responsive Strategy

To ensure Soul Tracer renders cleanly across **all device types**, the following design transformation matrix is enforced:

### 3.1 Device Breakpoints Reference

| Device Category                    | Screen Width Range | Target Devices                        | Key Responsive Adaptation                                                                      |
| :--------------------------------- | :----------------- | :------------------------------------ | :--------------------------------------------------------------------------------------------- |
| **`xs` (Compact Mobile)**          | `< 480px`          | iPhone SE, Compact Androids           | 1-column stack, full-screen modals, compact 44px touch targets, mobile card stacks for tables. |
| **`sm` (Phablets / Large Phones)** | `480px - 639px`    | iPhone Pro Max, Galaxy Ultra          | 2-column stat cards, horizontal scrollable tab bars, stacked form inputs.                      |
| **`md` (Tablets / iPads)**         | `640px - 1023px`   | iPad Mini, iPad Air, Surface Go       | Collapsible slide-over sidebar drawer, 2-column analytics grid, scrollable data tables.        |
| **`lg` (Laptops / Small Screens)** | `1024px - 1279px`  | MacBook Air, 13" Laptops              | Fixed 72px collapsed / 288px expanded sidebar, 3-column metric cards, full data tables.        |
| **`xl` (Desktops)**                | `1280px - 1535px`  | 24" Monitors, iMac                    | 4-column KPI cards, side-by-side split profile panels, wide data tables.                       |
| **`2xl` (Ultra-Wide Monitors)**    | `>= 1536px`        | 27"+ 4K Monitors, Ultra-wide Displays | Max container width constraint (`max-w-7xl mx-auto`), enhanced side margins.                   |

---

### 3.2 Specific Responsive Component Transformations

1. **Sidebar Navigation (`DashboardShell.tsx`)**:
   - **Mobile / Tablet (`< 1024px`)**: Hidden off-screen. Tapping topbar hamburger icon (`<Menu />`) slides out full-height navigation drawer.
   - **Desktop (`>= 1024px`)**: Fixed left panel with smooth toggle collapse (72px compact / 288px expanded).

2. **Sub-Navigation Tabs (`TabsList`)**:
   - **Mobile / Tablet (`< 768px`)**: Single horizontal swipeable bar (`flex-nowrap overflow-x-auto no-scrollbar pb-1`) preventing multi-line tab wrapping.
   - **Desktop (`>= 768px`)**: Stretched flex row filling available card width.

3. **Data Tables (Members, Souls, Giving, Admins)**:
   - **Mobile (`< 640px`)**: Table rows transform into **Mobile Card Stacks** displaying Avatar, Name, Stage Badge, and full-width touch buttons.
   - **Tablet / Desktop (`>= 640px`)**: Responsive data table with touch overflow container.

4. **Modals & Dialogs (`DialogContent`)**:
   - **Mobile (`< 640px`)**: Fits within 90% viewport height with bottom sheet behavior and internal scrolling.
   - **Desktop (`>= 640px`)**: Center-aligned modal dialog.

---

## 4. Backend REST API Endpoint & Payload Specifications

For future backend development, the following REST API specification outlines the exact endpoint paths, HTTP methods, request payloads, and response structures:

### 4.1 Souls Discipleship API (`/api/souls`)

```typescript
// GET /api/souls?branch={branchName}&stage={stageName}
// Response:
{
  souls: Soul[];
}

// POST /api/souls
// Request Body:
{
  name: string;
  phone: string;
  email?: string;
  location?: string;
  stage: "Contacted" | "Visited" | "Following Up" | "Converted" | "Discipled";
  invitedBy: string;
  mentor: string;
}
// Response: { soul: Soul }

// PATCH /api/souls/:id
// Request Body: Partial<Soul>
// Response: { soul: Soul }

// POST /api/souls/:id/followups
// Request Body:
{
  type: "Call" | "Visit" | "Meeting" | "Message";
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  by: string;
  notes: string;
}
// Response: { followUp: SoulFollowUp, soulStage: SoulStage }

// POST /api/souls/:id/convert
// Request Body:
{
  name: string;
  email: string;
  phone: string;
  branch: string;
  cell: string;
  stage: string;
  mentor: string;
}
// Response:
{
  member: Member;
  soul: Soul;
  credentials: {
    email: string;
    tempPasskey: string;
  };
}
```

---

### 4.2 Members Directory API (`/api/members`)

```typescript
// GET /api/members?branch={branchName}&cell={cellName}&search={q}
// Response: { members: Member[] }

// GET /api/members/:id
// Response: { member: Member, journey: JourneyItem[] }

// POST /api/members
// Request Body:
{
  name: string;
  email: string;
  phone: string;
  branch: string;
  stage: Stage;
  cell: string;
  mentor: string;
}
// Response: { member: Member }

// POST /api/members/import
// Request Body: { members: MemberInput[] }
// Response: { count: number, members: Member[] }
```

---

### 4.3 Cell Ministry API (`/api/cells`)

```typescript
// GET /api/cells?branch={branchName}
// Response: { cells: CellGroup[] }

// POST /api/cells/:id/meetings
// Request Body:
{
  title: string;
  date: string;
  time: string;
  location: string;
  agenda: string;
}
// Response: { meeting: CellMeeting, notificationsDispatched: number }

// POST /api/cells/:id/attendance
// Request Body:
{
  memberId: string;
  present: boolean;
}
// Response: { memberAttendance: number, cellOverallAttendance: number }
```

---

### 4.4 Giving & Financials API (`/api/giving`)

```typescript
// GET /api/giving?branch={branchName}
// Response: { records: GivingRecord[] }

// POST /api/giving
// Request Body:
{
  type: "Tithe" | "Offering" | "Partnership" | "Project";
  amount: number;
  source: string;
  branch: string;
  giver?: string;
  date: string;
}
// Response: { record: GivingRecord }
```

---

### 4.5 Events API (`/api/events`)

```typescript
// GET /api/events?branch={branchName}
// Response: { events: ChurchEvent[] }

// POST /api/events
// Request Body:
{
  name: string;
  type: "Service" | "Midweek" | "Cell" | "Crusade" | "Training";
  date: string;
  time: string;
  location: string;
  branch: string;
  capacity: number;
  description: string;
}
// Response: { event: ChurchEvent }
```

---

### 4.6 Administrators & Notifications API

```typescript
// GET /api/notifications
// Response: { notifications: NotificationItem[] }

// POST /api/admins/invite
// Request Body:
{
  name: string;
  email: string;
  scope: string;
  invitedBy: string;
}
// Response: { admin: AdminItem, tempPasskey: string }
```

---

## 5. Maintenance Directive

> **Crucial Rule for Agents & Developers**:
> Whenever a new feature, data store, route, or API schema is added or modified, **`DOCUMENTATION.md` must be updated immediately** in the same change so it remains the living, accurate source of truth for the Soul Tracer platform.
