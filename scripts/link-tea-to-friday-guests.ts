/**
 * Links the Friday "Tea and Snacks" event to every guest invited to the
 * Friday evening event (Haldi, Mehndi, and Cocktail), so the tea shows on
 * their schedule even though it isn't an RSVP choice.
 *
 * Run: bun scripts/link-tea-to-friday-guests.ts
 */

import { init } from "@instantdb/admin";
import schema from "../src/instant.schema";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN!;

const TEA_EVENT_ID = "b79a621d-4656-454a-9233-ee5bbb087390";
const FRIDAY_EVENT_IDS = new Set([
  "426e8632-263a-40da-9ded-fb8284b63ab7", // Haldi, Mehndi, and Cocktail
]);

const db = init({ appId: APP_ID, adminToken: ADMIN_TOKEN, schema });

async function main() {
  const data = await db.query({
    guests: { invitedEvents: {} },
  });

  const missing = data.guests.filter((guest) => {
    const ids = (guest.invitedEvents ?? []).map((ev: { id: string }) => ev.id);
    const invitedFriday = ids.some((id) => FRIDAY_EVENT_IDS.has(id));
    return invitedFriday && !ids.includes(TEA_EVENT_ID);
  });

  console.log(
    `${data.guests.length} guests, ${missing.length} need the tea link`,
  );

  for (const guest of missing) {
    await db.transact(
      db.tx.guests[guest.id].link({ invitedEvents: TEA_EVENT_ID }),
    );
  }

  const after = await db.query({
    guests: { invitedEvents: {} },
  });
  const linked = after.guests.filter((guest) =>
    (guest.invitedEvents ?? []).some(
      (ev: { id: string }) => ev.id === TEA_EVENT_ID,
    ),
  ).length;

  console.log(`✅ Tea event now linked to ${linked} guests`);
}

main();
