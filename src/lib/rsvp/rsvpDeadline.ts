/**
 * RSVP edits close at the start of September 27, 2026 in Eastern Time (Boston).
 * (America/New_York is EDT on this date → local midnight = 04:00 UTC.)
 */
const RSVP_CLOSES_AT_MS = Date.parse("2026-09-27T04:00:00.000Z");

export const RSVP_DEADLINE_DISPLAY = "September 27, 2026";

/** Where guests should reach the couple's families after RSVPs close. */
export const RSVP_CONTACT_EMAILS = [
  "khannaspb@gmail.com",
  "vavvaru@gmail.com",
] as const;

/** `true` if guests may still submit or change their RSVP. */
export function isRsvpOpen(now: number = Date.now()): boolean {
  return now < RSVP_CLOSES_AT_MS;
}
