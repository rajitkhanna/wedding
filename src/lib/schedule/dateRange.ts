const DAY_ORDER = ["thursday", "friday", "saturday", "sunday"];

const DAY_DATES: Record<string, string> = {
  thursday: "November 26",
  friday: "November 27",
  saturday: "November 28",
  sunday: "November 29",
};

export function buildDateRange(days: string[]): string | null {
  const sorted = DAY_ORDER.filter((d) => days.includes(d));
  if (!sorted.length) return null;
  const first = DAY_DATES[sorted[0]];
  const last = DAY_DATES[sorted[sorted.length - 1]];
  if (first === last) return `${first}, 2026`;
  return `November ${first.split(" ")[1]}–${last.split(" ")[1]}, 2026`;
}
