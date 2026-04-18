"use client";

import { db } from "@/lib/instant/db";
import { RSVPSection } from "@/components/schedule/RSVPSection";
import { SectionBanner } from "@/components/SectionBanner";

const VISIBLE_GROUPS: Record<string, string[]> = {
  "wedding-party": ["all", "family", "wedding-party"],
  family: ["all", "family"],
  general: ["all"],
  admin: ["all", "family", "wedding-party"],
};

export function RSVPStandaloneSection() {
  const { user } = db.useAuth();

  const { isLoading: guestLoading, data: guestData } = db.useQuery(
    user ? { guests: { $: { where: { email: user.email! } } } } : null,
  );

  const { data: eventsData } = db.useQuery(
    user ? { scheduleEvents: {} } : null,
  );

  const guest = guestData?.guests?.[0];
  const scheduleGroup: string = guest?.scheduleGroup ?? "general";
  const visibleGroups = VISIBLE_GROUPS[scheduleGroup] ?? ["all"];

  const allEvents = eventsData?.scheduleEvents ?? [];
  const guestEvents = allEvents.filter((e) =>
    visibleGroups.includes(e.group ?? "all"),
  );

  if (guestLoading || !guest) return null;

  return (
    <section
      id="rsvp"
      className="w-full"
      style={{ backgroundColor: "var(--color-bg)", scrollMarginTop: "64px" }}
    >
      <SectionBanner match="palace" fallbackMatch="venue/" height="24vh" />
      <div className="mx-auto max-w-2xl px-5 py-16">
        <header className="mb-12 text-center">
          <p
            className="mb-3 text-xs tracking-[0.3em] uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            November 28, 2026 · Boston
          </p>
          <h2
            className="text-5xl md:text-6xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontWeight: 400,
            }}
          >
            RSVP
          </h2>
          <div
            className="mx-auto mt-5 h-px w-24"
            style={{ backgroundColor: "var(--color-border-gold)" }}
          />
          <p
            className="mt-5 text-sm font-light"
            style={{ color: "var(--color-text-muted)" }}
          >
            Let us know if you&apos;ll be joining us for the celebration.
          </p>
        </header>

        <RSVPSection
          guest={{
            id: guest.id as string,
            email: guest.email as string,
            name: guest.name as string | undefined,
            rsvpStatus: guest.rsvpStatus as string | undefined,
            mealPreference: guest.mealPreference as string | undefined,
            dietaryRestrictions: guest.dietaryRestrictions as string | undefined,
            partySize: guest.partySize as number | undefined,
            attendingEventIds: guest.attendingEventIds as string | undefined,
          }}
          visibleEvents={guestEvents.map((e) => ({
            id: e.id,
            title: e.title as string,
            day: e.day as string,
            startTime: e.startTime as string,
            location: e.location as string | undefined,
            group: e.group as string,
          }))}
        />
      </div>
    </section>
  );
}
