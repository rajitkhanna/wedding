/**
 * Adds the "Jacket Pickup" schedule event (Sat 8:45–9:00 AM at the Gurudwara,
 * right after the shuttle drops off) and links it only to the parties of the
 * groomsmen still waiting on a jacket — the 16 names on the
 * "Jacket Distribution - Saturday, Nov 28" tab of the RSVP List sheet:
 * https://docs.google.com/spreadsheets/d/1g85UsbKWiJNyH0Bqgk6rbc_nTGKZAAMxvZR4RV_A6V0/edit?gid=167033468
 *
 * Visibility is party-level (scheduleEvents.invitedGuests), so everyone who
 * shares a login with a jacket recipient also sees the pickup card.
 *
 * Run: bun scripts/add-jacket-pickup-event.ts [--dry-run]
 */

export {};

import { init } from "@instantdb/admin";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN!;

if (!APP_ID || !ADMIN_TOKEN) {
  console.error("Missing NEXT_PUBLIC_INSTANT_APP_ID or INSTANT_ADMIN_TOKEN");
  process.exit(1);
}

const db = init({ appId: APP_ID, adminToken: ADMIN_TOKEN });

const EVENT_ID = "c4a1f3d2-9b7e-4c2a-8f61-6d5e0b3a9c47";
const DRY_RUN = process.argv.includes("--dry-run");

const GW =
  "Westborough Gurudwara Sahib, 168 Flanders Rd, Westborough, MA 01581";
const GW_URL =
  "https://maps.google.com/maps?q=168+Flanders+Rd,+Westborough,+MA+01581";

const EVENT = {
  title: "Jacket Pickup",
  day: "saturday",
  startTime: "8:45 AM",
  endTime: "9:00 AM",
  location: GW,
  locationUrl: GW_URL,
  description:
    "Grab your jacket from our wedding planner as soon as the bus drops off at the Gurudwara. Takes a minute — no need to miss breakfast.",
  informational: true,
  sortOrder: 10,
};

/** Everyone on the jacket distribution tab, in sheet order. */
const RECIPIENTS = [
  "Augustinius (Gus) Vrattos",
  "Seamus McAvoy",
  "Andrew Lei",
  "Faiz Malik",
  "Edward Cho",
  "Max Chen",
  "Ryan Le",
  "Ekansh Bharti",
  "Craig Nyazema",
  "Hasan Ghori",
  "Dhruv Miglani",
  "Eyas Ayesh",
  "Vedant Bhat",
  "Daksh Gupta",
  "Soohoon Choi",
  "Vaishant Kameswaran",
];

/** Names that appear differently in the sheet vs. InstantDB. */
const ALIASES: Record<string, string[]> = {
  "augustinius gus vrattos": ["augustinius vrattos"],
};

const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const aliasesFor = (name: string) => {
  const key = norm(name);
  return new Set([key, ...(ALIASES[key] ?? []).map(norm)]);
};

const data: any = await db.query({
  guests: {
    invitees: { $: { fields: ["id", "name"] } },
    $: { fields: ["id", "name", "email"] },
  },
  scheduleEvents: { $: { fields: ["id", "title", "day", "startTime"] } },
});
const guests: any[] = data.guests ?? [];
const existing = (data.scheduleEvents ?? []).find(
  (e: any) => e.id === EVENT_ID,
);

// Resolve each recipient to the guest (party) that contains them.
const recipientParty = new Map<string, any>();
const unresolved: string[] = [];
for (const name of RECIPIENTS) {
  const wanted = aliasesFor(name);
  const party = guests.find((g) =>
    (g.invitees ?? []).some((inv: any) => wanted.has(norm(inv.name))),
  );
  if (!party) {
    unresolved.push(name);
    continue;
  }
  recipientParty.set(name, party);
}

const parties: string[] = [
  ...new Set([...recipientParty.values()].map((g: any) => g.id)),
];
const partyById = new Map(guests.map((g: any) => [g.id, g]));

console.log(`Recipients resolved: ${recipientParty.size}/${RECIPIENTS.length}`);
console.log(`Parties selected: ${parties.length}`);
if (unresolved.length) console.log("Unresolved:", unresolved.join(", "));

for (const [name, party] of recipientParty) {
  const others = (party.invitees ?? []).filter(
    (inv: any) => !aliasesFor(name).has(norm(inv.name)),
  );
  const extra = others.length
    ? `  (+${others.map((o: any) => o.name).join(", ")} shares party login)`
    : "";
  console.log(`  • ${name} → ${partyById.get(party.id)!.name}${extra}`);
}

if (unresolved.length || parties.length !== RECIPIENTS.length) {
  console.error(
    `❌ Expected ${RECIPIENTS.length} recipients across ${RECIPIENTS.length} parties — aborting.`,
  );
  process.exit(1);
}

if (existing) {
  console.log(
    `\nEvent ${EVENT_ID} already exists: "${existing.title}" (${existing.day} ${existing.startTime}) — updating attrs + links.`,
  );
}

if (DRY_RUN) {
  console.log("\nDry run — no writes.");
  console.log(JSON.stringify({ id: EVENT_ID, ...EVENT }, null, 2));
  process.exit(0);
}

const res = await fetch("https://api.instantdb.com/admin/transact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ADMIN_TOKEN}`,
    "App-Id": APP_ID,
  },
  body: JSON.stringify({
    steps: [
      ["update", "scheduleEvents", EVENT_ID, EVENT],
      ["link", "scheduleEvents", EVENT_ID, { invitedGuests: parties }],
    ],
  }),
});

const json: any = await res.json();
if (!res.ok) {
  console.error("Transact failed:", JSON.stringify(json, null, 2));
  process.exit(1);
}

// Verify from the server: the event exists and carries exactly these parties.
const after: any = await db.query({
  scheduleEvents: {
    invitedGuests: {
      invitees: { $: { fields: ["id", "name"] } },
      $: { fields: ["id", "name"] },
    },
    $: {
      where: { id: EVENT_ID },
      fields: [
        "id",
        "title",
        "day",
        "startTime",
        "endTime",
        "location",
        "sortOrder",
        "informational",
      ],
    },
  },
});
const ev = after.scheduleEvents?.[0];
if (!ev) {
  console.error("❌ Event not found after transact");
  process.exit(1);
}
const linked: any[] = ev.invitedGuests ?? [];
const people = linked.reduce((n, g: any) => n + (g.invitees ?? []).length, 0);
console.log(
  `\n✅ "${ev.title}" — ${ev.day} ${ev.startTime}–${ev.endTime} @ ${ev.location}`,
);
console.log(`   Linked to ${linked.length} parties (${people} invitees)`);
for (const g of linked.sort((a: any, b: any) => a.name.localeCompare(b.name))) {
  console.log(
    `   ${g.name}: ${(g.invitees ?? []).map((i: any) => i.name).join(", ")}`,
  );
}
