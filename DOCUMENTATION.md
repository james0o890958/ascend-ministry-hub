# Soul Tracer — Master Technical & Product Documentation

> **Soul Tracer** is an enterprise-grade ministry tracking platform for global churches. It shepherds every soul from first contact through salvation, water baptism, foundation school, cell group involvement, workforce service, and church leadership — across multiple branches of **Christ Embassy**.

This document serves as the **authoritative live reference** for the entire codebase architecture, domain data models, state stores, device responsive strategies, and backend REST API specifications.

---

## 1. Product & Architecture Overview

### 1.1 Core Concepts & Lifecycle Flow

Soul Tracer manages five independent concepts:

1. **Branch**: Physical or regional church assembly under Christ Embassy (e.g. *Christ Embassy Ebute 2*, *Lagos Central*). Configurable stage sequence & milestone catalog per branch. Archived on deletion.
2. **Role**: Fixed enum driving system permissions (`Admin`, `Branch Admin`, `Pastor`, `PCF Leader`, `Cell Leader`, `Member`).
3. **Member Stage**: Configurable ordered journey sequence per branch (defaults to standard 8 stages: *Invitee*, *First Timer*, *Regular Attendee*, *Baptized Member*, *Foundation School Student*, *Foundation School Graduate*, *Cell Member*, *Workforce Member*).
4. **Milestone**: Configurable non-sequential discipleship catalog per branch. Auto-suggests stage advancement upon completion.
5. **Soul**: 4-stage pipeline (*Contacted*, *Visited*, *Following Up*, *Converted*). On conversion, soul record is archived and linked to resulting `Member` record (`originSoulId`).

```
SOUL PIPELINE (4 Stages):
Contacted → Visited → Following Up → Converted (Archived & Linked to Member)

MEMBER JOURNEY (Configurable Sequence):
Invitee → First Timer → Regular Attendee → Baptized Member →
Foundation School Student → Foundation School Graduate → Cell Member → Workforce Member
```

---

### 1.2 User Roles & Access Matrix (`src/lib/permissions.ts`)

| Action | Admin | Branch Admin | Pastor | PCF Leader | Cell Leader | Member |
|---|---|---|---|---|---|---|
| Switch branch (topbar) | ✅ all branches | ❌ locked to own | ❌ locked to own | ❌ locked to own | ❌ locked to own | ❌ locked to own |
| Create/archive a Branch | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Assign Branch Admin/Pastor | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Assign/remove roles | ✅ (any branch) | ✅ own branch | ✅ own branch | ❌ | ❌ | ❌ |
| Edit Member Stage sequence | ✅ | ✅ own branch | ✅ own branch | ❌ | ❌ | ❌ |
| Edit Milestone catalog | ✅ | ✅ own branch | ✅ own branch | ❌ | ❌ | ❌ |
| Create/edit Cell, assign leader | ✅ | ✅ own branch | ✅ own branch | ❌ | ❌ | ❌ |
| Create global event | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create branch-local event | ✅ | ✅ own branch | ✅ own branch | ❌ | ❌ | ❌ |
| Record giving (linked/walk-in) | ✅ | ✅ own branch | ✅ own branch | ❌ | ❌ | ❌ |
| View global KPIs | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View own-branch KPIs | ✅ | ✅ | ✅ | ✅ (own cells) | ✅ (own cell) | ❌ |
| Add/edit Souls & follow-ups | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Convert Soul → Member | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| View profile & giving history | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register for events | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 2. Persistence Layer (`localStorage` Schema)

State is managed via modular reactive stores using `useSyncExternalStore` and persisted in `localStorage` under `soultracer:*` keys:

| Key | Contents | Description |
|---|---|---|
| `soultracer:branches` | `Branch[]` | Includes each branch's custom `stages[]` and `milestones[]` catalog |
| `soultracer:members` | `Member[]` | Member roster, roles, stages, milestones checklist, and branch attribution |
| `soultracer:souls` | `Soul[]` | 4-stage soul pipeline, notes, follow-up logs, and conversion history |
| `soultracer:cells` | `CellGroup[]` | Cell groups and leadership assignments scoped to branches |
| `soultracer:events` | `ChurchEvent[]` | Global (`scope = global`) and branch-local events and member registrations |
| `soultracer:giving` | `GivingRecord[]` | Member-linked and walk-in giving records with branch attribution |
| `soultracer:giving_configs` | `GivingTypeConfig[]` | Admin-configurable flags for ministry-wide rollup per giving type |
| `soultracer:currentSession` | `SessionState` | Active simulated user session (`{ memberId, role, branch }`) |

---

## 3. Responsive Breakpoints & Device Support

Soul Tracer enforces high-aesthetic UI responsiveness across device breakpoints (`xs` < 480px, `sm` 480-639px, `md` 640-1023px, `lg` 1024-1279px, `xl` 1280-1535px, `2xl` >= 1536px):
- **Navigation**: Collapsible sidebar on desktop, slide-over drawer on mobile.
- **Topbar**: Dynamic Branch Switcher dropdown locked for non-Admins.
- **Tables**: Horizontal scroll overflow containers on mobile with touch-friendly actions.

---

## 4. Maintenance Directive

> **Crucial Rule for Agents & Developers**:
> Whenever a new feature, data store, route, or API schema is added or modified, **`DOCUMENTATION.md` must be updated immediately** in the same change so it remains the living, accurate source of truth for the Soul Tracer platform.
