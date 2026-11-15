/**
 * Removes the standalone Saturday "Breakfast" event at the Gurudwara and
 * folds the meal into the Anand Karaj event, whose running order already reads
 * "8:00 AM · Breakfast / 11:00 AM · Ceremony / 12:30 PM · Lunch".
 *
 * Run: bun scripts/remove-saturday-breakfast.ts
 *      bun scripts/remove-saturday-breakfast.ts --dry-run
 */
export {};

import { init } from "@instantdb/admin";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
});

const BREAKFAST_EVENT_ID = "f47b7cd0-934e-4e40-b459-96ba1c922e6a";
const ANAND_KARAJ_ID = "08e6e69c-86c0-4aef-b51b-b97010dad56e";
const COURTESY_DESCRIPTION =
  "8:00 AM · Breakfast at the Gurudwara\n11:00 AM · Ceremony\n12:30 PM · Lunch";

const DRY_RUN = process.argv.includes("--dry-run");

const before: any = await db.query({
  scheduleEvents: {
    invitedGuests: { $: { fields: ["id"] } },
    $: { fields: ["id", "title", "day", "informational"] },
  },
});
const breakfast = (before.scheduleEvents ?? []).find(
  (e: any) => e.id === BREAKFAST_EVENT_ID,
);
const anandKaraj = (before.scheduleEvents ?? []).find(
  (e: any) => e.id === ANAND_KARAJ_ID,
);

if (!anandKaraj) {
  console.error("❌ Anand Karaj event not found — aborting");
  process.exit(1);
}

console.log(
  breakfast
    ? `Found Saturday "${breakfast.title}" (${breakfast.invitedGuests?.length ?? 0} parties)`
    : "Saturday breakfast event already absent",
);
console.log("Anand Karaj description will read:");
console.log(
  COURTESY_DESCRIPTION.split("\n")
    .map((l) => `   ${l}`)
    .join("\n"),
);

if (DRY_RUN) {
  console.log("\nDry run — no writes.");
  process.exit(0);
}

const steps: unknown[] = [
  [
    "update",
    "scheduleEvents",
    ANAND_KARAJ_ID,
    { description: COURTESY_DESCRIPTION },
  ],
  ...(breakfast ? [["delete", "scheduleEvents", BREAKFAST_EVENT_ID]] : []),
];

const res = await fetch("https://api.instantdb.com/admin/transact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.INSTANT_ADMIN_TOKEN}`,
    "App-Id": process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  },
  body: JSON.stringify({ steps }),
});
const json: any = await res.json();
if (!res.ok) {
  console.error("Transact failed:", JSON.stringify(json, null, 2));
  process.exit(1);
}

const after: any = await db.query({
  scheduleEvents: { $: { fields: ["id", "title", "day", "description"] } },
});
const stillThere = (after.scheduleEvents ?? []).some(
  (e: any) => e.id === BREAKFAST_EVENT_ID,
);
const ak = (after.scheduleEvents ?? []).find(
  (e: any) => e.id === ANAND_KARAJ_ID,
);

console.log(`\n✅ Saturday breakfast event removed: ${!stillThere}`);
console.log("Anand Karaj description now:");
console.log(
  ak.description
    .split("\n")
    .map((l: string) => `   ${l}`)
    .join("\n"),
);
