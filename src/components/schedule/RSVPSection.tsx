"use client";

import { useState } from "react";
import { lookup } from "@instantdb/react";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/lib/instant/db";
import { RSVP_DEADLINE_DISPLAY } from "@/lib/rsvp/rsvpDeadline";

type MealPref = "veg" | "non-veg" | "vegan" | "pescatarian" | "";

export interface PartyMember {
  name: string;
  eventIds: string[];
  meal: MealPref;
  dietary: string;
}

interface ScheduleEvent {
  id: string;
  title: string;
  day: string;
  startTime: string;
  location?: string;
  group: string;
}

interface RSVPSectionProps {
  guest: {
    id: string;
    email: string;
    name?: string;
    rsvpStatus?: string;
    mealPreference?: string;
    dietaryRestrictions?: string;
    partySize?: number;
    attendingEventIds?: string;
    partyMembers?: string;
  };
  visibleEvents: ScheduleEvent[];
  /** Called after RSVP is saved successfully (e.g. close modal). */
  onSubmitted?: () => void;
  /** Called when the user jumps from the RSVP summary to the schedule view. */
  onScheduleClick?: () => void;
  /** When true, open directly into the editable form instead of the summary view. */
  startEditing?: boolean;
  /** When true (e.g. after public RSVP deadline), editing and submit are disabled. */
  rsvpLocked?: boolean;
}

const DAY_LABEL: Record<string, string> = {
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

type SubmitState = "idle" | "submitting" | "success" | "error";

function parseMembers(raw: string | undefined, guestName: string | undefined): PartyMember[] {
  if (!raw) {
    return [{ name: guestName ?? "You", eventIds: [], meal: "", dietary: "" }];
  }
  try {
    const parsed = JSON.parse(raw) as Partial<PartyMember>[];
    return parsed.map((m) => ({
      name: m.name ?? "Guest",
      eventIds: m.eventIds ?? [],
      meal: (m.meal as MealPref) ?? "",
      dietary: m.dietary ?? "",
    }));
  } catch {
    return [{ name: guestName ?? "You", eventIds: [], meal: "", dietary: "" }];
  }
}

function buildEventCounts(events: ScheduleEvent[], members: PartyMember[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const event of events) counts[event.id] = 0;
  for (const member of members) {
    for (const eventId of member.eventIds) {
      if (eventId in counts) counts[eventId] += 1;
    }
  }
  return counts;
}

function applyEventCountsToMembers(
  members: PartyMember[],
  eventCounts: Record<string, number>,
): PartyMember[] {
  return members.map((member, memberIdx) => {
    const nextEventIds = Object.entries(eventCounts)
      .filter(([, count]) => count > memberIdx)
      .map(([eventId]) => eventId);
    return { ...member, eventIds: nextEventIds };
  });
}

export function RSVPSection({
  guest,
  visibleEvents,
  onSubmitted,
  onScheduleClick,
  startEditing = false,
  rsvpLocked = false,
}: RSVPSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const alreadyRSVPd = !!guest.rsvpStatus;
  const [editing, setEditing] = useState(
    () => (!alreadyRSVPd || startEditing) && !rsvpLocked,
  );

  const initialMembers = parseMembers(guest.partyMembers, guest.name);
  // If already RSVP'd, members already have their eventIds/meal from DB
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "not-attending" | "">(
    (guest.rsvpStatus as "attending" | "not-attending") || ""
  );
  const [members] = useState<PartyMember[]>(
    initialMembers.map((m) => ({
      ...m,
      eventIds: m.eventIds.length > 0 ? m.eventIds : visibleEvents.map((e) => e.id),
    }))
  );
  const [eventCounts, setEventCounts] = useState<Record<string, number>>(() =>
    buildEventCounts(
      visibleEvents,
      initialMembers.map((m) => ({
        ...m,
        eventIds: m.eventIds.length > 0 ? m.eventIds : visibleEvents.map((e) => e.id),
      })),
    ),
  );
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isEditing = editing && !rsvpLocked;

  const attending = rsvpStatus === "attending";

  function updateEventCount(eventId: string, count: number) {
    setEventCounts((prev) => ({ ...prev, [eventId]: count }));
  }

  function handleScheduleNavigation() {
    onScheduleClick?.();

    if (pathname === "/") {
      document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", "/");
      return;
    }

    window.sessionStorage.setItem("scroll-to-schedule", "true");
    router.push("/");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rsvpLocked) return;
    if (!rsvpStatus) return;

    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const membersWithEvents = applyEventCountsToMembers(members, eventCounts);
      const membersToSave: PartyMember[] = attending
        ? membersWithEvents
        : membersWithEvents.map((m) => ({ ...m, eventIds: [], meal: "", dietary: "" }));

      await db.transact(
        db.tx.guests[lookup("email", guest.email)].merge({
          rsvpStatus,
          partyMembers: JSON.stringify(membersToSave),
          partySize: attending ? membersWithEvents.length : undefined,
          // Keep legacy fields populated from first member for backwards compat
          mealPreference: attending ? membersWithEvents[0]?.meal || undefined : undefined,
          dietaryRestrictions: attending ? membersWithEvents[0]?.dietary || undefined : undefined,
          attendingEventIds: attending
            ? JSON.stringify(
              Object.entries(eventCounts)
                .filter(([, count]) => count > 0)
                .map(([eventId]) => eventId),
            )
            : undefined,
          rsvpSubmittedAt: Date.now(),
        })
      );
      if (onSubmitted) {
        onSubmitted();
        return;
      }
      setSubmitState("success");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
      setSubmitState("error");
    }
  }

  if (rsvpLocked && !alreadyRSVPd) {
    return (
      <div
        className="rounded-lg px-8 py-8 text-center"
        style={{
          background: "var(--color-surface)",
          borderTop: "3px solid var(--color-gold)",
        }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          RSVP closed on {RSVP_DEADLINE_DISPLAY}. If you need help, please contact the couple
          directly.
        </p>
      </div>
    );
  }

  // ── Read-only summary ────────────────────────────────────────────────────────
  if (!isEditing) {
    const savedMembers = parseMembers(guest.partyMembers, guest.name);
    const primaryGuestName = guest.name ?? savedMembers[0]?.name ?? "Guest";
    const partySize = guest.partySize ?? savedMembers.length;
    return (
      <div
        className="rounded-lg px-8 py-8"
        style={{
          background: "var(--color-surface)",
          borderTop: "3px solid var(--color-gold)",
        }}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <h2
            className="text-2xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontWeight: 400,
            }}
          >
            {guest.rsvpStatus === "attending" ? "You're coming! 🎉" : "We'll miss you."}
          </h2>
          {!rsvpLocked ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="shrink-0 rounded px-3 py-1.5 text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
              style={{
                color: "var(--color-text-muted)",
                border: "1px solid var(--color-border)",
              }}
            >
              Edit
            </button>
          ) : null}
        </div>

        {guest.rsvpStatus === "attending" && (
          <div
            className="mb-6 rounded-lg px-5 py-4"
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border-gold)",
            }}
          >
            <p
              className="text-xl leading-relaxed"
              style={{
                color: "var(--color-text)",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
              }}
            >
              {primaryGuestName} - party of {partySize}
            </p>
          </div>
        )}

        {guest.rsvpStatus === "attending" && (
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={handleScheduleNavigation}
              className="inline-flex items-center justify-center rounded px-4 py-3 text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "var(--color-gold)",
                color: "var(--color-bg)",
              }}
            >
              Go To Schedule
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  const isSubmitting = submitState === "submitting";

  // Group events by day for the event grid
  const eventsByDay = visibleEvents.reduce<Record<string, ScheduleEvent[]>>((acc, e) => {
    const day = e.day ?? "other";
    if (!acc[day]) acc[day] = [];
    acc[day].push(e);
    return acc;
  }, {});
  const orderedDays = ["friday", "saturday", "sunday"].filter((d) => eventsByDay[d]?.length);

  const isSingleMember = members.length === 1;

  return (
    <div
      className="rounded-lg px-8 py-10"
      style={{
        background: "var(--color-surface)",
        borderTop: "3px solid var(--color-gold)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
      }}
    >
      <h2
        className="mb-6 text-2xl"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-gold)",
          fontWeight: 400,
        }}
      >
        RSVP
        {!isSingleMember && (
          <span
            className="ml-3 text-sm font-light tracking-widest uppercase"
            style={{ color: "var(--color-text-muted)", fontFamily: "inherit" }}
          >
            {members.length} guests
          </span>
        )}
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* ── Attendance ──────────────────────────────────────────────── */}
        <div className="mb-6">
          <fieldset>
            <legend className="rsvp-label">
              Will {isSingleMember ? "you" : "your party"} be attending?
            </legend>
            <div className="mt-2 flex flex-col gap-3">
              {(
                [
                  { value: "attending", label: "Joyfully accept" },
                  { value: "not-attending", label: "Regretfully decline" },
                ] as const
              ).map(({ value, label }) => (
                <label key={value} className="rsvp-radio-label">
                  <input
                    type="radio"
                    name="rsvpStatus"
                    value={value}
                    checked={rsvpStatus === value}
                    onChange={() => setRsvpStatus(value)}
                    className="rsvp-radio"
                    disabled={isSubmitting}
                  />
                  <span className="rsvp-radio-custom" aria-hidden="true" />
                  <span style={{ color: "var(--color-text)" }}>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {attending && (
          <>
            <hr className="gold-rule my-6" />

            {/* ── Event attendance per member ────────────────────────── */}
            {visibleEvents.length > 0 && (
              <div className="mb-8">
                <p className="rsvp-label mb-4">
                  {isSingleMember
                    ? "Which events will you attend?"
                    : "How many guests from your party will attend each event?"}
                </p>

                <div className="flex flex-col gap-5">
                  {orderedDays.map((day) => (
                    <div key={day}>
                      <p
                        className="text-xs tracking-widest uppercase mb-3"
                        style={{ color: "var(--color-gold-dim)" }}
                      >
                        {DAY_LABEL[day] ?? day}
                      </p>
                      <div className="flex flex-col gap-3">
                        {eventsByDay[day].map((event) => (
                          <div
                            key={event.id}
                            className="rounded-lg px-5 py-4"
                            style={{
                              backgroundColor: "var(--color-bg)",
                              border: "1px solid var(--color-border)",
                            }}
                          >
                            <p
                              className="text-sm font-medium mb-3"
                              style={{ color: "var(--color-text)" }}
                            >
                              {event.title}
                              {event.startTime && (
                                <span
                                  className="ml-2 font-light text-xs"
                                  style={{ color: "var(--color-text-muted)" }}
                                >
                                  · {event.startTime}
                                </span>
                              )}
                            </p>

                            <div className="flex items-center gap-3">
                              <label
                                htmlFor={`event-count-${event.id}`}
                                className="text-xs tracking-widest uppercase"
                                style={{ color: "var(--color-text-muted)" }}
                              >
                                {isSingleMember ? "Attending" : "Guest count"}
                              </label>
                              <div className="rsvp-select-wrapper w-28">
                                <select
                                  id={`event-count-${event.id}`}
                                  value={eventCounts[event.id] ?? 0}
                                  onChange={(e) =>
                                    updateEventCount(event.id, Number(e.target.value))
                                  }
                                  className="rsvp-select"
                                  disabled={isSubmitting}
                                >
                                  {Array.from({ length: members.length + 1 }, (_, idx) => (
                                    <option key={idx} value={idx}>
                                      {idx}
                                    </option>
                                  ))}
                                </select>
                                <span className="rsvp-select-arrow" aria-hidden="true">▾</span>
                              </div>
                              {!isSingleMember && (
                                <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                                  of {members.length}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr className="gold-rule my-6" />
          </>
        )}

        {/* ── Error ─────────────────────────────────────────────────── */}
        {submitState === "error" && errorMessage && (
          <p
            className="mb-5 rounded px-4 py-3 text-sm"
            style={{
              background: "rgba(139, 26, 26, 0.18)",
              border: "1px solid var(--color-red)",
              color: "var(--color-text)",
            }}
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {/* ── Actions ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting || !rsvpStatus}
            className="rsvp-submit-btn"
            style={{ marginTop: 0, maxWidth: "12rem" }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="rsvp-spinner" aria-hidden="true" />
                Saving…
              </span>
            ) : (
              "Save RSVP"
            )}
          </button>
          {alreadyRSVPd && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: "var(--color-text-muted)" }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
