"use client";

import { useState } from "react";
import Link from "next/link";
import { db } from "@/lib/instant/db";
import { EventFlipCard } from "@/components/schedule/EventFlipCard";
import { buildDateRange } from "@/lib/schedule/dateRange";
import { HIDDEN_EVENT_IDS } from "@/lib/schedule/hiddenEvents";
import {
  isRsvpOpen,
  RSVP_DEADLINE_DISPLAY,
  RSVP_CONTACT_EMAILS,
} from "@/lib/rsvp/rsvpDeadline";

function ContactLinks() {
  const linkStyle = {
    color: "var(--color-gold-dim)",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  } as const;
  return (
    <>
      {RSVP_CONTACT_EMAILS.map((email, i) => (
        <span key={email}>
          {i > 0 && " or "}
          <a href={`mailto:${email}`} style={linkStyle}>
            {email}
          </a>
        </span>
      ))}
    </>
  );
}

const DAY_ORDER = ["thursday", "friday", "saturday", "sunday"];

const DAY_DATES: Record<string, string> = {
  thursday: "20261126",
  friday: "20261127",
  saturday: "20261128",
  sunday: "20261129",
};

/** Day number + month for the day rail, e.g. { day: "27", month: "Nov" }. */
const DAY_PARTS: Record<string, { day: string; month: string }> = {
  thursday: { day: "26", month: "Nov" },
  friday: { day: "27", month: "Nov" },
  saturday: { day: "28", month: "Nov" },
  sunday: { day: "29", month: "Nov" },
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
    const endMins = event.endTime
      ? parseTimeToMins(event.endTime)
      : startMins + 60;
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
    if (descParts.length > 0)
      lines.push(`DESCRIPTION:${descParts.join("\\n")}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadICS(events: EventShape[]) {
  const blob = new Blob([buildICS(events)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "meghana-rajit-wedding.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

type InviteeShape = {
  id: string;
  name: string;
  sortOrder: number;
  attendingEvents?: Array<{ id: string }>;
};
type EventShape = {
  id: string;
  title: string;
  day: string;
  startTime: string;
  endTime?: string;
  location?: string;
  locationUrl?: string;
  dressCode?: string;
  description?: string;
  informational?: boolean;
  sortOrder: number;
};

function dayLabel(day: string) {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function CalendarIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 2v4M16 2v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 13h4m-4 4h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Small coral diamond used as the section's ornament. */
function Diamond() {
  return (
    <span
      aria-hidden
      className="inline-block h-1.5 w-1.5 rotate-45"
      style={{ backgroundColor: "var(--color-gold)" }}
    />
  );
}

function SectionHeader({
  dateRange,
  children,
}: {
  dateRange: string | null;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-12 text-center sm:mb-16">
      <p
        className="mb-3 text-[0.7rem] uppercase"
        style={{ color: "var(--color-text-muted)", letterSpacing: "0.32em" }}
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
          lineHeight: 1.05,
        }}
      >
        Schedule
      </h2>
      {dateRange && (
        <p
          className="mt-4 text-xs uppercase"
          style={{
            color: "var(--color-text-dim)",
            letterSpacing: "0.2em",
          }}
        >
          {dateRange}
          <span aria-hidden className="mx-2.5">
            ·
          </span>
          Boston
        </p>
      )}
      <div className="mt-6 flex items-center justify-center gap-3">
        <span
          className="h-px w-12"
          style={{ backgroundColor: "var(--color-border-gold)" }}
        />
        <Diamond />
        <span
          className="h-px w-12"
          style={{ backgroundColor: "var(--color-border-gold)" }}
        />
      </div>
      {children}
    </header>
  );
}

/** Vertical day picker on desktop, horizontally scrollable strip on mobile. */
function DayRail({
  days,
  activeDay,
  onSelect,
  counts,
}: {
  days: string[];
  activeDay: string;
  onSelect: (day: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="min-w-0 self-start lg:sticky lg:top-24">
      {/* Mobile: compact chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {days.map((day) => {
          const active = day === activeDay;
          const parts = DAY_PARTS[day];
          const count = counts[day] ?? 0;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelect(day)}
              aria-pressed={active}
              className="relative flex min-w-[6.6rem] flex-1 items-baseline gap-2 rounded-[3px] border px-3 py-2.5 text-left transition-all duration-200"
              style={{
                borderColor: active
                  ? "var(--color-border-gold)"
                  : "var(--color-border)",
                backgroundColor: active
                  ? "var(--color-surface)"
                  : "transparent",
              }}
            >
              <span
                aria-hidden
                className="absolute inset-y-1.5 left-0 w-[2px] rounded-full"
                style={{
                  backgroundColor: "var(--color-gold)",
                  opacity: active ? 1 : 0,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.7rem",
                  lineHeight: 1,
                  color: active
                    ? "var(--color-gold)"
                    : "var(--color-text-muted)",
                }}
              >
                {parts?.day ?? "\u2014"}
              </span>
              <span className="flex flex-col gap-0.5">
                <span
                  className="text-[0.62rem] uppercase"
                  style={{
                    color: active
                      ? "var(--color-text)"
                      : "var(--color-text-muted)",
                    letterSpacing: "0.18em",
                  }}
                >
                  {dayLabel(day)}
                </span>
                <span
                  className="whitespace-nowrap text-[0.65rem]"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  {count} {count === 1 ? "event" : "events"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop: editorial date list */}
      <div className="hidden lg:block">
        <p
          className="mb-2 pl-4 text-[0.62rem] uppercase"
          style={{ color: "var(--color-text-dim)", letterSpacing: "0.26em" }}
        >
          Choose a day
        </p>
        <div className="flex flex-col">
          {days.map((day) => {
            const active = day === activeDay;
            const parts = DAY_PARTS[day];
            const count = counts[day] ?? 0;
            return (
              <button
                key={day}
                type="button"
                onClick={() => onSelect(day)}
                aria-pressed={active}
                className="group relative flex items-baseline gap-3.5 py-3.5 pl-4 pr-2 text-left transition-colors duration-200"
                style={{
                  backgroundColor: active
                    ? "var(--color-overlay-soft)"
                    : "transparent",
                }}
              >
                <span
                  aria-hidden
                  className="absolute inset-y-2 left-0 w-[2px] rounded-full transition-opacity"
                  style={{
                    backgroundColor: "var(--color-gold)",
                    opacity: active ? 1 : 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.4rem",
                    lineHeight: 1,
                    color: active
                      ? "var(--color-gold)"
                      : "var(--color-text-muted)",
                    opacity: active ? 1 : 0.7,
                    transition: "opacity 200ms",
                  }}
                >
                  {parts?.day ?? "\u2014"}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span
                    className="text-[0.62rem] uppercase"
                    style={{
                      color: active
                        ? "var(--color-text)"
                        : "var(--color-text-muted)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    {dayLabel(day)}
                  </span>
                  <span
                    className="text-[0.65rem]"
                    style={{ color: "var(--color-text-dim)" }}
                  >
                    {parts?.month ?? ""}
                    <span aria-hidden className="mx-1">
                      ·
                    </span>
                    {count} {count === 1 ? "event" : "events"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p
          className="mt-6 pl-4 text-[0.62rem] uppercase"
          style={{ color: "var(--color-text-dim)", letterSpacing: "0.2em" }}
        >
          All times local
        </p>
      </div>
    </div>
  );
}

function EventTimeline({
  events,
  attendeesByEvent,
  isSingle,
}: {
  events: EventShape[];
  attendeesByEvent: Record<string, string[]>;
  isSingle: boolean;
}) {
  if (!events.length) {
    return (
      <div
        className="rounded-[3px] border px-6 py-10 text-center"
        style={{
          borderColor: "var(--color-border)",
          borderStyle: "dashed",
          backgroundColor: "rgba(253, 244, 232, 0.45)",
        }}
      >
        <p
          className="text-sm"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-lg)",
            color: "var(--color-text-muted)",
          }}
        >
          A quiet day — nothing on the calendar.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Rail */}
      <span
        aria-hidden
        className="absolute top-3 bottom-3 left-[3px] w-px"
        style={{ backgroundColor: "var(--color-border-gold)", opacity: 0.4 }}
      />
      <div className="flex flex-col gap-4">
        {events.map((event, i) => (
          <div
            key={event.id}
            className="schedule-rise relative pl-7 sm:pl-8"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {i < events.length - 1 && (
              <span
                aria-hidden
                className="absolute top-[37px] left-[3px] bottom-[-16px] w-px"
                style={{
                  backgroundColor: "var(--color-border-gold)",
                  opacity: 0.35,
                }}
              />
            )}
            <span
              aria-hidden
              className="absolute top-[30px] left-0 h-[7px] w-[7px] rounded-full"
              style={{
                backgroundColor: "var(--color-gold)",
                boxShadow: "0 0 0 3px var(--color-bg)",
              }}
            />
            <EventFlipCard
              event={event}
              names={attendeesByEvent[event.id] ?? []}
              isSingle={isSingle}
            />
          </div>
        ))}
      </div>
    </div>
  );
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

  const counts = days.reduce<Record<string, number>>((acc, day) => {
    acc[day] = (byDay[day] ?? []).length;
    return acc;
  }, {});

  const activeEvents = byDay[activeDay] ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-12">
      <DayRail
        days={days}
        activeDay={activeDay}
        onSelect={setActiveDay}
        counts={counts}
      />

      <div className="min-w-0">
        <div key={activeDay}>
          <EventTimeline
            events={activeEvents}
            attendeesByEvent={attendeesByEvent}
            isSingle={isSingle}
          />
        </div>
      </div>
    </div>
  );
}

function LockedSchedule({
  rsvpOpen,
  children,
}: {
  rsvpOpen: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[3px] px-8 py-14 text-center"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-gold), transparent)",
          opacity: 0.5,
        }}
      />
      <div
        className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          backgroundColor: "var(--color-surface-alt)",
          border: "1px solid var(--color-border-gold)",
        }}
      >
        <svg
          width="18"
          height="20"
          viewBox="0 0 18 22"
          fill="none"
          aria-hidden
          style={{ color: "var(--color-gold-dim)" }}
        >
          <rect
            x="1"
            y="9"
            width="16"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M5 9V6a4 4 0 0 1 8 0v3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p
        className="mb-1"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xl)",
          color: "var(--color-text)",
          fontWeight: 400,
        }}
      >
        {rsvpOpen ? "Your schedule awaits" : "RSVPs are closed"}
      </p>
      {children}
    </div>
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
    (a: InviteeShape, b: InviteeShape) =>
      (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  ) as InviteeShape[];

  const events = [...(guest.invitedEvents ?? [])]
    .filter((ev: EventShape) => !HIDDEN_EVENT_IDS.has(ev.id))
    .sort(
      (a: EventShape, b: EventShape) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    ) as EventShape[];

  const hasRsvpd = Boolean(guest.rsvpStatus);
  const rsvpOpen = isRsvpOpen();
  const nonInformationalEvents = events.filter((ev) => !ev.informational);
  const declinedAll =
    hasRsvpd &&
    nonInformationalEvents.length > 0 &&
    invitees.every((inv) => (inv.attendingEvents ?? []).length === 0);

  const eventDays = events.map((ev) => ev.day);
  const dateRange = buildDateRange(eventDays);

  if (!hasRsvpd) {
    return (
      <section
        id="schedule"
        className="w-full px-5 py-16 sm:px-6 sm:py-20"
        style={{ scrollMarginTop: "64px" }}
      >
        <div className="mx-auto max-w-2xl">
          <SectionHeader dateRange={dateRange} />
          <LockedSchedule rsvpOpen={rsvpOpen}>
            {rsvpOpen ? (
              <>
                <p
                  className="mb-8 text-sm leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  RSVP to see the full weekend at a glance.
                </p>
                <Link
                  href="/rsvp"
                  className="inline-block rounded px-8 py-3 text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: "var(--color-gold)",
                    color: "var(--color-surface)",
                  }}
                >
                  RSVP Now
                </Link>
              </>
            ) : (
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                Our RSVP window closed on {RSVP_DEADLINE_DISPLAY}. Still hoping
                to join us? Email <ContactLinks /> and we&apos;ll do our best to
                accommodate you.
              </p>
            )}
          </LockedSchedule>
        </div>
      </section>
    );
  }

  if (declinedAll) {
    return (
      <section
        id="schedule"
        className="w-full px-5 py-16 sm:px-6 sm:py-20"
        style={{ scrollMarginTop: "64px" }}
      >
        <div className="mx-auto max-w-2xl">
          <SectionHeader dateRange={dateRange} />
          <LockedSchedule rsvpOpen={rsvpOpen}>
            <p
              className="mb-3"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-2xl)",
                color: "var(--color-gold)",
                fontWeight: 400,
              }}
            >
              We&apos;ll miss you
            </p>
            <p
              className="mb-6 text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              Thank you for letting us know. You will always be with us in
              spirit.
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--color-text-dim)" }}
            >
              {rsvpOpen ? (
                <>
                  Changed your mind?{" "}
                  <Link
                    href="/rsvp"
                    style={{
                      color: "var(--color-gold-dim)",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    Update your RSVP
                  </Link>
                </>
              ) : (
                <>
                  Changed your mind? Email <ContactLinks /> and we&apos;ll see
                  what we can do.
                </>
              )}
            </p>
          </LockedSchedule>
        </div>
      </section>
    );
  }

  // Build attending invitee names per event
  const attendeesByEvent: Record<string, string[]> = {};
  for (const ev of events) {
    attendeesByEvent[ev.id] = invitees
      .filter((inv) =>
        (inv.attendingEvents ?? []).some((ae) => ae.id === ev.id),
      )
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

  const days = DAY_ORDER.filter((day) => (byDay[day] ?? []).length > 0);
  const attendingEvents = events.filter(
    (ev) => ev.informational || (attendeesByEvent[ev.id] ?? []).length > 0,
  );

  return (
    <section
      id="schedule"
      className="w-full px-5 py-16 sm:px-6 sm:py-20"
      style={{ scrollMarginTop: "64px" }}
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeader dateRange={dateRange}>
          {attendingEvents.length > 0 && (
            <button
              type="button"
              onClick={() => downloadICS(attendingEvents)}
              className="mt-7 inline-flex items-center gap-2 rounded-[3px] px-5 py-2.5 text-[0.68rem] uppercase transition-colors hover:opacity-70"
              style={{
                border: "1px solid var(--color-border-gold)",
                color: "var(--color-gold-dim)",
                backgroundColor: "transparent",
                letterSpacing: "0.16em",
              }}
            >
              <CalendarIcon />
              Add to Calendar
            </button>
          )}
        </SectionHeader>

        <TabbedSchedule
          days={days}
          byDay={byDay}
          attendeesByEvent={attendeesByEvent}
          isSingle={invitees.length === 1}
        />

        <p
          className="mt-10 text-center text-xs leading-relaxed"
          style={{ color: "var(--color-text-dim)" }}
        >
          {rsvpOpen ? (
            <>
              Need to make changes?{" "}
              <Link
                href="/rsvp"
                style={{
                  color: "var(--color-gold-dim)",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Update your RSVP
              </Link>
            </>
          ) : (
            <>
              Need to make changes? Email <ContactLinks />.
            </>
          )}
        </p>
      </div>
    </section>
  );
}
