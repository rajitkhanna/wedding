import { init } from "@instantdb/admin";
import { NextRequest, NextResponse } from "next/server";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const result = await db.query({
      guests: { $: { where: { code: code.toUpperCase() } } },
    });

    const guest = result.guests?.[0];
    if (!guest?.email) {
      return NextResponse.json({ error: "Invalid code" }, { status: 404 });
    }

    const email = (guest.email as string).toLowerCase();
    if (email !== guest.email) {
      await db.transact(db.tx.guests[guest.id as string].update({ email }));
    }

    const token = await db.auth.createToken(email);
    return NextResponse.json({ token });
  } catch (err) {
    console.error("[/api/lookup]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
