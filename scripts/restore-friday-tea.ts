/**
 * Restores the Friday "Tea and Snacks" schedule event that was deleted from
 * InstantDB. Guest `invitedEvents` links still point at this id, so re-creating
 * the entity with the same id re-attaches every guest automatically.
 *
 * Run: bun scripts/restore-friday-tea.ts
 */

import { init } from "@instantdb/admin";
import schema from "../src/instant.schema";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN!;

const EVENT_ID = "b79a621d-4656-454a-9233-ee5bbb087390";
const IC_URL =
  "https://maps.google.com/?q=InterContinental+Boston+510+Atlantic+Ave+Boston+MA";

const db = init({ appId: APP_ID, adminToken: ADMIN_TOKEN, schema });

async function main() {
  await db.transact(
    db.tx.scheduleEvents[EVENT_ID].update({
      title: "Tea and Snacks",
      day: "friday",
      startTime: "4:30 PM",
      endTime: "6:00 PM",
      location:
        "Abigail Adams Pre-Function, InterContinental Boston, 510 Atlantic Ave, Boston MA",
      locationUrl: IC_URL,
      description:
        "Tea, coffee, and light snacks before the evening's celebrations.",
      sortOrder: 10,
      informational: false,
    }),
  );

  const data = await db.query({ scheduleEvents: {} });
  const event = data.scheduleEvents.find((e) => e.id === EVENT_ID);
  console.log(JSON.stringify(event, null, 2));
}

main();
