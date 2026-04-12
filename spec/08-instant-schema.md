# InstantDB Schema + Permissions

## App Setup
```
NEXT_PUBLIC_INSTANT_APP_ID=<paste your app id here>
INSTANT_ADMIN_TOKEN=<from InstantDB dashboard → App Settings>
```

---

## Schema (`src/lib/instant/schema.ts`)

```ts
import { i } from "@instantdb/react"

const schema = i.schema({
  entities: {
    // ── Guests ───────────────────────────────────────────────────────
    guests: i.entity({
      email: i.string().unique().indexed(),
      name: i.string(),
      scheduleGroup: i.string(), // "wedding-party" | "family" | "general" | "admin"
      rsvpStatus: i.string().optional(),     // "attending" | "not-attending"
      mealPreference: i.string().optional(), // "veg" | "non-veg" | "vegan" | "pescatarian"
      dietaryRestrictions: i.string().optional(),
      plusOneName: i.string().optional(),
      rsvpSubmittedAt: i.number().optional(),
    }),

    // ── Schedule Events ───────────────────────────────────────────────
    scheduleEvents: i.entity({
      title: i.string(),
      day: i.string(),           // "friday" | "saturday" | "sunday"
      startTime: i.string(),     // "6:00 PM"
      endTime: i.string().optional(),
      location: i.string().optional(),
      locationUrl: i.string().optional(), // Google Maps link
      description: i.string().optional(),
      group: i.string(),         // "all" | "wedding-party" | "family"
      sortOrder: i.number(),
    }),

    // ── Site Config (singleton) ───────────────────────────────────────
    siteConfig: i.entity({
      key: i.string().unique().indexed(), // e.g. "weddingDate", "venueName"
      value: i.string(),
    }),
  },
  // $files namespace is built-in to InstantDB Storage — no need to define
})

export type AppSchema = typeof schema
export default schema
```

---

## Permissions (`instant.perms.ts`)

```ts
// Rules for who can read/write what
export default {
  guests: {
    allow: {
      // Anyone can create their own RSVP (by email)
      create: "true",
      // Guest can only read/update their own record
      read: "data.email == auth.email",
      update: "data.email == auth.email",
      // No deletes from client
      delete: "false",
    },
  },
  scheduleEvents: {
    allow: {
      // Any authenticated user can read events
      read: "auth.id != null",
      // Only admin can write
      create: "false",
      update: "false",
      delete: "false",
    },
  },
  siteConfig: {
    allow: {
      read: "true",
      create: "false",
      update: "false",
      delete: "false",
    },
  },
  "$files": {
    allow: {
      // Anyone can view files (photos are public)
      read: "true",
      // Only server/admin can upload (use admin SDK in Route Handler)
      create: "false",
      update: "false",
      delete: "false",
    },
  },
}
```

---

## Seeding Schedule Events (admin SDK)

```ts
// scripts/seed-schedule.ts  (run once with bun)
import { init } from "@instantdb/admin"
import { id } from "@instantdb/react"

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
})

const events = [
  {
    title: "Mehndi Night",
    day: "friday",
    startTime: "6:00 PM",
    location: "Venue TBD",
    group: "family",
    sortOrder: 1,
  },
  {
    title: "Sangeet",
    day: "friday",
    startTime: "8:00 PM",
    location: "Venue TBD",
    group: "all",
    sortOrder: 2,
  },
  // ... add more
]

await db.transact(
  events.map(e => db.tx.scheduleEvents[id()].update(e))
)
```

---

## InstantDB Storage — Path Conventions

```
home/               ← 2 photos for hero/nav cards
story/01-*.jpg      ← prom photos (sort by filename)
story/02-*.jpg      ← college years
story/03-*.jpg      ← proposal / engagement
story/04-*.jpg      ← nischitartham ceremony
schedule/           ← event photos if any
rsvp/               ← 1 background/accent photo
misc/               ← overflow / unused
```

Upload via admin page or CLI:
```bash
# Using InstantDB CLI (if available)
# Or use the admin page at /admin → Photos tab
```

---

## Client Init (`src/lib/instant/db.ts`)

```ts
import { init } from "@instantdb/react"
import schema from "./schema"

export const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  schema,
})
```

---

## Useful Queries Reference

```ts
// All guests who RSVP'd attending
db.useQuery({ guests: { $: { where: { rsvpStatus: "attending" } } } })

// All story photos sorted
db.useQuery({ $files: { $: { where: { path: { $like: "story/%" } }, order: { path: "asc" } } } })

// Schedule events for a day
db.useQuery({ scheduleEvents: { $: { where: { day: "saturday" }, order: { sortOrder: "asc" } } } })

// Site config value
db.useQuery({ siteConfig: { $: { where: { key: "weddingDate" } } } })
```
