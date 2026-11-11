/**
 * Final touch-ups: breakfast dress code + shuttle location copy.
 * Run: bun scripts/fix-schedule-copy.ts
 */

import { init } from "@instantdb/admin";
import schema from "../src/instant.schema";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
  schema,
});

await db.transact([
  db.tx.scheduleEvents["0ea869a3-4c08-40e0-84a4-8b6930cc1c76"].update({
    dressCode: "Casual",
  }),
  db.tx.scheduleEvents["6744d5d0-8c61-4053-91f2-5f28315b589c"].update({
    location: "InterContinental Boston, 510 Atlantic Ave, Boston MA",
  }),
  db.tx.scheduleEvents["8b29e751-ff07-4ceb-9cc8-1f29370c50ea"].update({
    startTime: "4:00 PM",
    endTime: "6:00 PM",
    location: "Abigail Adams Pre-Function (Foyer), InterContinental Boston, 510 Atlantic Ave, Boston MA",
  }),
]);

console.log(
  "✅ Breakfast dress code set to Casual; shuttle location cleaned up",
);
