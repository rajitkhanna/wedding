/**
 * Writes a preview of the personalized itinerary PDF for one party, so you can
 * eyeball the layout before sending: /tmp/itinerary-<code>.pdf
 *
 * Run: bun scripts/build-itinerary-pdf.ts            # Max Chen (jacket + bus)
 *      bun scripts/build-itinerary-pdf.ts GYATT      # any party code
 */
export {};

import { init } from "@instantdb/admin";
import { writeFile } from "node:fs/promises";
import {
  renderItineraryPdf,
  type ItineraryEvent,
} from "@/lib/schedule/itineraryPdf";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN!;

const code = (process.argv[2] ?? "GYATT").toUpperCase();
const db = init({ appId: APP_ID, adminToken: ADMIN_TOKEN });

const result: any = await db.query({
  guests: {
    $: { where: { code }, fields: ["id", "name", "code"] },
    invitees: { attendingEvents: {}, $: { fields: ["id", "name"] } },
    invitedEvents: {},
  },
});
const guest = (result.guests ?? [])[0];
if (!guest) {
  console.error(`No party with code ${code}`);
  process.exit(1);
}

const attending = new Set<string>();
for (const inv of guest.invitees ?? []) {
  for (const ev of inv.attendingEvents ?? []) attending.add(ev.id);
}

const events: ItineraryEvent[] = (guest.invitedEvents ?? [])
  .filter((ev: any) => ev.informational || attending.has(ev.id))
  .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

const pdf = await renderItineraryPdf({
  guestName: guest.name,
  guestCode: guest.code,
  events,
});

const out = `/tmp/itinerary-${guest.code}.pdf`;
await writeFile(out, pdf);
console.log(
  `✅ ${out} — ${guest.name} (${events.length} events: ${events
    .map((e) => e.title)
    .join(" · ")})`,
);
