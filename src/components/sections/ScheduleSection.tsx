"use client";

import { useState } from "react";
import { db } from "@/lib/instant/db";
import { DayTabs, type DayKey } from "@/components/schedule/DayTabs";
import { EventCard } from "@/components/schedule/EventCard";
import { SectionBanner } from "@/components/SectionBanner";
import { personalizeScheduleEvents } from "@/lib/schedule/personalizeScheduleEvents";

const DAY_FULL_LABELS: Record<DayKey, string> = {
  friday: "Friday, November 27",
  saturday: "Saturday, November 28",
  sunday: "Sunday, November 29",
};

export function ScheduleSection({ onEditRsvp }: { onEditRsvp?: () => void }) {
  const [activeDay, setActiveDay] = useState<DayKey>("friday");

  const { user } = db.useAuth();

  const { isLoading: guestLoading, error: eventsError, data: guestData } = db.useQuery(
    user
      ? { guests: { invitees: {}, invitedEvents: {}, $: { where: { email: user.email! } } } }
      : null,
  );

  const guest = guestData?.guests?.[0];

  const invitedEvents = [...(guest?.invitedEvents ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  const personalizedEvents = personalizeScheduleEvents(invitedEvents, guest);

  const byDay = (["friday", "saturday", "sunday"] as DayKey[]).reduce<
    Record<DayKey, typeof personalizedEvents>
  >(
    (acc, day) => {
      acc[day] = personalizedEvents
        .filter((e) => e.day === day)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      return acc;
    },
    {} as Record<DayKey, typeof personalizedEvents>,
  );

  const eventCounts = {
    friday: byDay.friday.length,
    saturday: byDay.saturday.length,
    sunday: byDay.sunday.length,
  };

  const activeDayEvents = byDay[activeDay];
  const guestName = guest?.name ?? user?.email ?? "Guest";

  const hasRsvp = Boolean(guest?.rsvpStatus);
  const scheduleIntro = (() => {
    if (guestLoading) return "Loading your schedule…";
    if (!guest) return "Your personalized itinerary will appear here once your invitation is on file.";
    if (!hasRsvp) return `Welcome, ${guestName}! Complete your RSVP above to choose which events you're attending.`;
    if (guest.rsvpStatus === "not-attending")
      return "You've let us know you can't join us in Boston. We'll miss you!";
    return `Welcome, ${guestName}! Here's your weekend.`;
  })();

  return (
    <section
      id="schedule"
      className="w-full pb-24"
      style={{ backgroundColor: "var(--color-bg)", scrollMarginTop: "64px" }}
    >
      <SectionBanner match="palace" fallbackMatch="venue/" height="28vh" />
      <div className="mx-auto max-w-2xl px-5 pt-16">
        <header className="mb-12 text-center">
          <p
            className="mb-3 text-xs tracking-[0.3em] uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            November 27 – 29, 2026
          </p>
          <h2
            className="text-5xl md:text-6xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontWeight: 400,
            }}
          >
            Schedule
          </h2>
          <div
            className="mx-auto mt-5 h-px w-24"
            style={{ backgroundColor: "var(--color-border-gold)" }}
          />
          <p
            className="mt-5 text-sm font-light max-w-md mx-auto leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            {scheduleIntro}
          </p>
        </header>

        {guestLoading ? (
          <p
            className="text-sm text-center py-12"
            style={{ color: "var(--color-text-muted)" }}
          >
            Loading…
          </p>
        ) : eventsError ? (
          <p
            className="text-sm text-center py-12"
            style={{ color: "var(--color-text-muted)" }}
          >
            Could not load schedule. Please refresh.
          </p>
        ) : guest && !hasRsvp ? (
          <div
            className="rounded-lg px-6 py-14 text-center"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Your itinerary is built from the events you select in your RSVP. Tap{" "}
              <span style={{ color: "var(--color-gold-dim)" }}>RSVP</span> in the hero when
              you&apos;re ready.
            </p>
          </div>
        ) : guest?.rsvpStatus === "not-attending" ? (
          <div
            className="rounded-lg px-6 py-14 text-center"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              There are no events on your schedule. If your plans change, you can update your RSVP
              from the navigation or contact us.
            </p>
          </div>
        ) : guest?.rsvpStatus === "attending" && personalizedEvents.length === 0 ? (
          <div
            className="rounded-lg px-6 py-14 text-center"
            style={{
              color: "var(--color-text-muted)",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p className="text-sm leading-relaxed">
              You haven&apos;t selected any events yet. Open your RSVP and pick the events
              you&apos;ll join.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <DayTabs
                activeDay={activeDay}
                onChange={setActiveDay}
                eventCounts={eventCounts}
              />
            </div>

            <div className="mb-6 flex items-center gap-4">
              <h3
                className="text-2xl"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-gold)",
                  fontWeight: 400,
                }}
              >
                {DAY_FULL_LABELS[activeDay]}
              </h3>
            </div>

            {activeDayEvents.length === 0 ? (
              <div
                className="rounded-lg px-6 py-12 text-center"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  No events on your schedule for this day.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {activeDayEvents.map((event: (typeof personalizedEvents)[number]) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </>
        )}

        <div
          className="mx-auto mt-16 mb-6 h-px w-24"
          style={{ backgroundColor: "var(--color-border-gold)" }}
        />

        {guest && (
          <div className="mb-8 flex justify-center">
            <button
              type="button"
              onClick={onEditRsvp}
              className="rounded px-4 py-3 text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border-gold)",
              }}
            >
              Edit RSVP
            </button>
          </div>
        )}

        <p
          className="text-center text-xs font-light"
          style={{ color: "var(--color-text-dim)" }}
        >
          Exact timings will be confirmed closer to the date. All events at{" "}
          <a
            href="https://maps.google.com/?q=InterContinental+Boston"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            style={{ color: "var(--color-text-dim)" }}
          >
            InterContinental Boston
          </a>{" "}
          unless noted.
        </p>
      </div>
    </section>
  );
}
