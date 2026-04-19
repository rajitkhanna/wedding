/** Minutes from midnight for sorting; unparseable / TBD times sort last (after evening). */
const UNKNOWN_MINUTES = 24 * 60 + 1;

/**
 * Parses strings like `6:30 PM`, `8:00 AM`. Returns {@link UNKNOWN_MINUTES} for
 * empty, `TBD`, or non-matching text (e.g. `TBD AM`).
 */
export function startTimeSortMinutes(startTime: string): number {
  const t = (startTime ?? "").trim();
  if (!t || /^TBD/i.test(t)) return UNKNOWN_MINUTES;

  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)\s*$/i);
  if (!m) return UNKNOWN_MINUTES;

  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

/** Within a single day: morning → night. */
export function sortEventsByStartTime<T extends { startTime: string }>(events: T[]): T[] {
  return [...events].sort(
    (a, b) => startTimeSortMinutes(a.startTime) - startTimeSortMinutes(b.startTime),
  );
}
