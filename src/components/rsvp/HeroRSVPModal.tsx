"use client";

import { useEffect } from "react";
import { db } from "@/lib/instant/db";
import { RSVPSection } from "@/components/schedule/RSVPSection";

export function HeroRSVPModal({
  open,
  onClose,
  onAfterSubmit,
  startEditing = false,
  allowSubmit = true,
}: {
  open: boolean;
  onClose: () => void;
  onAfterSubmit?: () => void;
  startEditing?: boolean;
  allowSubmit?: boolean;
}) {
  const { user } = db.useAuth();

  const { isLoading: guestLoading, data: guestData } = db.useQuery(
    open && user
      ? { guests: { invitees: {}, invitedEvents: {}, $: { where: { email: user.email! } } } }
      : null,
  );

  const guest = guestData?.guests?.[0];

  const invitees = [...(guest?.invitees ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  const invitedEvents = [...(guest?.invitedEvents ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hero-rsvp-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        style={{ backgroundColor: "var(--color-overlay-strong)" }}
        aria-label="Close RSVP dialog"
        onClick={onClose}
      />
      <div
        className="relative z-10 max-h-[min(90vh,900px)] w-full max-w-2xl overflow-y-auto rounded-lg"
        style={{
          backgroundColor: "var(--color-bg)",
          border: "1px solid var(--color-border-gold)",
          boxShadow: "0 24px 80px var(--color-shadow-strong)",
        }}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4"
          style={{
            backgroundColor: "var(--color-bg)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <h2
            id="hero-rsvp-title"
            className="text-xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)", fontWeight: 400 }}
          >
            RSVP
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-3 py-1.5 text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
            style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
          >
            Close
          </button>
        </div>

        <div className="px-4 pb-8 pt-4 sm:px-6">
          {guestLoading ? (
            <p className="py-12 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
              Loading…
            </p>
          ) : !guest ? (
            <p
              className="py-8 text-center text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              We couldn&apos;t find your invitation for this email. If you believe this is a
              mistake, please reach out to the couple.
            </p>
          ) : (
            <RSVPSection
              startEditing={startEditing}
              rsvpLocked={!allowSubmit}
              guest={{
                id: guest.id as string,
                email: guest.email as string,
                name: guest.name as string | undefined,
                rsvpStatus: guest.rsvpStatus as string | undefined,
                invitees: invitees.map((inv) => ({
                  id: inv.id,
                  name: inv.name as string,
                  sortOrder: inv.sortOrder as number,
                  meal: inv.meal as string | undefined,
                  dietary: inv.dietary as string | undefined,
                  attendingEventIds: inv.attendingEventIds as string | undefined,
                })),
                invitedEvents: invitedEvents.map((e) => ({
                  id: e.id,
                  title: e.title as string,
                  day: e.day as string,
                  startTime: e.startTime as string,
                  location: e.location as string | undefined,
                  group: e.group as string,
                })),
              }}
              onScheduleClick={onClose}
              onSubmitted={() => {
                onAfterSubmit?.();
                onClose();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}