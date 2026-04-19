# Page: Travel & Stay (`/travel-stay`)

## Goal
Help out-of-town guests navigate getting to Boston for our wedding weekend.
Clear info on airports, hotels, and getting around the city.

---

## Wireframe

```
┌─────────────────────────────────────────────────────┐
│                  TRAVEL & STAY                      │
│    "We can't wait to celebrate with you in Boston." │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ── Getting Here ──────────────────────────────     │
│                                                     │
│  ┌───────────────────┐  ┌───────────────────┐       │
│  │  ✈  Flying In     │  │  🚗  Driving       │       │
│  │                   │  │                   │       │
│  │  BOS (Logan)      │  │  I-90 / Mass Pike │       │
│  │  ~20 min to hotel │  │  Parking at IC    │       │
│  │                   │  │  (valet avail.)   │       │
│  │  Also: PVD, MHT   │  │                   │       │
│  └───────────────────┘  └───────────────────┘       │
│                                                     │
│  ── Where to Stay ─────────────────────────────     │
│                                                     │
│  ┌──────────────────────────────────────────┐       │
│  │  ★  InterContinental Boston  [PREFERRED] │       │  ← gold star badge
│  │  510 Atlantic Ave, Boston                │       │
│  │  Room block available — use code TBD     │       │
│  │  All Fri/Sat/Sun events here             │       │
│  │  [ Book Room Block → ]                   │       │
│  └──────────────────────────────────────────┘       │
│                                                     │
│  ┌──────────────────────────────────────────┐       │
│  │  🏨  Nearby Alternatives                 │       │
│  │  • [Marriott Long Wharf](https://www.marriott.com/hotels/travel/boslw-marriott-long-wharf-boston/) — 0.3 mi          │       │
│  │  • [Westin Boston Seaport](https://www.marriott.com/hotels/travel/bosws-the-westin-boston-seaport/) — 0.5 mi        │       │
│  │  • [Omni Boston Hotel](https://www.omnihotels.com/hotels/boston-ma/) — 0.7 mi            │       │
│  └──────────────────────────────────────────┘       │
│                                                     │
│  ── The Two Venues ────────────────────────────     │
│                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐   │
│  │  InterContinental   │  │  Westborough         │   │
│  │  Boston             │  │  Gurudwara           │   │
│  │                     │  │                     │   │
│  │  Fri · Sat · Sun    │  │  Sat morning only   │   │
│  │  510 Atlantic Ave   │  │  [address]          │   │
│  │  [ Map → ]          │  │  [ Map → ]          │   │
│  └─────────────────────┘  └─────────────────────┘   │
│                                                     │
│  ── Saturday Shuttle ──────────────────────────     │
│                                                     │
│  ┌──────────────────────────────────────────┐       │
│  │  🚌  Gurudwara → InterContinental         │       │
│  │  Saturday, after the Sikh ceremony        │       │
│  │  Shuttle departs: TBD                    │       │
│  │  No need to drive — we've got you.       │       │
│  └──────────────────────────────────────────┘       │
│                                                     │
│  ── Getting Around Boston ─────────────────────     │
│                                                     │
│  Uber/Lyft widely available.                        │
│  The T (Green/Red Line) stops near IC.              │
│  Parking at InterContinental (valet + self).        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Sections

### Getting Here
- **Flying:** BOS (Logan) is the primary airport, ~20 min to InterContinental.
  Secondary options: PVD (Providence, ~1hr), MHT (Manchester NH, ~1hr).
- **Driving:** I-90 Mass Pike into Boston. Valet + self-parking at InterContinental.
- **Train:** Amtrak South Station is a 5-min walk from InterContinental.

### Where to Stay
- **InterContinental Boston** — preferred
- Nearby alternatives with distance (Marriott Long Wharf, Westin Seaport, Omni)

### Getting Around
- Rideshare note
- MBTA (The T) mention

---

## Content Source
All static — `src/lib/travel-content.ts`. No DB needed.

```ts
// src/lib/travel-content.ts
export const venues = {
  intercontinental: {
    name: "InterContinental Boston",
    address: "510 Atlantic Ave, Boston, MA 02210",
    mapsUrl: "https://maps.google.com/?q=InterContinental+Boston",
    events: ["Welcome Dinner (Fri)", "Sangeet & Reception (Sat)", "Telugu Wedding (Sun)"],
    blockCode: "TBD",
    bookingUrl: "TBD",
  },
  gurudwara: {
    name: "Westborough Gurudwara",
    address: "TBD",
    mapsUrl: "TBD",
    events: ["Sikh Ceremony (Sat morning)"],
  },
}

export const shuttleInfo = {
  day: "Saturday",
  route: "Westborough Gurudwara → InterContinental Boston",
  departureTime: "TBD",
  note: "No need to drive — we've got you covered.",
}

export const airports = [
  { code: "BOS", name: "Logan International", distance: "~20 min to hotel", primary: true },
  { code: "PVD", name: "Providence (TF Green)", distance: "~1 hr drive" },
  { code: "MHT", name: "Manchester-Boston Regional", distance: "~1 hr drive" },
]
```

---

## Design Details
- Section headers: small-caps, gold, `<hr class="gold-rule" />` below
- Venue cards: side-by-side on desktop, stacked mobile; red left-border accent
- InterContinental card: gold star "PREFERRED" badge top-right
- Shuttle card: distinct treatment — slightly wider, gold border all around
- Map links: open in new tab

---

## File Structure
```
src/app/travel-stay/page.tsx          ← server component (static)
src/components/travel/VenueCard.tsx
src/components/travel/ShuttleCard.tsx
src/components/travel/HotelCard.tsx
src/components/travel/InfoCard.tsx
src/lib/travel-content.ts
```
