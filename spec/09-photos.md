# Photo Strategy — InstantDB Storage

## Where to Put Your Photos (Local Folder)

Drop all your photos into a folder at the root of the repo:

```
/Users/rajitkhanna/Github/wedding/photos/
  home/
    hero-1.jpg         ← 1–2 photos for home page
    hero-2.jpg
  story/
    01-prom-1.jpg      ← prom era
    01-prom-2.jpg
    02-college-1.jpg   ← college years
    03-proposal-1.jpg  ← engagement
    03-proposal-2.jpg
    04-nischitartham-1.jpg   ← Telugu ceremony
    04-nischitartham-2.jpg
    04-nischitartham-3.jpg
    ... (up to ~18 total)
  rsvp/
    rsvp-bg.jpg
  misc/
    ...
```

Naming convention: `NN-chapter-name-N.jpg`
- `NN` = 2-digit chapter number (01, 02, …) → controls sort order on the Story page
- Stick to `.jpg` or `.webp` — avoid `.HEIC` (convert first)

**Recommended resolution:** 1800–2400px on longest side, compressed to <500KB each.
Use [Squoosh](https://squoosh.app) or `bunx sharp-cli` to batch compress.

---

## Uploading to InstantDB Storage

### Option A: Via Admin Page (recommended when live)
1. Go to `/admin` → Photos tab
2. Select path prefix from dropdown
3. Drag and drop files
4. InstantDB Storage handles the rest; `$files` updates in real time

### Option B: Upload Script (batch, run once)
```ts
// scripts/upload-photos.ts
import { init as initAdmin } from "@instantdb/admin"
import fs from "fs"
import path from "path"
import { glob } from "glob"

const db = initAdmin({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
})

const photosDir = path.join(process.cwd(), "photos")
const files = await glob("**/*.{jpg,jpeg,webp,png}", { cwd: photosDir })

for (const file of files) {
  const fullPath = path.join(photosDir, file)
  const buffer = fs.readFileSync(fullPath)
  const ext = path.extname(file).slice(1)
  const contentType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`

  console.log(`Uploading: ${file}`)
  await db.storage.uploadFile(file, buffer, { contentType })
}

console.log("Done!")
```

Run with:
```bash
bun run scripts/upload-photos.ts
```

---

## Accessing Photos in the App

```ts
// All story photos
const { data } = db.useQuery({
  $files: {
    $: {
      where: { path: { $like: "story/%" } },
      order: { path: "asc" },   // 01-, 02-, 03- sort correctly
    },
  },
})
const storyPhotos = data?.$files ?? []

// Single photo by path
import { lookup } from "@instantdb/react"
const { data } = db.useQuery({
  $files: { $: { where: { path: "home/hero-1.jpg" } } },
})
const heroUrl = data?.$files?.[0]?.url
```

Photos are served from InstantDB's CDN — URLs are permanent and fast.

---

## Photo Count Summary

| Section | Count | Path prefix |
|---------|-------|-------------|
| Home hero / nav | 2 | `home/` |
| Our Story | ~14–18 | `story/` |
| RSVP bg | 1 | `rsvp/` |
| Schedule | 0–2 | `schedule/` |
| **Total** | **~20–25** | |

---

## Notes
- `photos/` folder should be in `.gitignore` — don't commit large images to git
- Add `photos/` to `.gitignore` before putting files there
- The `$files` namespace is reactive — upload one photo and all open browsers update live
