# Page: Admin (`/admin`)

## Goal
Internal tool for Meghana & Rajit (or coordinator) to:
- View all RSVPs
- Manage schedule events
- Upload photos to InstantDB Storage
- See headcount / meal counts

Not public-facing. Protected by a simple admin token check.

---

## Wireframe

```
┌─────────────────────────────────────────────────────┐
│  ADMIN                               [Sign Out]     │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  RSVP        │   RSVP Summary                       │
│  Schedule    │   ───────────────────────────────    │
│  Photos      │   Attending:         42              │
│              │   Declined:           8              │
│              │   No response:       15              │
│              │                                      │
│              │   Meal breakdown:                    │
│              │   Vegetarian:        28              │
│              │   Non-veg:           12              │
│              │   Vegan:              2              │
│              │                                      │
│              │   RSVP List ──────────────────────   │
│              │   ┌────────────┬──────┬──────────┐   │
│              │   │ Name       │ RSVP │ Meal     │   │
│              │   ├────────────┼──────┼──────────┤   │
│              │   │ Priya S.   │  ✓   │ Veg      │   │
│              │   │ Arjun K.   │  ✓   │ Non-veg  │   │
│              │   │ ...        │      │          │   │
│              │   └────────────┴──────┴──────────┘   │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

---

## Tabs

### 1. RSVP
- Summary counts (attending / declined / no response)
- Meal breakdown table
- Full guest list table: name, email, group, RSVP status, meal, plus-one, submitted at
- Export to CSV button (client-side, no backend)

### 2. Schedule
- View all schedule events grouped by day
- Add / edit / delete events (form + InstantDB transact)
- Drag-to-reorder (updates `sortOrder`)

### 3. Photos
- Upload form: choose file, select path prefix (home/ story/ etc.)
- Progress indicator
- Grid of uploaded photos with path + delete button

---

## Auth (Admin)
Simple token-based — no need for full auth system.

```ts
// src/app/admin/page.tsx
// Check sessionStorage for admin token
// If missing: show password prompt
// Validate against NEXT_PUBLIC_ADMIN_TOKEN (or prompt to server Route Handler)
```

Recommended approach: use InstantDB admin auth with a hardcoded admin email.
Only Rajit's email gets `scheduleGroup: "admin"` — check that on the admin page.

Simpler: just protect with a password stored in env var, checked client-side.
```
NEXT_PUBLIC_ADMIN_PASSWORD=...  (acceptable for low-stakes internal tool)
```

---

## Schedule Event Form
```ts
interface NewEvent {
  title: string
  day: 'friday' | 'saturday' | 'sunday'
  startTime: string      // "6:00 PM"
  location: string
  description: string
  group: 'all' | 'wedding-party' | 'family' | 'general'
  sortOrder: number
}

// Write:
await db.transact(
  db.tx.scheduleEvents[id()].update(event)
)
```

---

## Photo Upload
```ts
async function uploadPhoto(file: File, pathPrefix: string) {
  const path = `${pathPrefix}/${file.name}`
  await db.storage.uploadFile(path, file, {
    contentType: file.type,
  })
  // $files namespace updates automatically → grid re-renders
}
```

---

## CSV Export (client-side)
```ts
function exportCSV(guests: Guest[]) {
  const rows = guests.map(g =>
    [g.name, g.email, g.rsvpStatus, g.mealPreference, g.plusOneName].join(',')
  )
  const csv = ['Name,Email,RSVP,Meal,Plus One', ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  // trigger download
}
```

---

## File Structure
```
src/app/admin/page.tsx                ← 'use client'
src/components/admin/AdminShell.tsx   ← sidebar + tab layout
src/components/admin/RSVPTab.tsx
src/components/admin/ScheduleTab.tsx
src/components/admin/PhotosTab.tsx
src/components/admin/EventForm.tsx
```
