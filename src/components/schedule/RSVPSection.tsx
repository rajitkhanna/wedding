"use client";

import { useState } from "react";
import { lookup } from "@instantdb/react";
import { db } from "@/lib/instant/db";

type MealPref = "veg" | "non-veg" | "vegan" | "pescatarian";

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
  };
  visibleEvents: ScheduleEvent[];
}

const DAY_LABEL: Record<string, string> = {
  friday: "Fri 11/28",
  saturday: "Sat 11/29",
  sunday: "Sun 11/30",
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export function RSVPSection({ guest, visibleEvents }: RSVPSectionProps) {
  const alreadyRSVPd = !!guest.rsvpStatus;
  const [editing, setEditing] = useState(!alreadyRSVPd);

  // Parse existing attendingEventIds
  const existingEventIds: string[] = (() => {
    try {
      return guest.attendingEventIds ? JSON.parse(guest.attendingEventIds) : [];
    } catch {
      return [];
    }
  })();

  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "not-attending" | "">(
    (guest.rsvpStatus as "attending" | "not-attending") || ""
  );
  const [partySize, setPartySize] = useState<number>(guest.partySize ?? 1);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(
    existingEventIds.length > 0
      ? existingEventIds
      : visibleEvents.map((e) => e.id)
  );
  const [mealPref, setMealPref] = useState<MealPref | "">(
    (guest.mealPreference as MealPref) || ""
  );
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    guest.dietaryRestrictions ?? ""
  );
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const attending = rsvpStatus === "attending";

  function toggleEvent(id: string) {
    setSelectedEventIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rsvpStatus) return;

    setSubmitState("submitting");
    setErrorMessage("");

    try {
      await db.transact(
        db.tx.guests[lookup("email", guest.email)].merge({
          rsvpStatus,
          mealPreference: attending ? mealPref || undefined : undefined,
          dietaryRestrictions: attending ? dietaryRestrictions || undefined : undefined,
          partySize: attending ? partySize : undefined,
          attendingEventIds: attending
            ? JSON.stringify(selectedEventIds)
            : undefined,
          rsvpSubmittedAt: Date.now(),
        })
      );
      setSubmitState("success");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
      setSubmitState("error");
    }
  }

  // ── Read-only summary ────────────────────────────────────────────────────────
  if (!editing) {
    const attendingEvents = visibleEvents.filter((e) =>
      existingEventIds.includes(e.id)
    );
    return (
      <div
        className="rounded-lg px-8 py-8"
        style={{
          background: "var(--color-surface)",
          borderTop: "3px solid var(--color-gold)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
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
            {guest.rsvpStatus === "attending" && (
              <div className="mt-4 flex flex-col gap-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
                <p>
                  <span style={{ color: "var(--color-text)" }}>Party size:</span>{" "}
                  {guest.partySize ?? 1}{" "}
                  {(guest.partySize ?? 1) === 1 ? "person" : "people"}
                </p>
                {attendingEvents.length > 0 && (
                  <p>
                    <span style={{ color: "var(--color-text)" }}>Events:</span>{" "}
                    {attendingEvents.map((e) => e.title).join(", ")}
                  </p>
                )}
                {guest.mealPreference && (
                  <p>
                    <span style={{ color: "var(--color-text)" }}>Meal:</span>{" "}
                    {guest.mealPreference}
                  </p>
                )}
              </div>
            )}
          </div>
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
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  const isSubmitting = submitState === "submitting";

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
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* ── Attendance ──────────────────────────────────────────────── */}
        <div className="mb-6">
          <fieldset>
            <legend className="rsvp-label">Will you be attending?</legend>
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

            {/* ── Party size ──────────────────────────────────────────── */}
            <div className="mb-6">
              <label className="rsvp-label" htmlFor="rsvp-party-size">
                How many people from your party are attending?
              </label>
              <input
                id="rsvp-party-size"
                type="number"
                min={1}
                max={10}
                value={partySize}
                onChange={(e) => setPartySize(Math.max(1, parseInt(e.target.value) || 1))}
                className="rsvp-input"
                style={{ maxWidth: "6rem" }}
                disabled={isSubmitting}
              />
            </div>

            {/* ── Events ──────────────────────────────────────────────── */}
            {visibleEvents.length > 0 && (
              <div className="mb-6">
                <fieldset>
                  <legend className="rsvp-label">Which events will you be joining us for?</legend>
                  <div className="mt-3 flex flex-col gap-3">
                    {visibleEvents.map((event) => (
                      <label key={event.id} className="rsvp-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedEventIds.includes(event.id)}
                          onChange={() => toggleEvent(event.id)}
                          className="rsvp-checkbox"
                          disabled={isSubmitting}
                        />
                        <span className="rsvp-checkbox-custom" aria-hidden="true" />
                        <span style={{ color: "var(--color-text)" }}>
                          {event.title}
                          <span
                            className="ml-2 text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {DAY_LABEL[event.day] ?? event.day}
                            {event.startTime ? ` · ${event.startTime}` : ""}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {/* ── Meal preference ─────────────────────────────────────── */}
            <div className="mb-6">
              <label className="rsvp-label" htmlFor="rsvp-meal">
                Meal Preference
              </label>
              <div className="rsvp-select-wrapper">
                <select
                  id="rsvp-meal"
                  value={mealPref}
                  onChange={(e) => setMealPref(e.target.value as MealPref)}
                  className="rsvp-select"
                  disabled={isSubmitting}
                >
                  <option value="">Select a preference</option>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="pescatarian">Pescatarian</option>
                </select>
                <span className="rsvp-select-arrow" aria-hidden="true">▾</span>
              </div>
            </div>

            {/* ── Dietary restrictions ─────────────────────────────────── */}
            <div className="mb-6">
              <label className="rsvp-label" htmlFor="rsvp-diet">
                Dietary Restrictions{" "}
                <span style={{ color: "var(--color-text-dim)", fontWeight: 300 }}>
                  (optional)
                </span>
              </label>
              <textarea
                id="rsvp-diet"
                rows={3}
                placeholder="Allergies, intolerances, or other notes…"
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                className="rsvp-input rsvp-textarea"
                disabled={isSubmitting}
              />
            </div>
          </>
        )}

        {/* ── Error ───────────────────────────────────────────────────── */}
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

        {/* ── Actions ─────────────────────────────────────────────────── */}
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
