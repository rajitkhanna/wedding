import { init } from "@instantdb/admin";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { RSVPConfirmation, type RSVPEvent } from "@/emails/RSVPConfirmation";
import { cld } from "@/lib/cloudflare";
import * as React from "react";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
});

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { guestName, contactEmail, events, guestCode } = (await req.json()) as {
      guestName: string;
      contactEmail: string;
      events: RSVPEvent[];
      guestCode?: string;
    };

    if (!contactEmail || !events?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch images fresh (signed URLs) from InstantDB
    const result = await db.query({ $files: {} });
    const allFiles: any[] = (result as any).$files ?? [];

    const heroFile =
      allFiles.find((f) => f.path === "hero/colonnade-smiling-cover.jpg") ??
      allFiles.find((f) => f.event === "hero");
    const secondFile =
      allFiles.find((f) => f.path === "story/03-engagement-8.jpg") ??
      heroFile;

    const heroImageUrl = heroFile ? cld(heroFile.url, { width: 600, quality: 85 }) : "";
    const secondImageUrl = secondFile ? cld(secondFile.url, { width: 600, quality: 85 }) : "";

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Meghana & Rajit <hi@meghanarajit.com>",
      to: [contactEmail],
      subject: "Your RSVP is confirmed — Meghana & Rajit",
      react: React.createElement(RSVPConfirmation, {
        guestName,
        events,
        heroImageUrl,
        secondImageUrl,
        guestCode,
      }),
    });

    if (error) {
      console.error("[rsvp-confirm]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[rsvp-confirm]", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
