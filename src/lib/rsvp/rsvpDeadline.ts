/**
 * RSVP edits close at the start of August 1, 2026 in Eastern Time (Boston).
 * (America/New_York is EDT on this date → local midnight = 04:00 UTC.)
 */
const RSVP_CLOSES_AT_MS = Date.parse("2026-08-01T04:00:00.000Z");

export const RSVP_DEADLINE_DISPLAY = "August 1, 2026";

/** `true` if guests may still submit or change their RSVP. */
export function isRsvpOpen(now: number = Date.now()): boolean {
  return now < RSVP_CLOSES_AT_MS;
}
