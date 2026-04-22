"use client";

import { useState } from "react";
import { lookup } from "@instantdb/react";
import { db } from "@/lib/instant/db";
import { isRsvpOpen, RSVP_DEADLINE_DISPLAY } from "@/lib/rsvp/rsvpDeadline";

function dayLabel(day: string) {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

type AttendanceMap = Record<string, Record<string, boolean>>;

function buildInitialAttendance(
  invitees: Array<{ id: string; attendingEvents?: Array<{ id: string }> }>,
  events: Array<{ id: string }>,
  hasRsvpd: boolean,
): AttendanceMap {
  const map: AttendanceMap = {};
  for (const event of events) {
    map[event.id] = {};
    for (const inv of invitees) {
      if (hasRsvpd) {
        const attendingIds = new Set((inv.attendingEvents ?? []).map((e) => e.id));
        map[event.id][inv.id] = attendingIds.has(event.id);
      } else {
        map[event.id][inv.id] = true;
      }
    }
  }
  return map;
}

type InviteeShape = { id: string; name: string; sortOrder: number; attendingEvents?: Array<{ id: string }> };
type EventShape = { id: string; title: string; day: string; startTime: string; endTime?: string; location?: string; locationUrl?: string; sortOrder: number };

function RSVPForm({
  guest,
  invitees,
  events,
  rsvpLocked,
}: {
  guest: { id: string; email: string; name?: string; rsvpStatus?: string };
  invitees: InviteeShape[];
  events: EventShape[];
  rsvpLocked: boolean;
}) {
  const hasRsvpd = Boolean(guest.rsvpStatus);
  const [attendance, setAttendance] = useState<AttendanceMap>(() =>
    buildInitialAttendance(invitees, events, hasRsvpd),
  );
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState("");

  const isSingle = invitees.length === 1;

  function toggle(eventId: string, inviteeId: string) {
    if (rsvpLocked) return;
    setAttendance((prev) => ({
      ...prev,
      [eventId]: { ...prev[eventId], [inviteeId]: !prev[eventId]?.[inviteeId] },
    }));
    setSaved(false);
    setIsDirty(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rsvpLocked || submitting) return;
    setSubmitting(true);
    setError("");
    setSaved(false);
    try {
      const inviteeTxns = invitees.flatMap((inv) => {
        const currentIds = (inv.attendingEvents ?? []).map((e) => e.id);
        const newIds = events.filter((ev) => attendance[ev.id]?.[inv.id]).map((ev) => ev.id);
        const toUnlink = currentIds.filter((id) => !newIds.includes(id));
        const toLink = newIds.filter((id) => !currentIds.includes(id));
        return [
          ...(toUnlink.length ? [db.tx.invitees[inv.id].unlink({ attendingEvents: toUnlink })] : []),
          ...(toLink.length ? [db.tx.invitees[inv.id].link({ attendingEvents: toLink })] : []),
        ];
      });
      await db.transact([
        db.tx.guests[lookup("email", guest.email)].merge({
          rsvpStatus: "submitted",
          rsvpSubmittedAt: Date.now(),
        }),
        ...inviteeTxns,
      ]);
      setSaved(true);
      setIsDirty(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (rsvpLocked && !hasRsvpd) {
    return (
      <div
        className="rounded-lg px-8 py-10 text-center"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          RSVP closed on {RSVP_DEADLINE_DISPLAY}. Please reach out to the couple directly if you
          need assistance.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {!rsvpLocked && (
        <p className="mb-4 text-right text-sm transition-opacity duration-300" style={{
          color: "var(--color-text-muted)",
          opacity: isDirty && !submitting ? 1 : 0,
        }}>
          Unsaved changes
        </p>
      )}
      <div className="flex flex-col gap-5">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-lg overflow-hidden"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderLeft: "4px solid var(--color-gold)",
            }}
          >
            <div className="px-6 pt-6 pb-5">
              <p className="mb-1 text-xs tracking-[0.2em] uppercase" style={{ color: "var(--color-gold-dim)" }}>
                {dayLabel(event.day)}
              </p>
              <h2
                className="mb-3 leading-snug"
                style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", color: "var(--color-text)", fontWeight: 400 }}
              >
                {event.title}
              </h2>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                <p className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: "var(--color-gold-dim)" }}>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {event.startTime}{event.endTime && <><span aria-hidden>–</span>{event.endTime}</>}
                </p>
                {event.location && (
                  <p className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                    <svg width="11" height="14" viewBox="0 0 12 14" fill="none" style={{ flexShrink: 0, color: "var(--color-gold-dim)" }}>
                      <path d="M6 0C3.79 0 2 1.79 2 4c0 3 4 8.5 4 8.5S10 7 10 4c0-2.21-1.79-4-4-4zm0 5.5C5.17 5.5 4.5 4.83 4.5 4S5.17 2.5 6 2.5 7.5 3.17 7.5 4 6.83 5.5 6 5.5z" fill="currentColor" />
                    </svg>
                    {event.locationUrl ? (
                      <a
                        href={event.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--color-text-muted)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-gold)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-text-muted)"; }}
                      >
                        {event.location}
                      </a>
                    ) : event.location}
                  </p>
                )}
              </div>
            </div>

            <div style={{ height: "1px", backgroundColor: "var(--color-border)", margin: "0 1.5rem" }} />

            <div className="px-6 py-5">
              <p className="mb-4 text-xs tracking-widest uppercase" style={{ color: "var(--color-text-muted)" }}>
                {isSingle ? "Will you attend?" : "Who's attending?"}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {invitees.map((inv) => {
                  const checked = attendance[event.id]?.[inv.id] ?? false;
                  return (
                    <label
                      key={inv.id}
                      className={`flex items-center gap-2.5 ${rsvpLocked ? "cursor-default" : "cursor-pointer"}`}
                      onClick={() => toggle(event.id, inv.id)}
                    >
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
                        style={{
                          border: `2px solid ${checked ? "var(--color-gold)" : "var(--color-border-gold)"}`,
                          backgroundColor: checked ? "var(--color-gold)" : "transparent",
                          transition: "all 0.15s",
                          opacity: rsvpLocked ? 0.6 : 1,
                        }}
                      >
                        {checked && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="var(--color-bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm" style={{ color: checked ? "var(--color-text)" : "var(--color-text-dim)" }}>
                        {inv.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!rsvpLocked && (
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <button
            type="submit"
            disabled={submitting || (hasRsvpd && !isDirty)}
            className="rounded px-8 py-3 text-sm tracking-widest uppercase transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: "var(--color-gold)", color: "var(--color-bg)" }}
          >
            {submitting ? "Saving…" : "Save RSVP"}
          </button>
          {error && <p className="text-sm" style={{ color: "var(--color-red)" }}>{error}</p>}
          {!error && (
            <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
              You can update this until {RSVP_DEADLINE_DISPLAY}.
            </p>
          )}
        </div>
      )}


      {rsvpLocked && (
        <p className="mt-8 text-xs text-center" style={{ color: "var(--color-text-dim)" }}>
          RSVP closed on {RSVP_DEADLINE_DISPLAY}.
        </p>
      )}
    </form>
  );
}

export default function RSVPPage() {
  const { user } = db.useAuth();

  const { isLoading: guestLoading, data: guestData } = db.useQuery(
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

  const guest = guestData?.guests?.[0];

  const invitees = [...(guest?.invitees ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  ) as InviteeShape[];

  const events = [...(guest?.invitedEvents ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  ) as EventShape[];

  const rsvpLocked = !isRsvpOpen();

  return (
    <div className="min-h-screen w-full pb-24" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="mx-auto max-w-2xl px-5 pt-32">

        <header className="mb-12 text-center">
          <p className="mb-3 text-xs tracking-[0.3em] uppercase" style={{ color: "var(--color-text-muted)" }}>
            November 27–29, 2026 · Boston
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontSize: "clamp(3rem, 8vw, 5rem)",
              fontWeight: 400,
              letterSpacing: "0.06em",
              lineHeight: 1.05,
            }}
          >
            RSVP
          </h1>
          <div className="mx-auto mt-5 h-px w-24" style={{ backgroundColor: "var(--color-border-gold)" }} />
          {!guestLoading && guest && (
            <p className="mt-5 text-sm font-light" style={{ color: "var(--color-text-muted)" }}>
              Hello,{" "}
              <span style={{ color: "var(--color-gold)" }}>{guest.name ?? user.email}</span>
              {" "}— let us know who can make each event.
            </p>
          )}
        </header>

        {guestLoading ? (
          <p className="text-center text-sm py-12" style={{ color: "var(--color-text-muted)" }}>Loading your invitation…</p>
        ) : !guest ? (
          <div
            className="rounded-lg px-8 py-10 text-center"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              We couldn&apos;t find your invitation for this email. If you believe this is a
              mistake, please reach out to the couple.
            </p>
          </div>
        ) : (
          <RSVPForm
            key={guest.id}
            guest={{ id: guest.id, email: guest.email as string, name: guest.name as string | undefined, rsvpStatus: guest.rsvpStatus as string | undefined }}
            invitees={invitees}
            events={events}
            rsvpLocked={rsvpLocked}
          />
        )}

        <div className="mx-auto mt-16 mb-6 h-px w-24" style={{ backgroundColor: "var(--color-border-gold)" }} />
        <p className="text-center text-xs font-light leading-relaxed" style={{ color: "var(--color-text-dim)" }}>
          Questions? Email{" "}
          <a href="mailto:rajitskhanna@gmail.com" style={{ color: "var(--color-text-muted)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            rajitskhanna@gmail.com
          </a>
          <span className="mx-2">·</span>
          Issue with this page?{" "}
          <a href="sms:16039218190" style={{ color: "var(--color-text-muted)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Text Rajit at (603) 921-8190
          </a>
        </p>
      </div>
    </div>
  );
}
