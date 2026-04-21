"use client";

import { useState } from "react";
import { lookup } from "@instantdb/react";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/lib/instant/db";
import { RSVP_DEADLINE_DISPLAY } from "@/lib/rsvp/rsvpDeadline";
import { parseAttendingEventIds } from "@/lib/schedule/personalizeScheduleEvents";

type MealPref = "veg" | "non-veg" | "vegan" | "pescatarian" | "";

export interface GuestInvitee {
  id: string;
  name: string;
  sortOrder: number;
  meal?: string;
  dietary?: string;
  attendingEventIds?: string;
}

export interface InvitedEvent {
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
    invitees: GuestInvitee[];
    invitedEvents: InvitedEvent[];
  };
  onSubmitted?: () => void;
  onScheduleClick?: () => void;
  startEditing?: boolean;
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

function initInviteeEvents(
  invitees: GuestInvitee[],
  invitedEvents: InvitedEvent[],
): Record<string, Set<string>> {
  const state: Record<string, Set<string>> = {};
  for (const inv of invitees) {
    const saved = parseAttendingEventIds(inv.attendingEventIds);
    // Default to attending all invited events if no prior RSVP
    state[inv.id] = new Set(saved ?? invitedEvents.map((e) => e.id));
  }
  return state;
}

export function RSVPSection({
  guest,
  onSubmitted,
  onScheduleClick,
  startEditing = false,
  rsvpLocked = false,
}: RSVPSectionProps) {
  const router = useRouter();
  const pathname = usePathname();

  const invitees = [...guest.invitees].sort((a, b) => a.sortOrder - b.sortOrder);
  const invitedEvents = [...guest.invitedEvents].sort(
    (a, b) => (a as { sortOrder?: number }).sortOrder ?? 0 - ((b as { sortOrder?: number }).sortOrder ?? 0),
  );

  const alreadyRSVPd = !!guest.rsvpStatus;
  const [editing, setEditing] = useState(() => (!alreadyRSVPd || startEditing) && !rsvpLocked);
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "not-attending" | "">(
    (guest.rsvpStatus as "attending" | "not-attending") || "",
  );
  // inviteeEvents: map of invitee.id → Set of eventIds they're attending
  const [inviteeEvents, setInviteeEvents] = useState<Record<string, Set<string>>>(() =>
    initInviteeEvents(invitees, invitedEvents),
  );
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = editing && !rsvpLocked;
  const attending = rsvpStatus === "attending";
  const isSingleMember = invitees.length <= 1;

  function toggleInviteeEvent(inviteeId: string, eventId: string, checked: boolean) {
    setInviteeEvents((prev) => {
      const next = new Set(prev[inviteeId] ?? []);
      if (checked) next.add(eventId);
      else next.delete(eventId);
      return { ...prev, [inviteeId]: next };
    });
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
    if (rsvpLocked || !rsvpStatus) return;

    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const inviteeTxns = invitees.map((inv) => {
        const eventIds = attending ? [...(inviteeEvents[inv.id] ?? [])] : [];
        return db.tx.invitees[inv.id].merge({
          attendingEventIds: JSON.stringify(eventIds),
        });
      });

      await db.transact([
        db.tx.guests[lookup("email", guest.email)].merge({
          rsvpStatus,
          rsvpSubmittedAt: Date.now(),
        }),
        ...inviteeTxns,
      ]);

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
        style={{ background: "var(--color-surface)", borderTop: "3px solid var(--color-gold)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          RSVP closed on {RSVP_DEADLINE_DISPLAY}. If you need help, please contact the couple
          directly.
        </p>
      </div>
    );
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  if (!isEditing) {
    return (
      <div
        className="rounded-lg px-8 py-8"
        style={{ background: "var(--color-surface)", borderTop: "3px solid var(--color-gold)" }}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <h2
            className="text-2xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)", fontWeight: 400 }}
          >
            {guest.rsvpStatus === "attending" ? "You're coming! 🎉" : "We'll miss you."}
          </h2>
          {!rsvpLocked && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="shrink-0 rounded px-3 py-1.5 text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
              style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
            >
              Edit
            </button>
          )}
        </div>

        {guest.rsvpStatus === "attending" && (
          <>
            <div
              className="mb-6 rounded-lg px-5 py-4"
              style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border-gold)" }}
            >
              <p
                className="text-xl leading-relaxed"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text)", fontWeight: 400 }}
              >
                {guest.name ?? invitees[0]?.name ?? "Guest"}
                {invitees.length > 1 && ` — party of ${invitees.length}`}
              </p>
            </div>
            <button
              type="button"
              onClick={handleScheduleNavigation}
              className="inline-flex items-center justify-center rounded px-4 py-3 text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--color-gold)", color: "var(--color-bg)" }}
            >
              Go To Schedule
            </button>
          </>
        )}
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  const isSubmitting = submitState === "submitting";

  const eventsByDay = invitedEvents.reduce<Record<string, InvitedEvent[]>>((acc, e) => {
    const day = e.day ?? "other";
    if (!acc[day]) acc[day] = [];
    acc[day].push(e);
    return acc;
  }, {});
  const orderedDays = ["friday", "saturday", "sunday"].filter((d) => eventsByDay[d]?.length);

  return (
    <div
      className="rounded-lg px-8 py-10"
      style={{
        background: "var(--color-surface)",
        borderTop: "3px solid var(--color-gold)",
        boxShadow: "0 8px 40px var(--color-shadow-soft)",
      }}
    >
      <h2
        className="mb-6 text-2xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)", fontWeight: 400 }}
      >
        RSVP
        {!isSingleMember && (
          <span
            className="ml-3 text-sm font-light tracking-widest uppercase"
            style={{ color: "var(--color-text-muted)", fontFamily: "inherit" }}
          >
            {invitees.length} guests
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

        {attending && invitedEvents.length > 0 && (
          <>
            <hr className="gold-rule my-6" />

            {/* ── Per-person per-event attendance ─────────────────────── */}
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
                                checked={inviteeEvents[invitees[0]?.id]?.has(event.id) ?? false}
                                onChange={(e) =>
                                  toggleInviteeEvent(invitees[0].id, event.id, e.target.checked)
                                }
                                className="rsvp-checkbox"
                                disabled={isSubmitting}
                              />
                              <span className="rsvp-checkbox-custom" aria-hidden="true" />
                              <span style={{ color: "var(--color-text)" }}>I'll be there</span>
                            </label>
                          ) : (
                            <div className="flex flex-wrap gap-3">
                              {invitees.map((inv) => (
                                <label key={inv.id} className="rsvp-checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={inviteeEvents[inv.id]?.has(event.id) ?? false}
                                    onChange={(e) =>
                                      toggleInviteeEvent(inv.id, event.id, e.target.checked)
                                    }
                                    className="rsvp-checkbox"
                                    disabled={isSubmitting}
                                  />
                                  <span className="rsvp-checkbox-custom" aria-hidden="true" />
                                  <span style={{ color: "var(--color-text)" }}>{inv.name}</span>
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

            <hr className="gold-rule my-6" />
          </>
        )}

        {/* ── Error ─────────────────────────────────────────────────── */}
        {submitState === "error" && errorMessage && (
          <p
            className="mb-5 rounded px-4 py-3 text-sm"
            style={{
              background: "var(--color-overlay-soft)",
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
