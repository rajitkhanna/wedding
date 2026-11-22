/**
 * Sends the "your itinerary + your code" email to everyone who RSVP'd yes.
 *
 * Each party gets their own PDF attached — their events only (informational
 * events plus whatever they're attending), plus their code.
 *
 * Audience = guest parties with at least one invitee attending an event, minus
 * parties the planner's list no longer includes (they dropped out after
 * RSVPing: Saarth Shah, Krishnamurti Tanniru — see the reconciliation against
 * the "Everyone" tab of the RSVP List sheet).
 *
 * Usage:
 *   bun scripts/send-itinerary.ts --dry-run   # list recipients, send nothing
 *   bun scripts/send-itinerary.ts --draft     # one email to Rajit, code BANANA
 *   bun scripts/send-itinerary.ts --send      # everyone
 */
export {};

import { init } from "@instantdb/admin";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { ItineraryEmail } from "@/emails/ItineraryEmail";
import {
  renderItineraryPdf,
  type ItineraryEvent,
} from "@/lib/schedule/itineraryPdf";
import { guestRecipientEmails } from "@/lib/recipients";
import * as React from "react";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "Meghana & Rajit <hi@meghanarajit.com>";
const DRAFT_TO = "rajitskhanna@gmail.com";

if (!APP_ID || !ADMIN_TOKEN || !RESEND_API_KEY) {
  console.error(
    "Missing env vars: NEXT_PUBLIC_INSTANT_APP_ID, INSTANT_ADMIN_TOKEN, RESEND_API_KEY",
  );
  process.exit(1);
}

const draftArg = process.argv.find((a) => a.startsWith("--draft"));
const isDraft = Boolean(draftArg);
const draftCode = draftArg && draftArg.includes("=") ? draftArg.split("=")[1].toUpperCase() : "BANANA";
const isSend = process.argv.includes("--send");
const isDryRun = process.argv.includes("--dry-run");

if (!isDraft && !isSend && !isDryRun) {
  console.error("Pass --dry-run, --draft, or --send");
  process.exit(1);
}

/** Parties who RSVP'd yes but dropped out — absent from the planner's list. */
const EXCLUDED_PARTIES = new Set(["saarth shah", "krishnamurti tanniru"]);

const db = init({ appId: APP_ID, adminToken: ADMIN_TOKEN });
const resend = new Resend(RESEND_API_KEY);

const result = await db.query({
  guests: {
    invitees: { attendingEvents: {}, $: { fields: ["name"] } },
    invitedEvents: {},
    $: {
      fields: ["id", "name", "email", "contactEmail", "code", "rsvpStatus"],
    },
  },
});
const guests: any[] = (result as any).guests ?? [];

const attending = guests.filter(
  (g) =>
    (g.invitees ?? []).some((i: any) => (i.attendingEvents ?? []).length > 0) &&
    !EXCLUDED_PARTIES.has(String(g.name).toLowerCase().trim()),
);

const reachable = attending.filter((g) => guestRecipientEmails([g]).length > 0);
const unreachable = attending.filter(
  (g) => guestRecipientEmails([g]).length === 0,
);

console.log(
  `${guests.length} parties · ${attending.length} attending · ${reachable.length} emailable`,
);
if (unreachable.length) {
  console.log(
    `No real email (skipped): ${unreachable.map((g: any) => g.name).join(", ")}`,
  );
}

/** The events this party actually sees, in schedule order. */
function eventsFor(guest: any): ItineraryEvent[] {
  const attendingIds = new Set<string>();
  for (const inv of guest.invitees ?? []) {
    for (const ev of inv.attendingEvents ?? []) attendingIds.add(ev.id);
  }
  return (guest.invitedEvents ?? [])
    .filter((ev: any) => ev.informational || attendingIds.has(ev.id))
    .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

if (isDryRun) {
  let count = 0;
  for (const g of reachable) {
    const emails = guestRecipientEmails([g]);
    count += emails.length;
    const evs = eventsFor(g);
    console.log(
      `  ${g.code.padEnd(11)} ${g.name} → ${emails.join(", ")} [${evs.length} events]`,
    );
  }
  console.log(`\n${count} addresses total.`);
  process.exit(0);
}

const subject = "Your itinerary — Meghana & Rajit";
const html = (code: string) =>
  render(React.createElement(ItineraryEmail, { guestCode: code }));

async function build(guest: any) {
  const evs = eventsFor(guest);
  const pdf = await renderItineraryPdf({
    guestName: guest.name,
    guestCode: guest.code,
    events: evs,
  });
  const safe = String(guest.name).replace(/[^A-Za-z0-9]+/g, "-");
  return {
    html: await html(guest.code),
    attachments: [
      { filename: `Meghana-Rajit-${safe}.pdf`, content: Buffer.from(pdf) },
    ],
    count: evs.length,
  };
}

if (isDraft) {
  const party = guests.find((g: any) => String(g.code).toUpperCase() === draftCode);
  if (!party) {
    console.error(`Draft party not found for code ${draftCode}`);
    process.exit(1);
  }
  const built = await build(party);
  await resend.emails.send({
    from: EMAIL_FROM,
    to: [DRAFT_TO],
    subject: `[DRAFT] ${subject}`,
    html: built.html,
    attachments: built.attachments,
    replyTo: "hi@meghanarajit.com",
  });
  console.log(
    `Draft sent to ${DRAFT_TO} — ${party.name} (code ${party.code}, ${built.count} events)`,
  );
  process.exit(0);
}

let sent = 0;
let failed = 0;
for (const g of reachable) {
  const emails = guestRecipientEmails([g]);
  const built = await build(g);
  // Resend caps ~2 req/sec.
  await new Promise((r) => setTimeout(r, 600));
  process.stdout.write(`  ${g.name} (${emails.length}, ${built.count} ev)… `);
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: emails,
    subject,
    html: built.html,
    attachments: built.attachments,
  });
  if (error) {
    console.log(`✗ ${error.message}`);
    failed++;
  } else {
    console.log("✓");
    sent++;
  }
}

console.log(`\nDone: ${sent} sent, ${failed} failed`);
