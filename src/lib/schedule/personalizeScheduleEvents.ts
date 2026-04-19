const VISIBLE_GROUPS: Record<string, string[]> = {
  "wedding-party": ["all", "family", "wedding-party"],
  family: ["all", "family"],
  general: ["all"],
  admin: ["all", "family", "wedding-party"],
};

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

/** Events visible on a guest's schedule after RSVP rules (tier + selected events). */
export function personalizeScheduleEvents<T extends { id: string; group?: string }>(
  allEvents: T[],
  guest: { rsvpStatus?: string; attendingEventIds?: string } | null | undefined,
  scheduleGroup: string,
): T[] {
  const vg = VISIBLE_GROUPS[scheduleGroup] ?? ["all"];
  let list = allEvents.filter((e) => vg.includes(e.group ?? "all"));
  if (!guest) return [];
  if (!guest.rsvpStatus) return [];
  if (guest.rsvpStatus === "not-attending") return [];
  if (guest.rsvpStatus === "attending") {
    const ids = parseAttendingEventIds(guest.attendingEventIds);
    if (ids !== undefined) {
      return list.filter((e) => ids.includes(e.id));
    }
    return list;
  }
  return list;
}
