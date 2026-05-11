/**
 * Seeds a batch of guests + invitees into InstantDB.
 * Run: bun scripts/seed-guests-batch.ts
 */
export {};

import { randomUUID } from "node:crypto";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN!;

if (!APP_ID || !ADMIN_TOKEN) {
  console.error("Missing env vars");
  process.exit(1);
}

const ALL_EVENT_IDS = [
  "08e6e69c-86c0-4aef-b51b-b97010dad56e", // Saturday Anand Karaj
  "426e8632-263a-40da-9ded-fb8284b63ab7", // Friday Haldi/Mehndi/Cocktail
  "7afa447e-2481-4a34-9686-5df1fa6eb1a3", // Saturday Sangeet & Reception
  "b468eda8-61fb-49cb-8831-2fc8328e13ee", // Sunday Telugu Wedding
  "0ea869a3-4c08-40e0-84a4-8b6930cc1c76", // Sunday Breakfast
  "b79a621d-4656-454a-9233-ee5bbb087390", // Friday Tea and Snacks
  "f47b7cd0-934e-4e40-b459-96ba1c922e6a", // Saturday Breakfast
];

const guests = [
  {
    name: "Madhavi Jampana",
    email: "madhavijampana@gmail.com",
    code: "6NYCHH",
    invitees: ["Madhavi Jampana", "Prasad Jampana", "Manasa Jampana", "Manu Jampana"],
  },
  {
    name: "Shital Botadra",
    email: "shital.botadra@gmail.com",
    code: "EZQ2P7",
    invitees: ["Shital Botadra", "Sunil Botadra", "Manav Botadra", "Keval Botadra"],
  },
  {
    name: "Vamshi Pagidi",
    email: "vamshipagidi6@gmail.com",
    code: "4PZKFJ",
    invitees: ["Vamshi Pagidi"],
  },
  {
    name: "Atul Phadke",
    email: "atulphadke8@gmail.com",
    code: "HKZ87I",
    invitees: ["Atul Phadke"],
  },
  {
    name: "Anand Madarapu",
    email: "anand.madarapu05@gmail.com",
    code: "TVQSXF",
    invitees: ["Anand Madarapu"],
  },
  {
    name: "Ken Nguyen",
    email: "knguyen1043@gmail.com",
    code: "HH5X68",
    invitees: ["Ken Nguyen"],
  },
  {
    name: "Keshu Dwaraka",
    email: "hd2005.k@gmail.com",
    code: "UEXO8W",
    invitees: ["Keshu Dwaraka"],
  },
  {
    name: "Fanhao Yu",
    email: "fanhao.jaycee@gmail.com",
    code: "R1KHH2",
    invitees: ["Fanhao Yu"],
  },
  {
    name: "Rishi Keezhakada",
    email: "rishi.keezhakada@gmail.com",
    code: "79UUDD",
    invitees: ["Rishi Keezhakada"],
  },
  {
    name: "Preyas Sinha",
    email: "preyas.sinha14@gmail.com",
    code: "BZL5JO",
    invitees: ["Preyas Sinha"],
  },
  {
    name: "Ansh Khanna",
    email: "anshkhanna095@gmail.com",
    code: "U8F3EM",
    invitees: ["Ansh Khanna"],
  },
];

const steps: any[] = [];

for (const guest of guests) {
  const guestId = randomUUID();
  const inviteeIds = guest.invitees.map(() => randomUUID());

  // Create guest
  steps.push(["update", "guests", guestId, {
    name: guest.name,
    email: guest.email,
    code: guest.code,
  }]);

  // Create invitees
  for (let i = 0; i < guest.invitees.length; i++) {
    steps.push(["update", "invitees", inviteeIds[i], {
      name: guest.invitees[i],
      sortOrder: i,
    }]);
  }

  // Link invitees to guest (one step per invitee)
  for (const inviteeId of inviteeIds) {
    steps.push(["link", "guests", guestId, { invitees: inviteeId }]);
  }

  // Link guest to all events (one step per event)
  for (const eventId of ALL_EVENT_IDS) {
    steps.push(["link", "guests", guestId, { invitedEvents: eventId }]);
  }
}

console.log(`Sending ${steps.length} steps for ${guests.length} guests…`);

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
  console.error("Failed:", JSON.stringify(json, null, 2));
  process.exit(1);
}

console.log(`✅ Seeded ${guests.length} guests`);
