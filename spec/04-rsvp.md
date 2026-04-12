# Page: RSVP (`/rsvp`)

## Goal
Clean, elegant form. Guest confirms attendance, meal choice, and plus-one.
Writes directly to InstantDB `guests` entity. No backend needed.

---

## Wireframe

```
┌─────────────────────────────────────────────────────┐
│                      RSVP                           │
│         "We hope to celebrate with you."            │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ╔═══════════════════════════════════════════╗     │
│   ║                                           ║     │
│   ║   Your Name                               ║     │
│   ║   ┌─────────────────────────────────┐     ║     │
│   ║   │                                 │     ║     │
│   ║   └─────────────────────────────────┘     ║     │
│   ║                                           ║     │
│   ║   Email Address                           ║     │
│   ║   ┌─────────────────────────────────┐     ║     │
│   ║   │                                 │     ║     │
│   ║   └─────────────────────────────────┘     ║     │
│   ║                                           ║     │
│   ║   Will you be attending?                  ║     │
│   ║   ( ) Joyfully accept                     ║     │
│   ║   ( ) Regretfully decline                 ║     │
│   ║                                           ║     │
│   ║   ── if attending ──────────────────      ║     │
│   ║                                           ║     │
│   ║   Meal Preference                         ║     │
│   ║   [ Vegetarian ▾ ]                        ║     │
│   ║                                           ║     │
│   ║   Dietary Restrictions (optional)         ║     │
│   ║   ┌─────────────────────────────────┐     ║     │
│   ║   │                                 │     ║     │
│   ║   └─────────────────────────────────┘     ║     │
│   ║                                           ║     │
│   ║   Plus One?  [ ] Yes, I'm bringing someone║     │
│   ║                                           ║     │
│   ║   ── if plus one ───────────────────      ║     │
│   ║   Plus One Name                           ║     │
│   ║   ┌─────────────────────────────────┐     ║     │
│   ║   │                                 │     ║     │
│   ║   └─────────────────────────────────┘     ║     │
│   ║                                           ║     │
│   ║   [       Send RSVP       ]               ║     │
│   ║                                           ║     │
│   ╚═══════════════════════════════════════════╝     │
│                                                     │
│   ── Success state ─────────────────────────────    │
│                                                     │
│   ✓  Thank you, Priya!                              │
│      We can't wait to celebrate with you.           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Form Fields
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | text | yes | |
| email | email | yes | used as key to upsert guest record |
| rsvpStatus | radio | yes | `attending` \| `not-attending` |
| mealPreference | select | if attending | `veg` \| `non-veg` \| `vegan` \| `pescatarian` |
| dietaryRestrictions | textarea | no | free text |
| plusOne | checkbox | no | reveals plusOneName field |
| plusOneName | text | if plusOne | |

---

## InstantDB Write
```ts
// Upsert by email (email is unique + indexed)
import { lookup } from "@instantdb/react"

async function submitRSVP(form: RSVPForm) {
  await db.transact(
    db.tx.guests[lookup('email', form.email)].merge({
      name: form.name,
      email: form.email,
      rsvpStatus: form.rsvpStatus,
      mealPreference: form.mealPreference,
      dietaryRestrictions: form.dietaryRestrictions,
      plusOneName: form.plusOneName,
      rsvpSubmittedAt: Date.now(),
    })
  )
}
```

`lookup('email', ...)` creates/updates the record keyed by email —
idempotent if guest re-submits.

---

## States
1. **Empty** — blank form
2. **Declining** — rsvpStatus = not-attending: hide meal/diet/plusOne fields
3. **Submitting** — button disabled, spinner
4. **Success** — replace form with thank-you message + confetti burst (gold petals)
5. **Error** — inline error message, form stays open

---

## Design Details
- Form card: `--color-surface`, gold border top `3px solid var(--color-gold)`
- Inputs: dark bg `--color-surface-alt`, gold focus ring
- Radio buttons: custom gold circles
- Submit button: gold fill `--color-gold`, dark text, hover brightens
- Success: animate a small rose SVG + fade in thank-you text

---

## File Structure
```
src/app/rsvp/page.tsx            ← 'use client'
src/components/rsvp/RSVPForm.tsx
src/components/rsvp/RSVPSuccess.tsx
```
