"use client";

import { useEffect, useState } from "react";
import { lookup } from "@instantdb/react";
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
  /** When true (e.g. after public RSVP deadline), editing and submit are disabled. */
  rsvpLocked?: boolean;
}

const DAY_LABEL: Record<string, string> = {
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const MEAL_OPTIONS: { value: MealPref; label: string }[] = [
  { value: "", label: "Select…" },
  { value: "veg", label: "Vegetarian" },
  { value: "non-veg", label: "Non-Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "pescatarian", label: "Pescatarian" },
];

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

export function RSVPSection({ guest, visibleEvents, onSubmitted, rsvpLocked = false }: RSVPSectionProps) {
  const alreadyRSVPd = !!guest.rsvpStatus;
  const [editing, setEditing] = useState(() => !alreadyRSVPd && !rsvpLocked);

  const initialMembers = parseMembers(guest.partyMembers, guest.name);
  // If already RSVP'd, members already have their eventIds/meal from DB
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "not-attending" | "">(
    (guest.rsvpStatus as "attending" | "not-attending") || ""
  );
  const [members, setMembers] = useState<PartyMember[]>(
    initialMembers.map((m) => ({
      ...m,
      eventIds: m.eventIds.length > 0 ? m.eventIds : visibleEvents.map((e) => e.id),
    }))
  );
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (rsvpLocked) setEditing(false);
  }, [rsvpLocked]);

  const attending = rsvpStatus === "attending";

  function updateMemberEvent(memberIdx: number, eventId: string, checked: boolean) {
    setMembers((prev) =>
      prev.map((m, i) =>
        i !== memberIdx
          ? m
          : {
              ...m,
              eventIds: checked
                ? [...m.eventIds, eventId]
                : m.eventIds.filter((id) => id !== eventId),
            }
      )
    );
  }

  function updateMemberMeal(memberIdx: number, meal: MealPref) {
    setMembers((prev) =>
      prev.map((m, i) => (i !== memberIdx ? m : { ...m, meal }))
    );
  }

  function updateMemberDietary(memberIdx: number, dietary: string) {
    setMembers((prev) =>
      prev.map((m, i) => (i !== memberIdx ? m : { ...m, dietary }))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rsvpLocked) return;
    if (!rsvpStatus) return;

    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const membersToSave: PartyMember[] = attending
        ? members
        : members.map((m) => ({ ...m, eventIds: [], meal: "", dietary: "" }));

      await db.transact(
        db.tx.guests[lookup("email", guest.email)].merge({
          rsvpStatus,
          partyMembers: JSON.stringify(membersToSave),
          partySize: attending ? members.length : undefined,
          // Keep legacy fields populated from first member for backwards compat
          mealPreference: attending ? members[0]?.meal || undefined : undefined,
          dietaryRestrictions: attending ? members[0]?.dietary || undefined : undefined,
          attendingEventIds: attending
            ? JSON.stringify([...new Set(members.flatMap((m) => m.eventIds))])
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
  if (!editing) {
    const savedMembers = parseMembers(guest.partyMembers, guest.name);
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

        {guest.rsvpStatus === "attending" && savedMembers.length > 0 && (
          <div className="flex flex-col gap-4">
            {savedMembers.map((m) => {
              const mEvents = visibleEvents.filter((e) => m.eventIds.includes(e.id));
              return (
                <div
                  key={m.name}
                  className="rounded px-5 py-4"
                  style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)" }}
                >
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--color-text)" }}
                  >
                    {m.name}
                  </p>
                  {mEvents.length > 0 && (
                    <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
                      {mEvents.map((e) => e.title).join(", ")}
                    </p>
                  )}
                  {m.meal && (
                    <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                      {MEAL_OPTIONS.find((o) => o.value === m.meal)?.label ?? m.meal}
                    </p>
                  )}
                </div>
              );
            })}
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
                    : "Which events will each guest attend?"}
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

                            {isSingleMember ? (
                              <label className="rsvp-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={members[0].eventIds.includes(event.id)}
                                  onChange={(e) =>
                                    updateMemberEvent(0, event.id, e.target.checked)
                                  }
                                  className="rsvp-checkbox"
                                  disabled={isSubmitting}
                                />
                                <span className="rsvp-checkbox-custom" aria-hidden="true" />
                                <span style={{ color: "var(--color-text)" }}>
                                  I'll be there
                                </span>
                              </label>
                            ) : (
                              <div className="flex flex-wrap gap-3">
                                {members.map((member, idx) => (
                                  <label
                                    key={member.name}
                                    className="rsvp-checkbox-label"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={member.eventIds.includes(event.id)}
                                      onChange={(e) =>
                                        updateMemberEvent(idx, event.id, e.target.checked)
                                      }
                                      className="rsvp-checkbox"
                                      disabled={isSubmitting}
                                    />
                                    <span className="rsvp-checkbox-custom" aria-hidden="true" />
                                    <span style={{ color: "var(--color-text)" }}>
                                      {member.name}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr className="gold-rule my-6" />

            {/* ── Meal preferences per member ─────────────────────────── */}
            <div className="mb-6">
              <p className="rsvp-label mb-4">
                {isSingleMember ? "Meal preference" : "Meal preferences"}
              </p>

              <div className="flex flex-col gap-5">
                {members.map((member, idx) => (
                  <div key={member.name}>
                    {!isSingleMember && (
                      <p
                        className="text-sm mb-2"
                        style={{ color: "var(--color-text)" }}
                      >
                        {member.name}
                      </p>
                    )}
                    <div className="rsvp-select-wrapper mb-2">
                      <select
                        value={member.meal}
                        onChange={(e) => updateMemberMeal(idx, e.target.value as MealPref)}
                        className="rsvp-select"
                        disabled={isSubmitting}
                      >
                        {MEAL_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <span className="rsvp-select-arrow" aria-hidden="true">▾</span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder={`Dietary restrictions or allergies${isSingleMember ? "" : ` for ${member.name}`} (optional)`}
                      value={member.dietary}
                      onChange={(e) => updateMemberDietary(idx, e.target.value)}
                      className="rsvp-input rsvp-textarea"
                      disabled={isSubmitting}
                      style={{ fontSize: "0.8125rem" }}
                    />
                  </div>
                ))}
              </div>
            </div>
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
