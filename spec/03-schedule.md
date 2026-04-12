# Page: Schedule (`/schedule`)

## Goal
Auth-gated itinerary. Guests sign in via magic link → see only events relevant to
their group. Meghana & Rajit's wedding spans multiple days (Punjabi + Telugu ceremonies).

---

## Wireframe — Unauthenticated State

```
┌─────────────────────────────────────────────────────┐
│                    SCHEDULE                         │
│          "Your personalized wedding itinerary"      │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ╔═══════════════════════════════════════════╗     │
│   ║                                           ║     │
│   ║   🔒  Your schedule is waiting for you.   ║     │
│   ║                                           ║     │
│   ║   Enter your email to receive a           ║     │
│   ║   personalized magic link.                ║     │
│   ║                                           ║     │
│   ║   ┌─────────────────────────────────┐     ║     │
│   ║   │  your@email.com                 │     ║     │
│   ║   └─────────────────────────────────┘     ║     │
│   ║                                           ║     │
│   ║   [    Send My Schedule Link    ]          ║     │
│   ║                                           ║     │
│   ║   No password needed.                     ║     │
│   ╚═══════════════════════════════════════════╝     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Wireframe — Authenticated State

```
┌─────────────────────────────────────────────────────┐
│                    SCHEDULE                         │
│          "Welcome, Priya! Here's your weekend."     │  ← guest name from DB
├─────────────────────────────────────────────────────┤
│                                                     │
│   [Friday]  [Saturday]  [Sunday]                    │  ← day tabs
│   ─────────────────────                             │
│                                                     │
│   FRIDAY, JUNE 6                                    │
│                                                     │
│   ┌──────────────────────────────────────────┐      │
│   │  6:00 PM  ·  Mehndi Night                │      │  ← event card
│   │           Venue Name, Address            │      │
│   │           For wedding party + family     │      │  ← group badge
│   └──────────────────────────────────────────┘      │
│                                                     │
│   ┌──────────────────────────────────────────┐      │
│   │  8:00 PM  ·  Sangeet                     │      │
│   │           Venue Name, Address            │      │
│   │           All guests                     │      │
│   └──────────────────────────────────────────┘      │
│                                                     │
│   SATURDAY, JUNE 7                                  │
│   ... (Telugu ceremony events) ...                  │
│                                                     │
│   SUNDAY, JUNE 8                                    │
│   ... (Punjabi ceremony events) ...                 │
│                                                     │
│                              [ Sign Out ]           │
└─────────────────────────────────────────────────────┘
```

---

## Schedule Groups
| Group | Who | Events visible |
|-------|-----|----------------|
| `wedding-party` | Bridesmaids, groomsmen | all events |
| `family` | Close family | family + all |
| `general` | Friends, other guests | `group === "all"` events only |

## Real Schedule (from hotel contract + Gurudwara)

All events at InterContinental Boston unless noted.

| Day | Time | Event | Room | Groups |
|-----|------|-------|------|--------|
| Friday 11/27 | 4:00 PM | Afternoon Tea / Welcome Reception | Pre-Function Abigail Adams | wedding-party, family |
| Friday 11/27 | 6:30 PM | Welcome Dinner | Abigail Adams Ballroom | all |
| Saturday 11/28 | TBD AM | Sikh Ceremony (Anand Karaj) | Westborough Gurudwara | all |
| Saturday 11/28 | 4:00 PM | Afternoon Tea | Pre-Function Abigail Adams | wedding-party, family |
| Saturday 11/28 | 6:00 PM | Cocktail Reception | Rose Kennedy Ballroom | all |
| Saturday 11/28 | 7:00 PM | Sangeet & Reception | Rose Kennedy Ballroom | all |
| Sunday 11/29 | 8:00 AM | Breakfast Buffet | Rose Kennedy Ballroom | all |
| Sunday 11/29 | 10:00 AM | Telugu Wedding Ceremony | Abigail Adams Ballroom | all |
| Sunday 11/29 | 12:00 PM | Lunch | Rose Kennedy Ballroom | all |

Notes:
- Sunday 6am items (setup, dressing rooms) are private — not shown to guests
- Saturday Sikh ceremony time TBD (confirm with Gurudwara)
- Afternoon Tea on Fri/Sat visible to wedding-party + family only (intimate pre-event)

---

## Auth Flow (InstantDB Magic Links)

```ts
// 1. Send magic link
await db.auth.sendMagicCode({ email })

// 2. After redirect, sign in with code
await db.auth.signInWithMagicCode({ email, code })

// 3. Check auth state
const { isLoading, user, error } = db.useAuth()

// 4. Query guest record for this user
const { data } = db.useQuery(
  user ? {
    guests: {
      $: { where: { email: user.email } }
    }
  } : null
)
const guest = data?.guests?.[0]
const scheduleGroup = guest?.scheduleGroup ?? 'general'
```

---

## Event Card Component
```tsx
interface ScheduleEvent {
  id: string
  title: string
  day: 'friday' | 'saturday' | 'sunday'
  startTime: string
  location?: string
  description?: string
  group: 'all' | 'wedding-party' | 'family' | 'general'
  sortOrder: number
}

// Filter logic:
function visibleEvents(events: ScheduleEvent[], group: string) {
  if (group === 'wedding-party') return events
  if (group === 'family') return events.filter(e => e.group !== 'wedding-party')
  return events.filter(e => e.group === 'all')
}
```

---

## Event Card Design
- Dark surface card `--color-surface`
- Left border accent `4px solid var(--color-gold)`
- Time: gold, large, Cormorant Garamond
- Title: cream, body font
- Location: muted text, small
- Group badge: tiny pill — "All guests" / "Wedding party" / "Family"

---

## InstantDB Query
```ts
const { data } = db.useQuery({
  scheduleEvents: {
    $: { order: { sortOrder: 'asc' } }
  }
})
// Client-side filter by day + group after fetch
```

---

## File Structure
```
src/app/schedule/page.tsx         ← 'use client'
src/components/schedule/AuthGate.tsx
src/components/schedule/MagicLinkForm.tsx
src/components/schedule/DayTabs.tsx
src/components/schedule/EventCard.tsx
```
