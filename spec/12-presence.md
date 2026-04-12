# Feature: Live Visitor Presence

## Goal
Show a subtle live counter — "X people are viewing this wedding right now" —
using InstantDB's built-in presence rooms. No server needed. Updates in real time.

---

## How It Works (InstantDB Presence)

InstantDB `usePresence` tracks everyone in a "room". Each visitor auto-joins on
page load and auto-leaves when they close the tab. No auth required.

```ts
const room = db.room('site', 'wedding-visitors')

function useVisitorCount() {
  const { peers } = db.rooms.usePresence(room, {
    initialPresence: { joinedAt: Date.now() },
  })
  return 1 + Object.keys(peers).length  // me + everyone else
}
```

---

## Where to Show It

### Option A — Floating pill (global, all pages)
A small pill fixed to the bottom-right corner, visible on every page.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                                               ┌────┐ │
│                                               │●  5│ │  ← bottom-right
│                                               │here│ │
│                                               └────┘ │
└──────────────────────────────────────────────────────┘
```

Design:
```
● 5 people here
```
- Gold dot pulse animation (CSS keyframe)
- Dark surface background, gold text
- `fixed bottom-6 right-6 z-50`
- Fades in after 1s (don't flash on load)
- Only shows when count ≥ 2 (hide if you're alone — not sad)

### Option B — In the Home page hero (contextual, more prominent)
Below the names overlay on the rose, a line appears:
```
  Meghana & Rajit
  Saturday, June 7, 2026

  ✦ 12 people are here with you
```
- Elegant, feels like an event
- Only on `/` (home), not global

**Recommended: both** — Option B on the home hero, Option A on all other pages.

---

## Schema Addition (`instant.schema.ts`)
No schema change needed — presence uses InstantDB's built-in rooms system,
not the database entities. Zero DB writes.

---

## RoomSchema (type safety)
```ts
// src/lib/instant/schema.ts — add roomSchema
import { i } from "@instantdb/react"

const schema = i.schema({
  entities: { /* existing */ },
  rooms: {
    'wedding-visitors': {
      presence: i.entity({
        joinedAt: i.number(),
        page: i.string().optional(),  // track which page they're on
      }),
    },
  },
})
```

---

## Component: `VisitorPill`

```tsx
// src/components/presence/VisitorPill.tsx
'use client'
import { db } from '@/lib/instant/db'

const room = db.room('wedding-visitors', 'global')

export function VisitorPill() {
  const { peers } = db.rooms.usePresence(room, {
    initialPresence: { joinedAt: Date.now() },
  })
  const count = 1 + Object.keys(peers).length

  if (count < 2) return null  // hide when alone

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2
                    rounded-full px-4 py-2 text-sm
                    bg-surface border border-border-gold text-text-muted
                    opacity-0 animate-fade-in"
         style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
      <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
      <span className="text-gold font-medium">{count}</span>
      <span>people here</span>
    </div>
  )
}
```

Add to `src/app/layout.tsx` so it appears on every page:
```tsx
<body>
  <Navigation />
  <main>{children}</main>
  <Footer />
  <VisitorPill />   {/* ← add here */}
</body>
```

---

## Component: `HeroPresence` (home page only)

```tsx
// src/components/presence/HeroPresence.tsx
'use client'
import { db } from '@/lib/instant/db'

const room = db.room('wedding-visitors', 'global')

export function HeroPresence() {
  const { peers } = db.rooms.usePresence(room, {
    initialPresence: { joinedAt: Date.now(), page: 'home' },
  })
  const count = 1 + Object.keys(peers).length

  if (count < 2) return null

  return (
    <p className="text-text-muted text-sm tracking-widest mt-6 animate-fade-in">
      ✦ {count} people are here with you
    </p>
  )
}
```

---

## Fun Extras (optional)

### Per-page breakdown
Track which page each visitor is on:
```ts
publishPresence({ joinedAt: Date.now(), page: pathname })
// Then in admin: see "3 on /story, 2 on /rsvp"
```

### Milestone moments
If count ≥ 10, swap the pill text to:
```
✦ 10 of your people are here
```

### RSVP page nudge
On `/rsvp`, if count ≥ 3:
```
✦ 3 guests are filling out their RSVP right now
```

---

## File Structure
```
src/components/presence/VisitorPill.tsx
src/components/presence/HeroPresence.tsx
```

Both are tiny — no need to split further.
