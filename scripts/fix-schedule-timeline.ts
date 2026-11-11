/**
 * Timeline corrections: tea ordering/copy, Saturday lunch, Sangeet performances.
 * Run: bun scripts/fix-schedule-timeline.ts
 */

import { init } from "@instantdb/admin";
import schema from "../src/instant.schema";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
  schema,
});

const FRIDAY_TEA = "b79a621d-4656-454a-9233-ee5bbb087390";
const SAT_TEA = "8b29e751-ff07-4ceb-9cc8-1f29370c50ea";
const ANAND = "08e6e69c-86c0-4aef-b51b-b97010dad56e";
const SANGEET = "7afa447e-2481-4a34-9686-5df1fa6eb1a3";

await db.transact([
  db.tx.scheduleEvents[FRIDAY_TEA].update({
    location:
      "Abigail Adams Pre-Function (Foyer), InterContinental Boston, 510 Atlantic Ave, Boston MA",
  }),
  db.tx.scheduleEvents[SAT_TEA].update({
    sortOrder: 35,
  }),
  db.tx.scheduleEvents[ANAND].update({
    description: "8:00 AM · Breakfast\n11:00 AM · Ceremony\n12:30 PM · Lunch",
  }),
  db.tx.scheduleEvents[SANGEET].update({
    description:
      "6:00 PM · Cocktail hour in the Rose Kennedy Foyer\n7:00 PM · Grand entrance\n7:30 PM · Performances\n8:30 PM · Dinner\n9:30 PM · Dancing",
  }),
]);

console.log("✅ Timeline corrections applied");
