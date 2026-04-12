/**
 * Seeds scheduleEvents into InstantDB via the admin REST API.
 * Run: bun scripts/seed-schedule.ts
 * Source: InterContinental Boston hotel contract + Westborough Gurudwara
 */

export {};

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN!;

if (!APP_ID || !ADMIN_TOKEN) {
  console.error("Missing NEXT_PUBLIC_INSTANT_APP_ID or INSTANT_ADMIN_TOKEN");
  process.exit(1);
}

const IC = "InterContinental Boston";
const IC_URL =
  "https://maps.google.com/?q=InterContinental+Boston+510+Atlantic+Ave";
const GW_URL = "https://maps.google.com/?q=Westborough+Gurudwara";

const events = [
  // ── Friday, November 27 ───────────────────────────────────────────
  {
    id: "sch-fri-01",
    title: "Afternoon Tea",
    day: "friday",
    startTime: "4:00 PM",
    endTime: "6:00 PM",
    location: `Abigail Adams Pre-Function, ${IC}`,
    locationUrl: IC_URL,
    description:
      "An intimate welcome gathering for family and close friends before the weekend begins.",
    group: "family",
    sortOrder: 10,
  },
  {
    id: "sch-fri-02",
    title: "Welcome Dinner",
    day: "friday",
    startTime: "6:30 PM",
    endTime: "11:00 PM",
    location: `Abigail Adams Ballroom, ${IC}`,
    locationUrl: IC_URL,
    description:
      "Dinner to kick off the wedding weekend. We're so glad you made it.",
    group: "all",
    sortOrder: 20,
  },

  // ── Saturday, November 28 ─────────────────────────────────────────
  {
    id: "sch-sat-01",
    title: "Anand Karaj — Sikh Ceremony",
    day: "saturday",
    startTime: "TBD AM",
    endTime: "TBD",
    location: "Westborough Gurudwara",
    locationUrl: GW_URL,
    description:
      "The Sikh wedding ceremony. Please cover your head and remove your shoes before entering. A shuttle back to the InterContinental will depart after the ceremony.",
    group: "all",
    sortOrder: 10,
  },
  {
    id: "sch-sat-02",
    title: "Afternoon Tea",
    day: "saturday",
    startTime: "4:00 PM",
    endTime: "6:00 PM",
    location: `Abigail Adams Pre-Function, ${IC}`,
    locationUrl: IC_URL,
    description: "A relaxed pre-evening gathering.",
    group: "family",
    sortOrder: 20,
  },
  {
    id: "sch-sat-03",
    title: "Cocktail Reception",
    day: "saturday",
    startTime: "6:00 PM",
    endTime: "7:00 PM",
    location: `Rose Kennedy Ballroom, ${IC}`,
    locationUrl: IC_URL,
    description: "Drinks and appetizers before the Sangeet.",
    group: "all",
    sortOrder: 30,
  },
  {
    id: "sch-sat-04",
    title: "Sangeet & Reception",
    day: "saturday",
    startTime: "7:00 PM",
    endTime: "11:00 PM",
    location: `Rose Kennedy Ballroom, ${IC}`,
    locationUrl: IC_URL,
    description: "An evening of music, dancing, and celebration.",
    group: "all",
    sortOrder: 40,
  },

  // ── Sunday, November 29 ───────────────────────────────────────────
  {
    id: "sch-sun-01",
    title: "Breakfast Buffet",
    day: "sunday",
    startTime: "8:00 AM",
    endTime: "10:00 AM",
    location: `Rose Kennedy Ballroom, ${IC}`,
    locationUrl: IC_URL,
    description: "Start the morning with us before the ceremony.",
    group: "all",
    sortOrder: 10,
  },
  {
    id: "sch-sun-02",
    title: "Telugu Wedding Ceremony",
    day: "sunday",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    location: `Abigail Adams Ballroom, ${IC}`,
    locationUrl: IC_URL,
    description:
      "A traditional Hindu Brahmin ceremony in Telugu and Sanskrit. Bright, festive colors are warmly encouraged.",
    group: "all",
    sortOrder: 20,
  },
  {
    id: "sch-sun-03",
    title: "Lunch",
    day: "sunday",
    startTime: "12:00 PM",
    endTime: "2:00 PM",
    location: `Rose Kennedy Ballroom, ${IC}`,
    locationUrl: IC_URL,
    description: "A celebratory lunch to close out the weekend together.",
    group: "all",
    sortOrder: 30,
  },
];

const steps = events.map(({ id, ...attrs }) => [
  "update",
  "scheduleEvents",
  id,
  attrs,
]);

const res = await fetch("https://api.instantdb.com/admin/transact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ADMIN_TOKEN}`,
    "App-Id": APP_ID,
  },
  body: JSON.stringify({ steps }),
});

const json = await res.json();

if (!res.ok) {
  console.error("Transact failed:", JSON.stringify(json, null, 2));
  process.exit(1);
}

console.log(`✅ Seeded ${events.length} schedule events`);
