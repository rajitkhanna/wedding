/**
 * Links the shuttle / Saturday tea / Sunday lunch to the right guests and
 * removes Nicole Garcia-Fischer (Stepan's +1) and Christopher Price.
 * Run: bun scripts/link-schedule-nov11.ts
 */

import { init } from "@instantdb/admin";
import schema from "../src/instant.schema";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
  schema,
});

const ANAND_KARAJ = "08e6e69c-86c0-4aef-b51b-b97010dad56e";
const SANGEET = "7afa447e-2481-4a34-9686-5df1fa6eb1a3";
const TELUGU = "b468eda8-61fb-49cb-8831-2fc8328e13ee";
const SHUTTLE = "6744d5d0-8c61-4053-91f2-5f28315b589c";
const SAT_TEA = "8b29e751-ff07-4ceb-9cc8-1f29370c50ea";
const SUN_LUNCH = "e0a62c83-b574-47f3-8bc5-92b3ea92cb74";

const NICOLE_INVITEE = "b114ea7a-47cf-4095-955d-927dd6cecfdc";
const CHRISTOPHER_INVITEE = "04bcddf5-7611-4a95-ac16-5c34c5dd0008";
const CHRISTOPHER_GUEST = "c9a6f484-de74-48b8-ae3e-9ea10819b74e";

const data = await db.query({
  guests: { invitedEvents: {} },
});

type Guest = { id: string; invitedEvents?: { id: string }[] };

const invitedTo = (eventId: string) =>
  (data.guests as Guest[]).filter((g) =>
    (g.invitedEvents ?? []).some((e) => e.id === eventId),
  );

const shuttleGuests = invitedTo(ANAND_KARAJ);
const teaGuests = invitedTo(SANGEET);
const lunchGuests = invitedTo(TELUGU);

const transactions: unknown[] = [];

for (const g of shuttleGuests) {
  transactions.push(db.tx.guests[g.id].link({ invitedEvents: SHUTTLE }));
}
for (const g of teaGuests) {
  transactions.push(db.tx.guests[g.id].link({ invitedEvents: SAT_TEA }));
}
for (const g of lunchGuests) {
  transactions.push(db.tx.guests[g.id].link({ invitedEvents: SUN_LUNCH }));
}

transactions.push(
  db.tx.invitees[NICOLE_INVITEE].delete(),
  db.tx.invitees[CHRISTOPHER_INVITEE].delete(),
  db.tx.guests[CHRISTOPHER_GUEST].delete(),
);

for (let i = 0; i < transactions.length; i += 100) {
  await db.transact(transactions.slice(i, i + 100) as never);
}

console.log(
  `✅ Linked shuttle to ${shuttleGuests.length}, Saturday tea to ${teaGuests.length}, Sunday lunch to ${lunchGuests.length}`,
);
console.log("✅ Removed Nicole Garcia-Fischer and Christopher Price");
