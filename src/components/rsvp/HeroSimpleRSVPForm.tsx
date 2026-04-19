"use client";

import { useMemo, useState } from "react";
import { lookup } from "@instantdb/react";
import { db } from "@/lib/instant/db";
import { RSVP_DEADLINE_DISPLAY } from "@/lib/rsvp/rsvpDeadline";
import { parseAttendingEventIds } from "@/lib/schedule/personalizeScheduleEvents";
import { sortEventsByStartTime } from "@/lib/schedule/sortEventsByStartTime";

type VisibleEvent = {
  id: string;
  title: string;
  day: string;
  startTime: string;
};

const DAY_LABEL: Record<string, string> = {
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function buildInitialAnswers(
  events: VisibleEvent[],
  attendingRaw: string | undefined,
  hasPriorRsvp: boolean,
): Record<string, boolean> {
  const parsed = parseAttendingEventIds(attendingRaw);
  const next: Record<string, boolean> = {};
  for (const e of events) {
    if (hasPriorRsvp && parsed !== undefined) {
      next[e.id] = parsed.includes(e.id);
    } else {
      next[e.id] = true;
    }
  }
  return next;
}

type SubmitState = "idle" | "submitting" | "error";

export function HeroSimpleRSVPForm({
  guestEmail,
  attendingEventIds,
  rsvpStatus,
  visibleEvents,
  allowSubmit = true,
  onSubmitted,
}: {
  guestEmail: string;
  attendingEventIds: string | undefined;
  rsvpStatus: string | undefined;
  visibleEvents: VisibleEvent[];
  allowSubmit?: boolean;
  onSubmitted: () => void;
}) {
  const hasPriorRsvp = Boolean(rsvpStatus);

  const [answers, setAnswers] = useState<Record<string, boolean>>(() =>
    buildInitialAnswers(visibleEvents, attendingEventIds, hasPriorRsvp),
  );

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const eventsByDay = useMemo(() => {
    const acc: Record<string, VisibleEvent[]> = {};
    for (const e of visibleEvents) {
      const d = e.day ?? "other";
      if (!acc[d]) acc[d] = [];
      acc[d].push(e);
    }
    for (const d of Object.keys(acc)) {
      acc[d] = sortEventsByStartTime(acc[d]);
    }
    return acc;
  }, [visibleEvents]);

  const orderedDays = useMemo(
    () => ["friday", "saturday", "sunday"].filter((d) => eventsByDay[d]?.length),
    [eventsByDay],
  );

  /** Same order as on screen: Fri→Sun, each day morning→night. */
  const chronologicalEvents = useMemo(() => {
    const out: VisibleEvent[] = [];
    for (const d of orderedDays) {
      const list = eventsByDay[d];
      if (list?.length) out.push(...list);
    }
    return out;
  }, [eventsByDay, orderedDays]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allowSubmit) return;
    setSubmitState("submitting");
    setErrorMessage("");

    const yesIds = chronologicalEvents.filter((ev) => answers[ev.id]).map((ev) => ev.id);

    try {
      await db.transact(
        db.tx.guests[lookup("email", guestEmail)].merge({
          rsvpStatus: yesIds.length > 0 ? "attending" : "not-attending",
          attendingEventIds: JSON.stringify(yesIds),
          rsvpSubmittedAt: Date.now(),
        }),
      );
      onSubmitted();
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
      setSubmitState("error");
    }
  }

  const isSubmitting = submitState === "submitting";

  if (visibleEvents.length === 0) {
    return (
      <p className="py-6 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
        There are no events listed for you yet. Please check back later.
      </p>
    );
  }

  if (!allowSubmit && !hasPriorRsvp) {
    return (
      <p className="py-6 text-center text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
        RSVP closed on {RSVP_DEADLINE_DISPLAY}. If you need help, please contact the couple directly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {allowSubmit ? (
        <p className="mb-6 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          For each event, let us know if you&apos;ll be there. You can update your answers until{" "}
          {RSVP_DEADLINE_DISPLAY}.
        </p>
      ) : (
        <p
          className="mb-6 rounded px-4 py-3 text-sm leading-relaxed"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          RSVP is closed as of {RSVP_DEADLINE_DISPLAY}. Below is what we have on file for you.
        </p>
      )}

      <div className="flex flex-col gap-6">
        {orderedDays.map((day) => (
          <div key={day}>
            <p
              className="mb-3 text-xs tracking-widest uppercase"
              style={{ color: "var(--color-gold-dim)" }}
            >
              {DAY_LABEL[day] ?? day}
            </p>
            <div className="flex flex-col gap-3">
              {eventsByDay[day].map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg px-4 py-3"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <p className="text-sm font-medium mb-3" style={{ color: "var(--color-text)" }}>
                    {event.title}
                    {event.startTime ? (
                      <span
                        className="ml-2 font-light text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        · {event.startTime}
                      </span>
                    ) : null}
                  </p>
                  {allowSubmit ? (
                    <div className="flex flex-wrap gap-4">
                      <label className="rsvp-radio-label">
                        <input
                          type="radio"
                          name={`hero-rsvp-${event.id}`}
                          checked={answers[event.id] === true}
                          onChange={() =>
                            setAnswers((prev) => ({ ...prev, [event.id]: true }))
                          }
                          className="rsvp-radio"
                          disabled={isSubmitting}
                        />
                        <span className="rsvp-radio-custom" aria-hidden="true" />
                        <span style={{ color: "var(--color-text)" }}>Yes</span>
                      </label>
                      <label className="rsvp-radio-label">
                        <input
                          type="radio"
                          name={`hero-rsvp-${event.id}`}
                          checked={answers[event.id] === false}
                          onChange={() =>
                            setAnswers((prev) => ({ ...prev, [event.id]: false }))
                          }
                          className="rsvp-radio"
                          disabled={isSubmitting}
                        />
                        <span className="rsvp-radio-custom" aria-hidden="true" />
                        <span style={{ color: "var(--color-text)" }}>No</span>
                      </label>
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                      {answers[event.id] ? "Yes" : "No"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {submitState === "error" && errorMessage ? (
        <p
          className="mt-6 rounded px-4 py-3 text-sm"
          style={{
            background: "rgba(139, 26, 26, 0.18)",
            border: "1px solid var(--color-red)",
            color: "var(--color-text)",
          }}
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      {allowSubmit ? (
        <button type="submit" disabled={isSubmitting} className="rsvp-submit-btn mt-8">
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="rsvp-spinner" aria-hidden="true" />
              Saving…
            </span>
          ) : hasPriorRsvp ? (
            "Save changes"
          ) : (
            "Submit RSVP"
          )}
        </button>
      ) : null}
    </form>
  );
}
