"use client";

import { useState } from "react";
import { db } from "@/lib/instant/db";
import { DayTabs, type DayKey } from "@/components/schedule/DayTabs";
import { EventCard } from "@/components/schedule/EventCard";
import { SectionBanner } from "@/components/SectionBanner";

const VISIBLE_GROUPS: Record<string, string[]> = {
  "wedding-party": ["all", "family", "wedding-party"],
  family: ["all", "family"],
  general: ["all"],
  admin: ["all", "family", "wedding-party"],
};

const DAY_FULL_LABELS: Record<DayKey, string> = {
  friday: "Friday, November 27",
  saturday: "Saturday, November 28",
  sunday: "Sunday, November 29",
};

export function ScheduleSection() {
  const [activeDay, setActiveDay] = useState<DayKey>("friday");

  const { user } = db.useAuth();

  const { isLoading: guestLoading, data: guestData } = db.useQuery(
    user ? { guests: { $: { where: { email: user.email! } } } } : null,
  );

  const guest = guestData?.guests?.[0];
  const scheduleGroup: string = guest?.scheduleGroup ?? "general";
  const visibleGroups = VISIBLE_GROUPS[scheduleGroup] ?? ["all"];

  const {
    isLoading: eventsLoading,
    error: eventsError,
    data: eventsData,
  } = db.useQuery(user ? { scheduleEvents: {} } : null);

  const allEvents = eventsData?.scheduleEvents ?? [];
  const guestEvents = allEvents.filter((e) =>
    visibleGroups.includes(e.group ?? "all"),
  );

  const byDay = (["friday", "saturday", "sunday"] as DayKey[]).reduce<
    Record<DayKey, typeof guestEvents>
  >(
    (acc, day) => {
      acc[day] = guestEvents
        .filter((e) => e.day === day)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      return acc;
    },
    {} as Record<DayKey, typeof guestEvents>,
  );

  const eventCounts = {
    friday: byDay.friday.length,
    saturday: byDay.saturday.length,
    sunday: byDay.sunday.length,
  };

  const activeDayEvents = byDay[activeDay];
  const guestName = guest?.name ?? user?.email ?? "Guest";

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

        {eventsLoading ? (
          <p
            className="text-sm text-center py-12"
            style={{ color: "var(--color-text-muted)" }}
          >
            Loading events…
          </p>
        ) : eventsError ? (
          <p
            className="text-sm text-center py-12"
            style={{ color: "var(--color-text-muted)" }}
          >
            Could not load schedule. Please refresh.
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
      </div>
    </section>
  );
}
