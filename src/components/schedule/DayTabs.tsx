"use client";

export type DayKey = "friday" | "saturday" | "sunday";

const DAYS: { key: DayKey; label: string; date: string }[] = [
  { key: "friday",   label: "Friday",   date: "Nov 27" },
  { key: "saturday", label: "Saturday", date: "Nov 28" },
  { key: "sunday",   label: "Sunday",   date: "Nov 29" },
];

interface DayTabsProps {
  activeDay: DayKey;
  onChange: (day: DayKey) => void;
  eventCounts: Record<DayKey, number>;
}

export function DayTabs({ activeDay, onChange, eventCounts }: DayTabsProps) {
  return (
    <div
      className="flex gap-1 rounded-lg p-1"
      style={{ backgroundColor: "var(--color-surface)" }}
      role="tablist"
      aria-label="Select day"
    >
      {DAYS.map(({ key, label, date }) => {
        const isActive = activeDay === key;
        const count = eventCounts[key] ?? 0;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className="flex-1 rounded px-3 py-2.5 text-sm transition-all"
            style={{
              backgroundColor: isActive ? "var(--color-red)" : "transparent",
              color: isActive ? "var(--color-text)" : "var(--color-text-muted)",
              fontFamily: isActive ? "var(--font-display)" : "var(--font-body)",
              fontSize: isActive ? "1rem" : "0.875rem",
              fontWeight: isActive ? 400 : 300,
            }}
          >
            <span className="block leading-tight">{label}</span>
            <span
              className="block text-xs leading-tight mt-0.5"
              style={{
                color: isActive ? "var(--color-gold)" : "var(--color-text-dim)",
              }}
            >
              {date}
              {count > 0 && (
                <span className="ml-1 opacity-70">· {count}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
