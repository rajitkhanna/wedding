# Page: Our Story (`/story`)

## Goal
A vertical timeline of Meghana & Rajit's relationship — from high school through
engagement and Nischitartham. Rich photos from InstantDB Storage. Cinematic, editorial.

---

## Wireframe

```
┌─────────────────────────────────────────────────────┐
│                    OUR STORY                        │  ← h1, Cormorant Garamond, gold
│         "from high school sweethearts to forever"   │  ← subtitle, muted
├─────────────────────────────────────────────────────┤
│                                                     │
│  ●────────────────── 2018 ──────────────────────    │  ← gold dot + year label
│  │                                                  │
│  │  [PHOTO]    How It Started                       │  ← alternating left/right
│  │  [PHOTO]    Prom, 2018. The night we knew.       │
│  │                                                  │
│  ●────────────────── 2020 ──────────────────────    │
│  │                                                  │
│  │             College Years                [PHOTO] │
│  │             Long distance, FaceTime…     [PHOTO] │
│  │                                                  │
│  ●────────────────── 2023 ──────────────────────    │
│  │                                                  │
│  │  [PHOTO]    The Proposal                         │
│  │  [PHOTO]    She said yes.                        │
│  │                                                  │
│  ●────────────────── 2024 ──────────────────────    │
│  │                                                  │
│  │             Nischitartham                [PHOTO] │
│  │             Telugu engagement ceremony.  [PHOTO] │
│  │             Families united.             [PHOTO] │
│  │                                                  │
│  ●────────────────── 2026 ──────────────────────    │
│                                                     │
│             The Wedding ♥                           │
└─────────────────────────────────────────────────────┘
```

---

## Chapters / Timeline Data

| Chapter | Era | Photos | Caption idea |
|---------|-----|--------|--------------|
| How It Started | 2018 | 2 prom photos | "Prom night, 2018. Something shifted." |
| Long Distance | 2020–21 | 2 candid | "Different cities. Same feelings." |
| The Proposal | 2023 | 2 engagement | "He got down on one knee." |
| Nischitartham | 2024 | 4–6 ceremony | "Two families, one celebration." |
| The Wedding | 2026 | — (placeholder) | "Coming soon…" |

Total: ~12–14 photos on this page. The rest of the ~18 can fill gaps.

---

## Layout Detail

Each chapter alternates: photo-left/text-right, then text-left/photo-right.
On mobile: photo always on top, text below.

Photo treatment:
- Gold border `2px solid var(--color-border-gold)`
- Slight inset shadow
- Hover: scale(1.02) + gold glow
- Lazy-loaded from InstantDB Storage

Timeline spine:
- `2px` gold line `var(--color-gold-dim)` running vertically center
- Chapter nodes: `12px` filled gold circle
- Year labels: small caps, `--color-gold`, positioned at chapter nodes

Scroll animation (optional, progressive enhancement):
- Each chapter fades + slides in on enter viewport (`IntersectionObserver`)
- Gold line "draws" down as user scrolls (CSS `height` transition or SVG `stroke-dashoffset`)

---

## InstantDB Usage

```ts
// Query all story photos
const { data } = db.useQuery({
  $files: {
    $: { where: { path: { $like: "story/%" } } },
  },
})
// data.$files: Array<{ id, path, url, serverCreatedAt }>
// Sort by path name (which encodes chapter order, e.g. "story/01-prom-1.jpg")
```

Photo path naming convention: `story/NN-chapter-name.jpg` (NN = 01..18)
so sort order is deterministic.

---

## File Structure
```
src/app/story/page.tsx          ← 'use client', queries $files
src/components/story/Timeline.tsx
src/components/story/Chapter.tsx
src/components/story/TimelinePhoto.tsx
```

---

## Notes
- No auth required
- If photo not yet uploaded: show a soft placeholder (gold ornament SVG)
- Nischitartham photos are colorful/vibrant — consider a slightly lighter surface card
  behind them to let the colors pop against the dark bg
