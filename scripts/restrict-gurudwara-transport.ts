/**
 * Restrict the "Shuttle to the Gurudwara" schedule event to only the parties
 * listed on the "Gurudwara Transport" tab of the RSVP List sheet
 * (28 people across 23 parties).
 *
 * Why: the shuttle event was linked to every guest (152), so guests who were
 * never on the bus saw it in their schedule. Event visibility is party-level
 * (scheduleEvents.invitedGuests), so we link exactly the parties that contain
 * a rider.
 *
 * Run: bun scripts/restrict-gurudwara-transport.ts
 *      bun scripts/restrict-gurudwara-transport.ts --dry-run
 */
export {};

import { init } from "@instantdb/admin";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
});

const SHUTTLE_EVENT_ID = "6744d5d0-8c61-4053-91f2-5f28315b589c";
const DRY_RUN = process.argv.includes("--dry-run");

/** Every person on the "Gurudwara Transport" tab, in sheet order. */
const BUS_RIDERS = [
  "Land Tantichot", // party head is stored as "Land Kittipak" in InstantDB
  "Grand Tantichot",
  "Ben Kuperschmid",
  "Alex Liu",
  "Max Chen",
  "Ekansh Bharti",
  "Ryan Le",
  "Joanne Wang",
  "Vedant Bhat",
  "Craig Nyazema",
  "Hasan Ghori",
  "Edward Cho",
  "Faiz Malik",
  "Soohoon Choi",
  "Andrew Lei",
  "Dhruv Miglani",
  "Eyas Ayesh",
  "Augustinius Vrattos",
  "Yuliya Subotskaya",
  "Stepan Parunashvili",
  "Daksh Gupta",
  "Allison Fister",
  "Vaishant Kameswaran",
  "Saarth Shah",
  "Parker Bjur",
  "Seamus McAvoy",
  "Aika McAvoy",
  "Tae Kim",
];

/** Names that appear differently in the sheet vs. InstantDB. */
const ALIASES: Record<string, string[]> = {
  "land tantichot": ["land kittipak"],
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
    invitees: { $: { fields: ["id", "name", "sortOrder"] } },
    $: { fields: ["id", "name", "email", "rsvpStatus"] },
  },
  scheduleEvents: { $: { fields: ["id", "title", "informational", "day"] } },
});
const guests: any[] = data.guests ?? [];
const shuttle = (data.scheduleEvents ?? []).find(
  (e: any) => e.id === SHUTTLE_EVENT_ID,
);

if (!shuttle) {
  console.error(`❌ Shuttle event ${SHUTTLE_EVENT_ID} not found`);
  process.exit(1);
}

// Resolve each rider to the guest (party) that contains them.
const riderParty = new Map<string, any>();
const unresolved: string[] = [];
for (const rider of BUS_RIDERS) {
  const wanted = aliasesFor(rider);
  const party = guests.find((g) =>
    (g.invitees ?? []).some((inv: any) => wanted.has(norm(inv.name))),
  );
  if (!party) {
    unresolved.push(rider);
    continue;
  }
  riderParty.set(rider, party);
}

const parties = [...new Set([...riderParty.values()].map((g) => g.id))];
const partyById = new Map(guests.map((g) => [g.id, g]));

console.log(`Riders resolved: ${riderParty.size}/${BUS_RIDERS.length}`);
console.log(`Parties selected: ${parties.length}`);
if (unresolved.length) console.log("Unresolved:", unresolved.join(", "));

// Show who is on the bus and who else shares their party (party-level visibility).
for (const id of parties) {
  const party = partyById.get(id)!;
  const riders = (party.invitees ?? []).filter((inv: any) =>
    [...riderParty.entries()].some(
      ([rider, p]) => p.id === id && aliasesFor(rider).has(norm(inv.name)),
    ),
  );
  const others = (party.invitees ?? []).filter(
    (inv: any) => !riders.some((r: any) => r.id === inv.id),
  );
  const extra = others.length
    ? `  (+${others.map((o: any) => o.name).join(", ")} shares party login)`
    : "";
  console.log(
    `  • ${party.name}: ${riders.map((r: any) => r.name).join(", ")}${extra}`,
  );
}

if (ridersCount() !== BUS_RIDERS.length || parties.length !== 23) {
  console.error(
    `❌ Expected ${BUS_RIDERS.length} riders across 23 parties — aborting.`,
  );
  process.exit(1);
}

function ridersCount() {
  return riderParty.size;
}

if (DRY_RUN) {
  console.log("\nDry run — no writes.");
  process.exit(0);
}

// InstantDB transact updates can't replace a link list in place, so unlink the
// current parties first and link the bus parties after.
const current: any = await db.query({
  scheduleEvents: {
    invitedGuests: { $: { fields: ["id"] } },
    $: { where: { id: SHUTTLE_EVENT_ID }, fields: ["id"] },
  },
});
const currentIds: string[] = (
  current.scheduleEvents?.[0]?.invitedGuests ?? []
).map((g: any) => g.id);
const toUnlink = currentIds.filter((id) => !parties.includes(id));
const toLink = parties.filter((id) => !currentIds.includes(id));

console.log(
  `\nUnlinking ${toUnlink.length} non-bus parties, linking ${toLink.length} bus parties.`,
);

const res = await fetch("https://api.instantdb.com/admin/transact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.INSTANT_ADMIN_TOKEN}`,
    "App-Id": process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  },
  body: JSON.stringify({
    steps: [
      ...(toUnlink.length
        ? [
            [
              "unlink",
              "scheduleEvents",
              SHUTTLE_EVENT_ID,
              { invitedGuests: toUnlink },
            ],
          ]
        : []),
      ...(toLink.length
        ? [
            [
              "link",
              "scheduleEvents",
              SHUTTLE_EVENT_ID,
              { invitedGuests: toLink },
            ],
          ]
        : []),
    ],
  }),
});

const json: any = await res.json();
if (!res.ok) {
  console.error("Transact failed:", JSON.stringify(json, null, 2));
  process.exit(1);
}

// Verify from the server: exactly the 23 parties are now linked.
const after: any = await db.query({
  scheduleEvents: {
    invitedGuests: {
      invitees: { $: { fields: ["id", "name"] } },
      $: { fields: ["id", "name"] },
    },
    $: { where: { id: SHUTTLE_EVENT_ID }, fields: ["id", "title"] },
  },
});
const linked: any[] = after.scheduleEvents?.[0]?.invitedGuests ?? [];
const people = linked.reduce((n, g: any) => n + (g.invitees ?? []).length, 0);
console.log(
  `\n✅ Shuttle now linked to ${linked.length} parties (${people} invitees)`,
);
for (const g of linked.sort((a: any, b: any) => a.name.localeCompare(b.name))) {
  console.log(
    `   ${g.name}: ${(g.invitees ?? []).map((i: any) => i.name).join(", ")}`,
  );
}
