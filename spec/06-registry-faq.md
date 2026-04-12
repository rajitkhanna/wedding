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
│  ┌──────────────────────┐  ┌──────────────────────┐ │
│  │  Anand Karaj         │  │  Telugu Wedding      │ │
│  │  Sikh Ceremony       │  │  Sunday Ceremony     │ │
│  │  Saturday            │  │                      │ │
│  │  ─────────────────   │  │  ─────────────────   │ │
│  │  The Anand Karaj     │  │  The Telugu wedding  │ │
│  │  ("blissful union")  │  │  begins at 6am —     │ │
│  │  is a Sikh wedding   │  │  an auspicious       │ │
│  │  ceremony…           │  │  muhurat time…       │ │
│  │                      │  │                      │ │
│  │  What to know:       │  │  What to know:       │ │
│  │  • Cover your head   │  │  • Arrive by 5:45am  │ │
│  │  • Remove shoes      │  │  • Bright colors     │ │
│  │  • Sit on floor      │  │    encouraged        │ │
│  │  • ~1.5 hr ceremony  │  │  • ~3 hr ceremony    │ │
│  └──────────────────────┘  └──────────────────────┘ │
│                                                     │
│  ── Questions ─────────────────────────────────     │
│                                                     │
│  ▼  What is the dress code?                         │
│     Friday Welcome Dinner: cocktail attire.         │
│     Saturday Sikh Ceremony: traditional or          │
│     cocktail — please cover your head (bring a      │
│     dupatta, scarf, or bandana). No shoes inside    │
│     the Gurudwara.                                  │
│     Saturday Sangeet/Reception: festive, semi-      │
│     formal — Indian or Western welcome.             │
│     Sunday Telugu Wedding: bright festive colors    │
│     encouraged. Indian attire welcome.              │
│                                                     │
│  ▶  Are children welcome?                           │
│  ▶  Will there be vegetarian options?               │
│  ▶  Can I take photos during the ceremony?          │
│  ▶  How do I get from the Gurudwara to the          │
│     InterContinental on Saturday?                   │
│  ▶  Where do I park?                                │
│  ▶  What time should I arrive?                      │
│  ▶  I have a dietary restriction not on the RSVP.   │
│  ▶  Who do I contact with questions?                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Ceremony Guide Content

### Anand Karaj (Sikh Ceremony) — Saturday
- **What it means:** "Blissful union" — a Sikh wedding ceremony conducted in the Gurudwara
- **Duration:** ~1.5 hours
- **What to expect:** The couple circles the Guru Granth Sahib (holy scripture) four times
  as hymns are sung. Family and guests sit together on the floor.
- **What to know:**
  - Cover your head — bring a dupatta, scarf, or bandana (extras available at the Gurudwara)
  - Remove shoes before entering the main hall
  - Sit on the floor (seating by gender is traditional but guests may sit together)
  - A langar (community meal) follows the ceremony

### Telugu Wedding — Sunday
- **What it means:** A Hindu Brahmin ceremony with ancient Vedic rituals
- **Start time:** 10:00 AM — ceremony runs 10:00–11:30 AM
- **Preceded by:** Breakfast buffet at 8:00 AM (all guests welcome)
- **Followed by:** Lunch at 12:00 PM, wraps up ~2:00 PM
- **What to expect:** Rituals include Kashi Yatra, Jeelakarra Bellam, Talambralu
  (showering rice on the couple), and Saptapadi (seven steps). A priest conducts
  in Telugu and Sanskrit.
- **What to know:**
  - Arrive by 9:45 AM — ceremony starts promptly
  - Bright, festive colors encouraged (the more color the better!)
  - Indian attire warmly welcomed, Western semi-formal also great
  - The ceremony is seated; comfortable shoes recommended

---

## FAQ Items

| # | Question | Key answer points |
|---|----------|-------------------|
| 1 | Dress code? | Per-event breakdown (see above); Gurudwara head covering required |
| 2 | Are children welcome? | TBD — fill in |
| 3 | Vegetarian options? | Yes — both South Indian and Punjabi cuisine will have full veg options |
| 4 | Photos during ceremony? | Sikh: respectful photography ok. Telugu: designated photographer, please hold phones |
| 5 | Saturday shuttle? | Yes — shuttle from Gurudwara to InterContinental after ceremony (details on Travel page) |
| 6 | Parking? | InterContinental has valet + self-parking. Gurudwara has free lot. |
| 7 | When to arrive? | 30 min early for all events. Sunday: arrive 5:45am sharp. |
| 8 | Dietary restrictions? | Call or text Rajit at 603-921-8190 |
| 9 | Contact? | Call or text Rajit: 603-921-8190 |

---

## Implementation

```ts
// src/lib/faq-content.ts
export const ceremonyGuides = [
  {
    name: "Anand Karaj",
    subtitle: "Sikh Ceremony · Saturday",
    description: "...",
    bullets: [
      "Cover your head — bring a dupatta, scarf, or bandana",
      "Remove shoes before entering",
      "Sit on the floor",
      "~1.5 hour ceremony",
    ],
  },
  {
    name: "Telugu Wedding",
    subtitle: "Hindu Ceremony · Sunday",
    description: "...",
    bullets: [
      "Arrive by 5:45 AM — ceremony starts promptly at 6",
      "Bright festive colors encouraged",
      "~3 hour ceremony",
    ],
  },
]

export const faqItems = [
  { q: "What is the dress code?", a: "..." },
  // ...
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
