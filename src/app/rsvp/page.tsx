"use client";

import { db } from "@/lib/instant/db";
import { isRsvpOpen } from "@/lib/rsvp/rsvpDeadline";
import { getVisibleGroups } from "@/lib/schedule/visibleGroups";
import { GlobalAuthGate } from "@/components/auth/GlobalAuthGate";
import { RSVPSection } from "@/components/schedule/RSVPSection";

export default function RSVPPage() {
  const { isLoading: authLoading, user } = db.useAuth();

  const { isLoading: guestLoading, data: guestData } = db.useQuery(
    user ? { guests: { $: { where: { email: user.email! } } } } : null,
  );

  const { isLoading: eventsLoading, data: eventsData } = db.useQuery(
    user ? { scheduleEvents: {} } : null,
  );

  const guest = guestData?.guests?.[0];
  const scheduleGroup: string = guest?.scheduleGroup ?? "general";
  const visibleGroups = getVisibleGroups(scheduleGroup);
  const allEvents = eventsData?.scheduleEvents ?? [];
  const guestEvents = allEvents.filter((e) =>
    visibleGroups.includes(e.group ?? "all"),
  );

  return (
    <div
      className="flex min-h-screen flex-col items-center px-6 py-24"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mb-12 text-center">
        <p className="t-label mb-5" style={{ letterSpacing: "var(--ls-caps)" }}>
          November 28-30, 2026 · Boston
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-gold)",
            fontSize: "clamp(3rem, 8vw, 5rem)",
            fontWeight: 400,
            letterSpacing: "0.06em",
            lineHeight: 1.05,
            marginBottom: "1rem",
          }}
        >
          RSVP
        </h1>
        <p
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text-muted)",
            fontSize: "var(--text-xl)",
            fontWeight: 300,
            fontStyle: "italic",
            letterSpacing: "0.02em",
          }}
        >
          We hope to celebrate with you.
        </p>
      </div>

      <div
        className="mb-12 flex items-center gap-4"
        style={{ width: "100%", maxWidth: "36rem" }}
      >
        <div className="gold-rule flex-1" />
        <span style={{ color: "var(--color-gold-dim)", fontSize: "0.7rem" }}>✦</span>
        <div className="gold-rule flex-1" />
      </div>

      <div className="w-full" style={{ maxWidth: "36rem" }}>
        {authLoading ? (
          <div className="rsvp-card">
            <p className="py-10 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
              Loading...
            </p>
          </div>
        ) : !user ? (
          <div className="w-full overflow-hidden rounded-lg">
            <GlobalAuthGate />
          </div>
        ) : guestLoading || eventsLoading ? (
          <div className="rsvp-card">
            <p className="py-10 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
              Loading your RSVP...
            </p>
          </div>
        ) : !guest ? (
          <div className="rsvp-card">
            <p className="py-10 text-center text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              We couldn&apos;t find your invitation for this email. If you believe this is a mistake,
              please reach out to the couple.
            </p>
          </div>
        ) : (
          <RSVPSection
            rsvpLocked={!isRsvpOpen()}
            guest={{
              id: guest.id as string,
              email: guest.email as string,
              name: guest.name as string | undefined,
              rsvpStatus: guest.rsvpStatus as string | undefined,
              mealPreference: guest.mealPreference as string | undefined,
              dietaryRestrictions: guest.dietaryRestrictions as string | undefined,
              partySize: guest.partySize as number | undefined,
              attendingEventIds: guest.attendingEventIds as string | undefined,
              partyMembers: guest.partyMembers as string | undefined,
            }}
            visibleEvents={guestEvents.map((e) => ({
              id: e.id,
              title: e.title as string,
              day: e.day as string,
              startTime: e.startTime as string,
              location: e.location as string | undefined,
              group: e.group as string,
            }))}
          />
        )}
      </div>

      <p
        className="mt-10 text-center"
        style={{
          color: "var(--color-text-dim)",
          fontSize: "var(--text-xs)",
          maxWidth: "28rem",
          lineHeight: "var(--lh-relaxed)",
        }}
      >
        Questions? Reach us at{" "}
        <a
          href="mailto:meghanarajit2026@gmail.com"
          style={{
            color: "var(--color-text-muted)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          meghanarajit2026@gmail.com
        </a>
      </p>
    </div>
  );
}
