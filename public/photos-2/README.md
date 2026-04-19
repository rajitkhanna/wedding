# Photos

Drop your wedding photos here before uploading to InstantDB Storage.
This folder is gitignored — files will not be committed.

## Folder Structure

```
photos/
  home/        ← 2 photos (hero / nav cards on home page)
  story/       ← ~14–18 photos for the Our Story timeline
  rsvp/        ← 1 background/accent photo for the RSVP page
  schedule/    ← optional event photos
  misc/        ← anything else
```

## Naming Convention

Use this format so photos sort correctly on the Story page:

```
story/01-prom-1.jpg
story/01-prom-2.jpg
story/02-college-1.jpg
story/03-proposal-1.jpg
story/03-proposal-2.jpg
story/04-nischitartham-1.jpg
story/04-nischitartham-2.jpg
story/04-nischitartham-3.jpg
```

- `NN` = 2-digit chapter number (01, 02, …) — controls display order
- Name part is for your reference only
- Stick to `.jpg` or `.webp` — convert `.HEIC` first
- Aim for <500KB per photo (resize to ~1800px longest side)

## Uploading

Once your photos are in these folders, run:

```bash
bun run scripts/upload-photos.ts
```

Or upload manually via the admin page at `/admin` → Photos tab.

## Chapter Map

| Chapter | Prefix | Count |
|---------|--------|-------|
| Prom era (2018) | `story/01-` | 2 |
| College years | `story/02-` | 2 |
| Proposal / Engagement | `story/03-` | 2–3 |
| Nischitartham ceremony | `story/04-` | 4–6 |
| Home hero | `home/` | 2 |
| RSVP background | `rsvp/` | 1 |

See `spec/09-photos.md` for the full upload script and query examples.
