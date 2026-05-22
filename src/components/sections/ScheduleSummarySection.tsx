"use client";

import { useState } from "react";
import Link from "next/link";
import { db } from "@/lib/instant/db";
import { EventFlipCard } from "@/components/schedule/EventFlipCard";
import { DAY_DISPLAY_SHORT } from "@/lib/schedule/dateRange";

const DAY_DATES: Record<string, string> = {
  thursday: "20261126",
  friday: "20261127",
  saturday: "20261128",
  sunday: "20261129",
};

function parseTimeToMins(time: string): number {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  return hours * 60 + mins;
}

function minsToICSTime(totalMins: number): string {
  const h = Math.floor(totalMins / 60) % 24;
  const m = totalMins % 60;
  return String(h).padStart(2, "0") + String(m).padStart(2, "0") + "00";
}

function buildICS(events: EventShape[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Meghana & Rajit//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const event of events) {
    const dateStr = DAY_DATES[event.day.toLowerCase()];
    if (!dateStr) continue;
    const startMins = parseTimeToMins(event.startTime);
    const endMins = event.endTime ? parseTimeToMins(event.endTime) : startMins + 60;
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${event.id}@meghanarajit.wedding`);
    lines.push(`DTSTART:${dateStr}T${minsToICSTime(startMins)}`);
    lines.push(`DTEND:${dateStr}T${minsToICSTime(endMins)}`);
    lines.push(`SUMMARY:${event.title}`);
    if (event.location) lines.push(`LOCATION:${event.location}`);
    if (event.locationUrl) lines.push(`URL:${event.locationUrl}`);
    const descParts: string[] = [];
    if (event.dressCode) descParts.push(`Dress code: ${event.dressCode}`);
    if (event.description) descParts.push(event.description);
    if (descParts.length > 0) lines.push(`DESCRIPTION:${descParts.join("\\n")}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadICS(events: EventShape[]) {
  const blob = new Blob([buildICS(events)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "meghana-rajit-wedding.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

type InviteeShape = { id: string; name: string; sortOrder: number; attendingEvents?: Array<{ id: string }> };
type EventShape = { id: string; title: string; day: string; startTime: string; endTime?: string; location?: string; locationUrl?: string; dressCode?: string; description?: string; informational?: boolean; sortOrder: number };

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
              className="flex-1 rounded py-2 flex flex-col items-center gap-0.5 transition-all duration-200"
              style={{
                backgroundColor: active ? "var(--color-gold)" : "transparent",
                color: active ? "var(--color-bg)" : "var(--color-text-muted)",
                fontWeight: active ? 500 : 400,
              }}
            >
              <span className="text-xs tracking-[0.08em] uppercase sm:tracking-[0.2em]">{dayLabel(day)}</span>
              {DAY_DISPLAY_SHORT[day] && (
                <span className="text-xs tracking-[0.05em]" style={{ opacity: 0.75 }}>
                  {DAY_DISPLAY_SHORT[day]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Events for active day */}
      <div className="flex flex-col gap-3">
        {activeEvents.map((event) => {
          const names = attendeesByEvent[event.id] ?? [];
          return (
            <EventFlipCard
              key={event.id}
              event={event}
              names={names}
              isSingle={isSingle}
            />
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
  const nonInformationalEvents = events.filter((ev) => !ev.informational);
  const declinedAll = hasRsvpd && nonInformationalEvents.length > 0 && invitees.every((inv) => (inv.attendingEvents ?? []).length === 0);

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
              href="/rsvp"              className="inline-block rounded px-8 py-3 text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
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
                href="/rsvp"                style={{ color: "var(--color-gold-dim)", textDecoration: "underline", textUnderlineOffset: "3px" }}
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

  // Group by day: include informational events always, others only if someone is attending
  const byDay = events.reduce<Record<string, EventShape[]>>((acc, ev) => {
    const hasAttendees = (attendeesByEvent[ev.id] ?? []).length > 0;
    if (!ev.informational && !hasAttendees) return acc;
    if (!acc[ev.day]) acc[ev.day] = [];
    acc[ev.day].push(ev);
    return acc;
  }, {});

  const days = Object.keys(byDay);
  const attendingEvents = events.filter(
    (ev) => ev.informational || (attendeesByEvent[ev.id] ?? []).length > 0,
  );

  return (
    <section
      id="schedule"
      className="w-full py-24 px-6"
      style={{ scrollMarginTop: "64px", backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-2xl">
        <SectionHeader />
        {attendingEvents.length > 0 && (
          <div className="mb-8 flex justify-center">
            <button
              type="button"
              onClick={() => downloadICS(attendingEvents)}
              className="flex items-center gap-2 rounded px-5 py-2.5 text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
              style={{
                border: "1px solid var(--color-border-gold)",
                color: "var(--color-gold-dim)",
                backgroundColor: "transparent",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 13h4m-4 4h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Add to Calendar
            </button>
          </div>
        )}
        <TabbedSchedule
          days={days}
          byDay={byDay}
          attendeesByEvent={attendeesByEvent}
          isSingle={invitees.length === 1}
        />
        <p className="mt-6 text-center text-xs" style={{ color: "var(--color-text-dim)" }}>
          Need to make changes?{" "}
          <Link
            href="/rsvp"            style={{ color: "var(--color-gold-dim)", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            Update your RSVP
          </Link>
        </p>
      </div>
    </section>
  );
}
