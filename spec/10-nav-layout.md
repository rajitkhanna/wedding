# Navigation & Layout

## Global Layout (`src/app/layout.tsx`)

```
┌─────────────────────────────────────────────────────┐
│  M & R          Our Story  Schedule  RSVP  More ≡   │  ← fixed top nav
├─────────────────────────────────────────────────────┤
│                                                     │
│  {page content}                                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│  © 2026 Meghana & Rajit   Registry · FAQ · Contact  │  ← footer
└─────────────────────────────────────────────────────┘
```

---

## Nav Component

### Desktop (≥768px)
- Fixed top, `z-50`
- Background: `rgba(18, 6, 8, 0.85)` + `backdrop-filter: blur(12px)`
- Logo/monogram: "M & R" in Cormorant Garamond, gold
- Links: Jost, small caps, `--color-text-muted` → `--color-gold` on hover
- Active link: gold underline `2px`
- Right side: Schedule link has a small lock icon if not authenticated

### Mobile (<768px)
- Hamburger → slide-down drawer from top
- Same links in vertical list
- Drawer background: `--color-surface`

### Links
```
M & R (logo → /)
Our Story    → /story
Schedule 🔒  → /schedule
RSVP         → /rsvp
More ▾       → dropdown: Travel & Stay, Registry, FAQ
```

---

## Footer

```
┌─────────────────────────────────────────────────────┐
│                 ──── ♥ ────                         │  ← ornament
│                                                     │
│         With love, Meghana & Rajit                  │
│             Saturday, [Date], [City]                │
│                                                     │
│    Travel & Stay  ·  Registry  ·  FAQ  ·  Contact   │
│                                                     │
│            © 2026  All Rights Reserved              │
└─────────────────────────────────────────────────────┘
```

---

## Page Transition
- Simple fade between routes using Next.js `<Transition>` or a CSS class on `<main>`
- 150ms fade-out, 150ms fade-in
- Don't over-animate — the 3D rose on home is the hero moment

---

## Fonts (layout.tsx)
```tsx
import { Cormorant_Garamond, Jost } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
})

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
})
```

---

## File Structure
```
src/app/layout.tsx                ← fonts, global nav + footer
src/components/Navigation.tsx     ← existing, needs full redesign
src/components/Footer.tsx
```

---

## Responsive Breakpoints
| Breakpoint | Layout |
|-----------|--------|
| <640px | Single column, mobile nav |
| 640–1024px | Two columns where applicable |
| >1024px | Full desktop layout |
