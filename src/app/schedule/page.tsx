"use client";

import { useState } from "react";
import { db } from "@/lib/instant/db";
import { isRsvpOpen } from "@/lib/rsvp/rsvpDeadline";
import { personalizeScheduleEvents } from "@/lib/schedule/personalizeScheduleEvents";
import { getVisibleGroups } from "@/lib/schedule/visibleGroups";
import { DayTabs, type DayKey } from "@/components/schedule/DayTabs";
import { EventCard } from "@/components/schedule/EventCard";
import { RSVPSection } from "@/components/schedule/RSVPSection";

const DAY_FULL_LABELS: Record<DayKey, string> = {
  friday: "Friday, November 27",
  saturday: "Saturday, November 28",
  sunday: "Sunday, November 29",
};

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState<DayKey>("friday");

  // ── Auth ────────────────────────────────────────────────────────────────────
  const { isLoading: authLoading, user } = db.useAuth();

  // ── Guest record (for name + scheduleGroup) ─────────────────────────────────
  const { isLoading: guestLoading, data: guestData } = db.useQuery(
    user
      ? { guests: { $: { where: { email: user.email! } }, invitees: {} } }
      : null,
  );

  const guest = guestData?.guests?.[0];
  const scheduleGroup: string = guest?.scheduleGroup ?? "general";
  const visibleGroups = getVisibleGroups(scheduleGroup);

  // ── Events ──────────────────────────────────────────────────────────────────
  const {
    isLoading: eventsLoading,
    error: eventsError,
    data: eventsData,
  } = db.useQuery(user ? { scheduleEvents: {} } : null);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <p
          className="text-sm tracking-widest uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          Loading…
        </p>
      </div>
    );
  }

  if (!user) return null;

  // ── Error ───────────────────────────────────────────────────────────────────
  if (eventsError) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-6"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <p
          className="text-sm text-center"
          style={{ color: "var(--color-text-muted)" }}
        >
          Could not load schedule. Please refresh and try again.
        </p>
      </div>
    );
  }

  // ── Authenticated ───────────────────────────────────────────────────────────
  const allEvents = eventsData?.scheduleEvents ?? [];

  const tierEvents = allEvents.filter((e) =>
    visibleGroups.includes(e.group ?? "all"),
  );

  const displayEvents = personalizeScheduleEvents(allEvents, guest);

  // Group by day (personalized itinerary)
  const byDay = (["friday", "saturday", "sunday"] as DayKey[]).reduce<
    Record<DayKey, typeof displayEvents>
  >(
    (acc, day) => {
      acc[day] = displayEvents
        .filter((e) => e.day === day)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      return acc;
    },
    {} as Record<DayKey, typeof displayEvents>,
  );

  const eventCounts = {
    friday: byDay.friday.length,
    saturday: byDay.saturday.length,
    sunday: byDay.sunday.length,
  };

  const activeDayEvents = byDay[activeDay];
  const guestName = guest?.name ?? user.email ?? "Guest";

  async function handleSignOut() {
    await db.auth.signOut();
  }

  return (
    <div
      className="min-h-screen w-full pb-24"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-2xl px-5 pt-24">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="mb-12 text-center">
          <p
            className="mb-3 text-xs tracking-[0.3em] uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            November 27 – 29, 2026
          </p>
          <h1
            className="text-5xl md:text-6xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontWeight: 400,
            }}
          >
            Schedule
          </h1>
          <div
            className="mx-auto mt-5 h-px w-24"
            style={{ backgroundColor: "var(--color-border-gold)" }}
          />
          {(guestLoading || guest) && (
            <p
              className="mt-5 text-sm font-light"
              style={{ color: "var(--color-text-muted)" }}
            >
              {guestLoading
                ? "Loading your schedule…"
                : `Welcome, ${guestName}! Here's your weekend.`}
            </p>
          )}
        </header>

        {/* ── Day tabs ───────────────────────────────────────────────────── */}
        <div className="mb-8">
          <DayTabs
            activeDay={activeDay}
            onChange={setActiveDay}
            eventCounts={eventCounts}
          />
        </div>

        {/* ── Day label ──────────────────────────────────────────────────── */}
        <div className="mb-6 flex items-center gap-4">
          <h2
            className="text-2xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontWeight: 400,
            }}
          >
            {DAY_FULL_LABELS[activeDay]}
          </h2>
        </div>

        {/* ── Events ─────────────────────────────────────────────────────── */}
        {eventsLoading ? (
          <p
            className="text-sm text-center py-12"
            style={{ color: "var(--color-text-muted)" }}
          >
            Loading events…
          </p>
        ) : activeDayEvents.length === 0 ? (
          <div
            className="rounded-lg px-6 py-12 text-center"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              No events scheduled for this day.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activeDayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* ── RSVP ───────────────────────────────────────────────────────── */}
        {!guestLoading && guest && (
          <>
            <div
              className="mx-auto mt-16 mb-10 h-px w-24"
              style={{ backgroundColor: "var(--color-border-gold)" }}
            />
            <RSVPSection
              rsvpLocked={!isRsvpOpen()}
              guest={{
                id: guest.id as string,
                email: guest.email as string,
                name: guest.name as string | undefined,
                rsvpStatus: guest.rsvpStatus as string | undefined,
                invitees: (guest.invitees ?? []).map((inv) => ({
                  id: inv.id as string,
                  name: inv.name as string,
                  sortOrder: inv.sortOrder as number,
                  meal: inv.meal as string | undefined,
                  dietary: inv.dietary as string | undefined,
                  attendingEventIds: inv.attendingEventIds as string | undefined,
                })),
                invitedEvents: tierEvents.map((e) => ({
                  id: e.id,
                  title: e.title as string,
                  day: e.day as string,
                  startTime: e.startTime as string,
                  location: e.location as string | undefined,
                  group: e.group as string,
                })),
              }}
            />
          </>
        )}

        {/* ── Footer rule ────────────────────────────────────────────────── */}
        <div
          className="mx-auto mt-16 mb-6 h-px w-24"
          style={{ backgroundColor: "var(--color-border-gold)" }}
        />
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

        {/* ── Sign out ───────────────────────────────────────────────────── */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSignOut}
            className="rounded px-4 py-2 text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
            style={{
              color: "var(--color-text-muted)",
              border: "1px solid var(--color-border)",
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
