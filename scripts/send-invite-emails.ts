/**
 * Sends invite code emails to the 11 newly-added guests via Resend.
 * Usage:
 *   Preview (sends only to rajitskhanna@gmail.com):
 *     bun scripts/send-invite-emails.ts --preview
 *   Send for real:
 *     bun scripts/send-invite-emails.ts
 */
export {};

import { init } from "@instantdb/admin";
import { Resend } from "resend";
import { InviteEmail } from "@/emails/InviteEmail";
import { cld } from "@/lib/cloudflare";
import * as React from "react";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const EMAIL_FROM = process.env.EMAIL_FROM ?? "Meghana & Rajit <hi@meghanarajit.com>";
const PREVIEW_TO = "rajitskhanna@gmail.com";

if (!APP_ID || !ADMIN_TOKEN || !RESEND_API_KEY) {
  console.error("Missing env vars: NEXT_PUBLIC_INSTANT_APP_ID, INSTANT_ADMIN_TOKEN, RESEND_API_KEY");
  process.exit(1);
}

const isPreview = process.argv.includes("--preview");

// The 11 guest emails we just seeded
const TARGET_EMAILS = [
  "madhavijampana@gmail.com",
  "shital.botadra@gmail.com",
  "vamshipagidi6@gmail.com",
  "atulphadke8@gmail.com",
  "anand.madarapu05@gmail.com",
  "knguyen1043@gmail.com",
  "hd2005.k@gmail.com",
  "fanhao.jaycee@gmail.com",
  "rishi.keezhakada@gmail.com",
  "preyas.sinha14@gmail.com",
  "anshkhanna095@gmail.com",
];

const db = init({ appId: APP_ID, adminToken: ADMIN_TOKEN });
const resend = new Resend(RESEND_API_KEY);

// Fetch guests with their invited events
const result = await db.query({
  guests: {
    invitedEvents: {},
    $: { where: { email: { in: TARGET_EMAILS } } },
  },
});

const guests = (result as any).guests ?? [];
console.log(`Found ${guests.length} guests`);

if (guests.length === 0) {
  console.error("No guests found — check that the emails match what's in the DB");
  process.exit(1);
}

// Fetch hero image
const filesResult = await db.query({ $files: {} });
const allFiles: any[] = (filesResult as any).$files ?? [];
const heroFile =
  allFiles.find((f: any) => f.path === "hero/colonnade-smiling-cover.jpg") ??
  allFiles.find((f: any) => (f.event === "hero"));
const heroImageUrl = heroFile ? cld(heroFile.url, { width: 600, quality: 85 }) : "";

if (isPreview) {
  // Send one preview email to Rajit using the first guest's data
  const first = guests[0];
  console.log(`Sending preview to ${PREVIEW_TO} (using guest: ${first.name}, code: ${first.code})`);
  const eventDays: string[] = (first.invitedEvents ?? []).map((e: any) => e.day);
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: [PREVIEW_TO],
    subject: `[PREVIEW] You're invited — Meghana & Rajit`,
    react: React.createElement(InviteEmail, {
      guestName: first.name,
      guestCode: first.code,
      heroImageUrl,
      eventDays,
    }),
  });
  if (error) {
    console.error("Failed:", error);
    process.exit(1);
  }
  console.log(`✅ Preview sent to ${PREVIEW_TO}`);
} else {
  // Send to all guests
  let sent = 0;
  let failed = 0;
  for (const guest of guests) {
    const to = guest.email;
    console.log(`Sending to ${guest.name} <${to}> (code: ${guest.code})`);
    const eventDays: string[] = (guest.invitedEvents ?? []).map((e: any) => e.day);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: "You're invited — Meghana & Rajit",
      react: React.createElement(InviteEmail, {
        guestName: guest.name,
        guestCode: guest.code,
        heroImageUrl,
        eventDays,
      }),
    });
    if (error) {
      console.error(`  ✗ Failed for ${to}:`, error.message);
      failed++;
    } else {
      console.log(`  ✓ Sent`);
      sent++;
    }
  }
  console.log(`\nDone: ${sent} sent, ${failed} failed`);
}
