# Wedding Website — Architecture Overview

## Couple
Meghana (Telugu) + Rajit Khanna (Punjabi)

## Stack
| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 App Router |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Database / Realtime | InstantDB (`@instantdb/react`) |
| Storage | InstantDB Storage (`$files` namespace) |
| Auth | InstantDB magic-link email auth |
| 3D | React Three Fiber + Three.js |
| Deploy | Vercel |
| Runtime | Bun |

## Environment Variables
```
NEXT_PUBLIC_INSTANT_APP_ID=<your-app-id>   # public, safe to expose
INSTANT_ADMIN_TOKEN=<admin-token>           # server-only, Vercel env secret
```

## Design Tokens (globals.css)
- Background: `#120608` (near-black deep crimson)
- Surface: `#1e0b0e`
- Red accent: `#8B1A1A`
- Gold primary: `#C9A84C`
- Gold light: `#E8C97A`
- Text: `#F5EDD6` (cream)
- Fonts: Cormorant Garamond (display), Jost (body)

## Page Map
| Route | Name | Auth? |
|-------|------|-------|
| `/` | Home — 3D Rose Hero | public |
| `/story` | Our Story | public |
| `/schedule` | Schedule | magic-link (group-gated) |
| `/rsvp` | RSVP | public |
| `/travel-stay` | Travel & Stay | public |
| `/registry` | Registry | public |
| `/faq` | FAQ | public |
| `/admin` | Admin | admin token |

## InstantDB Data Model (summary)
```
guests          — one record per guest/group
scheduleEvents  — seeded by admin, filtered by group
$files          — InstantDB Storage for all photos
```
Full schema: see `spec/08-instant-schema.md`

## Auth Model
1. Guest visits `/schedule` — sees email prompt
2. Enters email → InstantDB sends magic link
3. Magic link lands → user is authenticated (`db.useAuth()`)
4. App reads `guests` record for that email → gets `scheduleGroup`
5. `scheduleEvents` filtered to `group === scheduleGroup || group === "all"`

Admin auth: separate `INSTANT_ADMIN_TOKEN` checked in a Next.js Route Handler
(`/api/admin/verify`); `/admin` page calls that before rendering.

## Photo Strategy
- Upload via `db.storage.uploadFile(path, file)` (admin CLI or admin page)
- Query via `db.useQuery({ $files: { $: { where: { path: { $like: "story/%" } } } } })`
- Path conventions:
  - `home/{filename}` — 2 hero photos
  - `story/{filename}` — ~18 story/engagement/nischitartham photos
  - `schedule/{filename}` — 2 schedule photos
  - `rsvp/{filename}` — 1 photo
  - `misc/{filename}` — extras

## Key Decisions
- No Next.js API routes for reads — InstantDB client queries direct from browser
- Server-side writes (admin seeding) use `@instantdb/admin` in Route Handlers
- No passwords — magic links only (better UX for non-tech wedding guests)
- Schedule filtering on client after auth (simpler than server-side, data is not sensitive)
