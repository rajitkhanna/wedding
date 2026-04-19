# Page: Registry (`/registry`) + FAQ (`/faq`)

---

## Registry (`/registry`)

### Goal
Link out to external registries. No custom DB logic needed.

### Wireframe
```
┌─────────────────────────────────────────────────────┐
│                    REGISTRY                         │
│   "Your presence is the greatest gift.              │
│    If you'd like to give more, here are our         │
│    wishlists."                                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────┐       │
│  │  💍  Zola                                │       │
│  │  Our primary wishlist.                   │       │
│  │  [ View Registry → ]                     │       │
│  └──────────────────────────────────────────┘       │
│                                                     │
│  ┌──────────────────────────────────────────┐       │
│  │  📦  Amazon                              │       │
│  │  Kitchen essentials and everyday items.  │       │
│  │  [ View Registry → ]                     │       │
│  └──────────────────────────────────────────┘       │
│                                                     │
│  ┌──────────────────────────────────────────┐       │
│  │  ✈  Honeymoon Fund                       │       │
│  │  Contribute to our adventure.            │       │
│  │  [ Contribute → ]                        │       │
│  └──────────────────────────────────────────┘       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Implementation
Fully static — store registry links in `src/lib/registry-content.ts`.

---

## FAQ (`/faq`)

### Goal
Two parts on one page:
1. **Ceremony Guides** — what to expect at the Sikh (Anand Karaj) and Telugu ceremonies
2. **FAQ Accordion** — practical questions answered

### Wireframe
```
┌─────────────────────────────────────────────────────┐
│                      FAQ                            │
│         "Everything you might be wondering."        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ── Ceremony Guides ───────────────────────────     │  ← gold section header
│                                                     │
│  ── Our Venue ────────────────────────────────     │
│                                                     │
│  The wedding celebration will be held at          │
│  InterContinental Boston in downtown Boston.        │
│                                                     │
│  ── Questions ─────────────────────────────────     │
│                                                     │
│  ▶  Are children welcome?                           │
│  ▶  Will there be vegetarian options?               │
│  ▶  Where do I park?                                │
│  ▶  What time should I arrive?                      │
│  ▶  I have a dietary restriction not on the RSVP.   │
│  ▶  Who can I contact with questions?          │
│     Email Rajesh (khannaspb@gmail.com, Rajit's    │
│     dad) or Venkat (vavvaru@gmail.com,          │
│     Meghana's dad)                              │
│                                                     │
│  ▶  Website not working?                     │
│     Text Rajit immediately: 603-921-8190          │
│                                                     │
│  └─────────────────────────────────────────────────────┘
```

---

## FAQ Items

| # | Question | Key answer points |
|---|----------|-------------------|
| 1 | Are children welcome? | TBD — fill in |
| 2 | Vegetarian options? | Yes |
| 3 | Photos during ceremony? | Designated photographer — please enjoy the moment |
| 4 | Parking? | Valet + self-parking available |
| 5 | When to arrive? | 30 min early for all events |
| 6 | Dietary restrictions? | Email Rajesh or Venkat |
| 7 | Contact? | Email Rajesh (khannaspb@gmail.com) or Venkat (vavvaru@gmail.com) |
| 8 | Website issues? | Text Rajit immediately: 603-921-8190 |

---

## Implementation

```ts
// src/lib/faq-content.ts
export const faqItems = [
  { q: "Are children welcome?", a: "TBD" },
  { q: "Vegetarian options?", a: "Yes" },
  { q: "Photos during ceremony?", a: "Designated photographer — please enjoy the moment" },
  { q: "Parking?", a: "Valet + self-parking available" },
  { q: "When to arrive?", a: "30 min early for all events" },
  { q: "Dietary restrictions?", a: "Call or text Rajit: 603-921-8190" },
  { q: "Contact?", a: "Call or text Rajit: 603-921-8190" },
]
```

Custom `<Accordion>` component:
- Gold border-bottom divider between items
- Chevron rotates 90° on open (CSS transition)
- Smooth height animation (`max-height` transition)

---

## Design Details
- Ceremony guide cards: side-by-side on desktop, stacked mobile
- Each guide card: gold top border `3px`, dark surface bg, bullet list with gold dots
- FAQ accordion below, separated by a `gold-rule`

---

## File Structure
```
src/app/registry/page.tsx
src/app/faq/page.tsx
src/components/registry/RegistryCard.tsx
src/components/faq/Accordion.tsx
src/components/faq/AccordionItem.tsx
src/components/faq/CeremonyGuide.tsx      ← new
src/lib/registry-content.ts
src/lib/faq-content.ts
```
