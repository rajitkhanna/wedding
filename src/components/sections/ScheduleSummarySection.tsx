"use client";

import { useState } from "react";
import Link from "next/link";
import { db } from "@/lib/instant/db";

type InviteeShape = { id: string; name: string; sortOrder: number; attendingEvents?: Array<{ id: string }> };
type EventShape = { id: string; title: string; day: string; startTime: string; endTime?: string; location?: string; sortOrder: number };

function dayLabel(day: string) {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function TabbedSchedule({
  days,
  byDay,
  attendeesByEvent,
  isSingle,
}: {
  days: string[];
  byDay: Record<string, EventShape[]>;
  attendeesByEvent: Record<string, string[]>;
  isSingle: boolean;
}) {
  const [activeDay, setActiveDay] = useState(days[0] ?? "");

  if (!days.length) return null;

  const activeEvents = byDay[activeDay] ?? [];

  return (
    <div>
      {/* Day tabs */}
      <div
        className="mb-6 flex gap-1 rounded-lg p-1"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        {days.map((day) => {
          const active = day === activeDay;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              className="flex-1 rounded py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-200"
              style={{
                backgroundColor: active ? "var(--color-gold)" : "transparent",
                color: active ? "var(--color-bg)" : "var(--color-text-muted)",
                fontWeight: active ? 500 : 400,
              }}
            >
              {dayLabel(day)}
            </button>
          );
        })}
      </div>

      {/* Events for active day */}
      <div className="flex flex-col gap-3">
        {activeEvents.map((event) => {
          const names = attendeesByEvent[event.id] ?? [];
          return (
            <div
              key={event.id}
              className="rounded-lg overflow-hidden"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderLeft: "4px solid var(--color-gold)",
              }}
            >
              <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p
                    className="leading-snug"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-xl)",
                      color: "var(--color-text)",
                      fontWeight: 400,
                    }}
                  >
                    {event.title}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {event.startTime}
                    {event.endTime && <> &ndash; {event.endTime}</>}
                  </p>
                  {event.location && (
                    <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-dim)" }}>
                      {event.location}
                    </p>
                  )}
                </div>
                {!isSingle && names.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {names.map((name) => (
                      <span
                        key={name}
                        className="rounded-full px-3 py-1 text-xs"
                        style={{
                          backgroundColor: "var(--color-gold-dim)",
                          color: "var(--color-surface)",
                          border: "none",
                        }}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionHeader() {
  return (
    <header className="mb-12 text-center">
      <p
        className="mb-3 text-xs tracking-[0.3em] uppercase"
        style={{ color: "var(--color-text-muted)" }}
      >
        Your Weekend
      </p>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-gold)",
          fontSize: "var(--text-3xl)",
          fontWeight: 400,
          letterSpacing: "var(--ls-wide)",
        }}
      >
        Schedule
      </h2>
      <div className="mx-auto mt-5 h-px w-24" style={{ backgroundColor: "var(--color-border-gold)" }} />
    </header>
  );
}

export function ScheduleSummarySection() {
  const { user } = db.useAuth();

  const { isLoading, data } = db.useQuery(
    user
      ? {
          guests: {
            invitees: { attendingEvents: {} },
            invitedEvents: {},
            $: { where: { email: user.email! } },
          },
        }
      : null,
  );

  if (!user || isLoading || !data?.guests?.[0]) return null;

  const guest = data.guests[0];

  const invitees = [...(guest.invitees ?? [])].sort(
    (a: InviteeShape, b: InviteeShape) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  ) as InviteeShape[];

  const events = [...(guest.invitedEvents ?? [])].sort(
    (a: EventShape, b: EventShape) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  ) as EventShape[];

  const hasRsvpd = Boolean(guest.rsvpStatus);
  const declinedAll = hasRsvpd && invitees.every((inv) => (inv.attendingEvents ?? []).length === 0);

  if (!hasRsvpd) {
    return (
      <section
        id="schedule"
        className="w-full py-24 px-6"
        style={{ scrollMarginTop: "64px", backgroundColor: "var(--color-bg)" }}
      >
        <div className="mx-auto max-w-2xl">
          <SectionHeader />
          <div
            className="rounded-lg px-8 py-14 text-center"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <div
              className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-surface-alt)", border: "1px solid var(--color-border-gold)" }}
            >
              <svg width="18" height="20" viewBox="0 0 18 22" fill="none" style={{ color: "var(--color-gold-dim)" }}>
                <rect x="1" y="9" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 9V6a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p
              className="mb-1 text-sm"
              style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", color: "var(--color-text)", fontWeight: 400 }}
            >
              Your schedule awaits
            </p>
            <p className="mb-8 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              RSVP to see the full weekend at a glance.
            </p>
            <Link
              href="/rsvp" onClick={() => sessionStorage.setItem("rsvp-intent", String(Date.now()))}
              className="inline-block rounded px-8 py-3 text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--color-gold)", color: "var(--color-bg)" }}
            >
              RSVP Now
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (declinedAll) {
    return (
      <section
        id="schedule"
        className="w-full py-24 px-6"
        style={{ scrollMarginTop: "64px", backgroundColor: "var(--color-bg)" }}
      >
        <div className="mx-auto max-w-2xl">
          <SectionHeader />
          <div
            className="rounded-lg px-8 py-14 text-center"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <p
              className="mb-3"
              style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", color: "var(--color-gold)", fontWeight: 400 }}
            >
              We&apos;ll miss you
            </p>
            <p className="mb-6 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Thank you for letting us know. You will always be with us in spirit.
            </p>
            <div className="mx-auto h-px w-16" style={{ backgroundColor: "var(--color-border-gold)" }} />
            <p className="mt-6 text-xs" style={{ color: "var(--color-text-dim)" }}>
              Changed your mind?{" "}
              <Link
                href="/rsvp" onClick={() => sessionStorage.setItem("rsvp-intent", String(Date.now()))}
                style={{ color: "var(--color-gold-dim)", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                Update your RSVP
              </Link>
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Build attending invitee names per event
  const attendeesByEvent: Record<string, string[]> = {};
  for (const ev of events) {
    attendeesByEvent[ev.id] = invitees
      .filter((inv) => (inv.attendingEvents ?? []).some((ae) => ae.id === ev.id))
      .map((inv) => inv.name);
  }

  // Group by day, only include events with at least one attendee
  const byDay = events.reduce<Record<string, EventShape[]>>((acc, ev) => {
    if ((attendeesByEvent[ev.id] ?? []).length === 0) return acc;
    if (!acc[ev.day]) acc[ev.day] = [];
    acc[ev.day].push(ev);
    return acc;
  }, {});

  const days = Object.keys(byDay);

  return (
    <section
      id="schedule"
      className="w-full py-24 px-6"
      style={{ scrollMarginTop: "64px", backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-2xl">
        <SectionHeader />
        <TabbedSchedule
          days={days}
          byDay={byDay}
          attendeesByEvent={attendeesByEvent}
          isSingle={invitees.length === 1}
        />
        <p className="mt-8 text-center text-xs" style={{ color: "var(--color-text-dim)" }}>
          Need to make changes?{" "}
          <Link
            href="/rsvp" onClick={() => sessionStorage.setItem("rsvp-intent", String(Date.now()))}
            style={{ color: "var(--color-gold-dim)", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            Update your RSVP
          </Link>
        </p>
      </div>
    </section>
  );
}
