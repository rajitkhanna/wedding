# Parallel Agent Tasks

Each task below is self-contained and can be implemented by a separate agent in parallel.
They share the design system (globals.css tokens) and InstantDB client (`src/lib/instant/db.ts`).

## Prerequisites (do first, sequentially)
1. Add real `NEXT_PUBLIC_INSTANT_APP_ID` to `.env.local`
2. Install 3D deps: `bun add @react-three/fiber @react-three/drei three @react-three/postprocessing && bun add -d @types/three`
3. Update `src/lib/instant/schema.ts` with the schema from spec/08
4. Push schema + perms to InstantDB: `npx instant-cli@latest push`

---

## Agent Task Breakdown

### Agent 1 — 3D Rose Home Page
**Files:** `src/app/page.tsx`, `src/components/three/*`, `src/components/home/*`
**Spec:** `spec/01-home.md`
**Dependencies:** Three.js deps installed
**Deliverable:** Scroll-driven rose opening, name overlay, nav cards

### Agent 2 — Our Story Page
**Files:** `src/app/story/page.tsx`, `src/components/story/*`
**Spec:** `spec/02-story.md`
**Dependencies:** InstantDB app ID set
**Deliverable:** Timeline with photo grid from `$files`, chapter structure

### Agent 3 — Schedule (Auth-Gated)
**Files:** `src/app/schedule/page.tsx`, `src/components/schedule/*`
**Spec:** `spec/03-schedule.md`
**Dependencies:** InstantDB app ID, schema pushed
**Deliverable:** Magic link auth, day tabs, filtered event cards

### Agent 4 — RSVP Form
**Files:** `src/app/rsvp/page.tsx`, `src/components/rsvp/*`
**Spec:** `spec/04-rsvp.md`
**Dependencies:** InstantDB app ID, schema pushed
**Deliverable:** Form with validation, upsert to `guests`, success state

### Agent 5 — Travel & Stay + Registry + FAQ
**Files:** `src/app/travel-stay/`, `src/app/registry/`, `src/app/faq/`, `src/lib/*-content.ts`
**Spec:** `spec/05-travel-stay.md`, `spec/06-registry-faq.md`
**Dependencies:** None (static)
**Deliverable:** 3 polished static pages

### Agent 6 — Navigation + Layout
**Files:** `src/app/layout.tsx`, `src/components/Navigation.tsx`, `src/components/Footer.tsx`
**Spec:** `spec/10-nav-layout.md`
**Dependencies:** None
**Deliverable:** Fixed nav with blur, mobile drawer, footer, font setup

### Agent 7 — Admin Page
**Files:** `src/app/admin/page.tsx`, `src/components/admin/*`
**Spec:** `spec/07-admin.md`
**Dependencies:** InstantDB app ID, schema pushed
**Deliverable:** RSVP table, schedule editor, photo uploader

---

## Shared Rules for All Agents
- All colors via CSS custom properties — never hardcode hex in components
- Use `--font-display` / `--font-body` CSS vars, never hardcode font names
- Dark surface cards: `bg-surface` or `bg-surface-alt`
- No external component libraries (no shadcn, no MUI) — custom components only
- `bun` for all package operations
- Files max ~500 LOC — split if larger
- Conventional Commits for any commits made

## UI Alignment — Non-Negotiables
These must be consistent across all agents:
- Gold heading color: `var(--color-gold)` — all h1/h2/h3
- Body text: `var(--color-text)`
- Muted/secondary: `var(--color-text-muted)`
- Card bg: `var(--color-surface)`
- Gold border: `1px solid var(--color-border-gold)` or `2px solid var(--color-gold-dim)`
- Primary button: gold fill, dark text — `bg-gold text-bg font-medium px-6 py-3`
- Ghost button: gold border + gold text, dark fill on hover
- Focus ring: `outline: 2px solid var(--color-gold)`
- Border radius: `rounded-lg` (8px) for cards, `rounded-full` for pills/badges
