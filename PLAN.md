# Meghana & Rajit — Wedding Website Plan

## The Vision

Dark, rich, dramatic. Deep crimson/burgundy background, gold typography, 25 photos woven
throughout. A 3D lotus flower opens on the home page as you scroll. Every page feels like
opening a wedding invitation.

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#1a0a0a` (near-black deep red) |
| Surface | `#2d0f0f` (card backgrounds) |
| Primary Red | `#8B1A1A` (buttons, accents) |
| Gold | `#C9A84C` (headings, highlights) |
| Gold Light | `#E8C97A` (hover states) |
| Text | `#F5EDD6` (cream white) |
| Text Muted | `#A08060` (secondary text) |
| Heading Font | Cormorant Garamond (serif, regal) |
| Body Font | Inter (clean, readable) |

---

## Pages (5 total)

### `/` — Home
- 3D lotus/marigold that blooms as you scroll (React Three Fiber)
- Petals closed at top → fully open by scroll end, revealing: **Meghana & Rajit** + date + venue
- Floating gold text fades in through the petals
- Two photos: one glimpsed through petals, one hero reveal at bottom
- Bottom: quick-link cards → RSVP, Our Story, The Day

### `/us` — Our Story
- Vertical timeline, 4 chapters:
  1. **Prom** (3–4 photos)
  2. **Life Together** (6–7 candids)
  3. **Engagement** (5–6 photos)
  4. **Nischitartham** (4–5 ceremony photos)
- Each chapter: large photo, caption, short paragraph
- Photos alternate left/right as you scroll
- 18 photos total

### `/day` — The Day *(auth-gated)*
- Guests access via a magic link you send them (e.g. `/day?t=abc123`)
- 3 schedule groups: **Wedding Party**, **Family**, **General Guests**
- Each sees only their relevant events + times
- Below the schedule: Travel & Stay section (hotels, directions, airport info)
- 2 photos: venue + one couple shot

### `/rsvp` — RSVP
- One warm photo at the top
- Form fields: Full name, Attending (yes/no), Meal preference, Dietary restrictions, Plus-one name
- RSVP deadline displayed prominently
- On submit: thank-you message with a photo
- Backend: Supabase (free tier, stores responses in a table)

### `/more` — Registry & FAQ
- Registry: cards linking to external registries (Zola, Amazon, etc.) + honeymoon fund note
- FAQ accordion: dress code, parking, kids, ceremony length, gifts, etc.
- 2 photos as section breaks

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 (already set up) | ✓ |
| Styling | Tailwind CSS (already set up) | ✓ |
| 3D Flower | React Three Fiber + Drei | Best Three.js DX in React |
| Scroll animations | Framer Motion | Simple, powerful |
| RSVP backend | Supabase | Free, real DB, easy setup |
| Magic link auth | Custom middleware + env tokens | No library needed |
| Fonts | Google Fonts (Cormorant Garamond + Inter) | Free, beautiful |
| Deploy | Vercel | Zero-config for Next.js |

---

## 5-Hour Day-by-Day Plan

### Before You Start (30 min — do this first)
**You need to gather:**
- [ ] Wedding date (goes on home page)
- [ ] Venue name + city (goes on home page)
- [ ] 25 photos renamed and sorted into folders:
  ```
  public/photos/prom/        (3–4 photos)
  public/photos/life/        (6–7 photos)
  public/photos/engagement/  (5–6 photos)
  public/photos/nischitartham/ (4–5 photos)
  public/photos/misc/        (remaining for other pages)
  ```
- [ ] Registry URLs (Zola, Amazon, etc.)
- [ ] Hotel recommendations + any room block info
- [ ] FAQ answers (dress code, parking, kids policy, etc.)
- [ ] List of guests + which schedule group they're in

---

### Hour 1 — Design System + Fonts + Global Styles (60 min)

**What I'll build with you:**
1. Update `tailwind.config.ts` with the red/gold color tokens
2. Update `globals.css` — dark background, Cormorant Garamond headings, Inter body
3. Update `layout.tsx` — load Google Fonts, set metadata with real names
4. Restyle `Navigation.tsx` — dark nav, gold "M & R" logo, gold active links
5. Restyle `Section.tsx` — dark surface cards

**You provide:** Wedding date, venue name (so we can put real text in metadata)

**End state:** Every page looks dark and gold even with placeholder content.

---

### Hour 2 — Home Page + 3D Flower (90 min)

**What I'll build with you:**
1. Install React Three Fiber: `npm install @react-three/fiber @react-three/drei three`
2. Install Framer Motion: `npm install framer-motion`
3. Build `LotusFlower` component — 8 petals, each a 3D shape, closed at scroll=0, open at scroll=100%
4. Wire scroll position to petal rotation using `useScroll` from Drei
5. Fade in "Meghana & Rajit", date, venue as petals open
6. Add two photos (hero reveal at bottom)
7. Add quick-link cards at the bottom

**You provide:** 1 gorgeous photo for the hero reveal (engagement or Nischitartham)

**End state:** Scroll-driven 3D flower home page, fully functional.

---

### Hour 3 — `/us` Story Page (60 min)

**What I'll build with you:**
1. Build `TimelineChapter` component — photo + text, alternating sides
2. Wire up all 4 chapters with real photos and placeholder caption text
3. Scroll-triggered fade-in for each chapter (Framer Motion)
4. Chapter headers in gold

**You provide:** The 18 photos in the right folders + a sentence or two per chapter (can be rough, we'll refine)

**End state:** Beautiful scrollable story timeline with real photos.

---

### Hour 4 — `/rsvp` + `/more` Pages (60 min)

**`/rsvp` (30 min):**
1. Set up Supabase project (free) — create `rsvps` table
2. Build the form component with validation
3. Wire form submission to Supabase
4. Add thank-you state

**`/more` (30 min):**
1. Build registry cards with your actual registry links
2. Replace FAQ placeholder with real Q&A
3. Add 2 photos as section breaks

**You provide:** Supabase account (free at supabase.com), registry links, FAQ answers

**End state:** Working RSVP form that saves to a database. Registry and FAQ with real content.

---

### Hour 5 — `/day` Auth + Schedule + Deploy (60 min)

**`/day` (40 min):**
1. Define schedule groups in a config file (3 groups × their events)
2. Build middleware that reads `?t=TOKEN` and maps to a group
3. Add tokens to `.env.local` (one per group)
4. Build the schedule UI — time blocks with venue info
5. Add travel/stay section below
6. Add 2 photos

**Deploy (20 min):**
1. Push to GitHub
2. Connect repo to Vercel (free)
3. Add env vars in Vercel dashboard
4. Set up custom domain if you have one

**You provide:** Schedule details (times, event names, locations per group), hotel info, 3 magic link tokens (you'll pick the strings), custom domain if you have one

**End state:** Fully deployed, live wedding website.

---

## What You Need to Prepare (Master Checklist)

### Content
- [ ] Wedding date
- [ ] Venue name + address
- [ ] 25 photos sorted into folders (see above)
- [ ] ~2 sentences per story chapter (prom, life, engagement, Nischitartham)
- [ ] Schedule: list of events per guest group with times + locations
- [ ] Hotel/accommodation recommendations
- [ ] Registry URLs
- [ ] FAQ: at least 5–6 real questions + answers
- [ ] Honeymoon fund note (optional)

### Accounts (all free)
- [ ] Supabase account — supabase.com
- [ ] Vercel account — vercel.com (sign in with GitHub)
- [ ] Custom domain (optional) — e.g. meghanaandrajit.com

---

## What's Realistic vs Not in 5 Hours

| Feature | Realistic? |
|---------|-----------|
| 3D lotus flower home page | Yes — hardest part, budgeted 90 min |
| Dark red/gold design system | Yes — 1 hour |
| Story timeline with real photos | Yes — 1 hour |
| Working RSVP → database | Yes — 30 min with Supabase |
| Magic link schedule auth | Yes — 30 min |
| Deploy to Vercel | Yes — 20 min |
| Custom animations on every element | No — keep it focused |
| Admin dashboard for RSVPs | No — use Supabase dashboard directly |
| Mobile-perfect nav | Partial — functional but may need polish later |
| Photo lightbox/gallery | No — photos are contextual, not a gallery |
