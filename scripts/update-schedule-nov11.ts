/**
 * Applies the final Nov 11 2026 event timeline to scheduleEvents.
 * Run: bun scripts/update-schedule-nov11.ts
 */

export {};

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN!;

if (!APP_ID || !ADMIN_TOKEN) {
  console.error("Missing NEXT_PUBLIC_INSTANT_APP_ID or INSTANT_ADMIN_TOKEN");
  process.exit(1);
}

const IC = "InterContinental Boston, 510 Atlantic Ave, Boston MA";
const IC_URL =
  "https://maps.google.com/?q=InterContinental+Boston+510+Atlantic+Ave+Boston+MA";
const GW =
  "Westborough Gurudwara Sahib, 168 Flanders Rd, Westborough, MA 01581";
const GW_URL =
  "https://maps.google.com/maps?q=168+Flanders+Rd,+Westborough,+MA+01581";

const updates: Record<string, unknown>[] = [
  {
    id: "b79a621d-4656-454a-9233-ee5bbb087390",
    startTime: "4:00 PM",
    endTime: "6:00 PM",
    location: `Abigail Adams Pre-Function, ${IC}`,
    locationUrl: IC_URL,
    description:
      "Tea, coffee, and light snacks before the evening's celebrations.",
  },
  {
    id: "426e8632-263a-40da-9ded-fb8284b63ab7",
    startTime: "6:30 PM",
    endTime: "11:30 PM",
    location: `Abigail Adams Ballroom, ${IC}`,
    locationUrl: IC_URL,
    description: "6:30 PM · Cocktail hour and haldi · 8:30 PM · Dinner buffet",
  },
  {
    id: "08e6e69c-86c0-4aef-b51b-b97010dad56e",
    startTime: "11:00 AM",
    endTime: "1:00 PM",
    location: GW,
    locationUrl: GW_URL,
    description: "8:00 AM · Breakfast\n11:00 AM · Ceremony\n12:00 PM · Lunch",
  },
  {
    id: "f47b7cd0-934e-4e40-b459-96ba1c922e6a",
    startTime: "8:00 AM",
    endTime: "10:30 AM",
    location: GW,
    locationUrl: GW_URL,
  },
  {
    id: "7afa447e-2481-4a34-9686-5df1fa6eb1a3",
    startTime: "6:00 PM",
    endTime: "11:00 PM",
    location: `Rose Kennedy Ballroom, ${IC}`,
    locationUrl: IC_URL,
    description:
      "6:00 PM · Cocktail hour in the Rose Kennedy Foyer\n7:00 PM · Grand entrance\n8:30 PM · Dinner\n9:30 PM · Dancing",
  },
  {
    id: "0ea869a3-4c08-40e0-84a4-8b6930cc1c76",
    startTime: "8:00 AM",
    endTime: "10:00 AM",
    location: `Rose Kennedy Ballroom, ${IC}`,
    locationUrl: IC_URL,
    dressCode: null,
  },
  {
    id: "b468eda8-61fb-49cb-8831-2fc8328e13ee",
    startTime: "10:00 AM",
    endTime: "1:00 PM",
    location: `Abigail Adams Ballroom, ${IC}`,
    locationUrl: IC_URL,
    description:
      "A traditional Telugu Hindu wedding ceremony in Telugu and Sanskrit. Lunch follows at 1:00 PM.",
    dressCode: null,
  },
];

const creates: Record<string, unknown>[] = [
  {
    id: "6744d5d0-8c61-4053-91f2-5f28315b589c",
    title: "Shuttle to the Gurudwara",
    day: "saturday",
    startTime: "7:45 AM",
    endTime: "8:45 AM",
    location: `Departs InterContinental Boston, ${IC}`,
    locationUrl: IC_URL,
    description:
      "Bus boards at 7:30 AM and departs at 7:45 AM, arriving at the Gurudwara at 8:45 AM. Return shuttle after lunch.",
    group: "all",
    informational: true,
    sortOrder: 5,
  },
  {
    id: "8b29e751-ff07-4ceb-9cc8-1f29370c50ea",
    title: "Tea and Snacks",
    day: "saturday",
    startTime: "4:30 PM",
    endTime: "6:00 PM",
    location: `Rose Kennedy Foyer, ${IC}`,
    locationUrl: IC_URL,
    description: "Coffee, tea, and light snacks before cocktail hour.",
    group: "all",
    informational: true,
    sortOrder: 25,
  },
  {
    id: "e0a62c83-b574-47f3-8bc5-92b3ea92cb74",
    title: "Lunch",
    day: "sunday",
    startTime: "1:00 PM",
    endTime: "2:00 PM",
    location: `Rose Kennedy Ballroom, ${IC}`,
    locationUrl: IC_URL,
    description: "Lunch follows the Telugu ceremony.",
    group: "all",
    informational: true,
    sortOrder: 60,
    dressCode: null,
  },
];

const steps: unknown[] = [
  ...updates.map(({ id, ...attrs }) => ["update", "scheduleEvents", id, attrs]),
  ...creates.map(({ id, ...attrs }) => ["update", "scheduleEvents", id, attrs]),
];

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
console.log(
  `✅ Updated ${updates.length} events and created ${creates.length}`,
);
