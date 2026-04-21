export function parseAttendingEventIds(raw: string | undefined): string[] | undefined {
  if (raw == null || raw.trim() === "") return undefined;
  try {
    const p = JSON.parse(raw);
    if (Array.isArray(p)) return p.filter((x): x is string => typeof x === "string");
  } catch {
    const parts = raw.split(/[\s,]+/).filter(Boolean);
    return parts.length ? parts : undefined;
  }
  return undefined;
}

interface Invitee {
  attendingEventIds?: string;
}

interface Event {
  id: string;
}

/** Events to show on a guest's personalized schedule after RSVP. */
export function personalizeScheduleEvents<T extends Event>(
  invitedEvents: T[],
  guest: { rsvpStatus?: string; invitees?: Invitee[] } | null | undefined,
): T[] {
  if (!guest?.rsvpStatus) return [];
  if (guest.rsvpStatus === "not-attending") return [];

  if (guest.rsvpStatus === "attending") {
    const invitees = guest.invitees ?? [];
    if (invitees.length > 0) {
      const attendingIds = new Set(
        invitees.flatMap((inv) => parseAttendingEventIds(inv.attendingEventIds) ?? []),
      );
      if (attendingIds.size > 0) {
        return invitedEvents.filter((e) => attendingIds.has(e.id));
      }
    }
    return invitedEvents;
  }

  return invitedEvents;
}
