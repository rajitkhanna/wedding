"use client";

interface ScheduleEvent {
  id: string;
  title: string;
  day: string;
  startTime: string;
  endTime?: string;
  location?: string;
  locationUrl?: string;
  description?: string;
  group: string;
  sortOrder: number;
}

const GROUP_LABELS: Record<string, string> = {
  all: "All guests",
  family: "Family",
  "wedding-party": "Wedding party",
};

interface EventCardProps {
  event: ScheduleEvent;
}

export function EventCard({ event }: EventCardProps) {
  const groupLabel = GROUP_LABELS[event.group] ?? event.group;
  const isTbd = !event.startTime || event.startTime === "TBD";

  return (
    <div
      className="rounded-lg p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderLeft: "4px solid var(--color-gold)",
      }}
    >
      <div className="flex flex-col gap-2">
        {/* Time */}
        {!isTbd ? (
          <p
            className="text-xl leading-none"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontWeight: 400,
            }}
          >
            {event.startTime}
            {event.endTime ? (
              <span
                className="text-base ml-2"
                style={{ color: "var(--color-gold-dim)" }}
              >
                – {event.endTime}
              </span>
            ) : null}
          </p>
        ) : (
          <p
            className="text-sm tracking-widest uppercase"
            style={{ color: "var(--color-gold-dim)" }}
          >
            Time TBD
          </p>
        )}

        {/* Title */}
        <h3
          className="text-xl leading-snug"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
            fontWeight: 400,
          }}
        >
          {event.title}
        </h3>

        {/* Location */}
        {event.location && (
          <p className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
            <svg
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              aria-hidden="true"
              style={{ flexShrink: 0, color: "var(--color-gold-dim)" }}
            >
              <path
                d="M6 0C3.79 0 2 1.79 2 4c0 3 4 8.5 4 8.5S10 7 10 4c0-2.21-1.79-4-4-4zm0 5.5C5.17 5.5 4.5 4.83 4.5 4S5.17 2.5 6 2.5 7.5 3.17 7.5 4 6.83 5.5 6 5.5z"
                fill="currentColor"
              />
            </svg>
            {event.locationUrl ? (
              <a
                href={event.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80 transition-opacity inline-flex items-center gap-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                {event.location}
                {/* external link icon */}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5.5 1H9v3.5M9 1 4.5 5.5M1 2.5h3.5v6h-3.5z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ) : (
              event.location
            )}
          </p>
        )}

        {/* Description */}
        {event.description && (
          <p
            className="text-sm font-light leading-relaxed"
            style={{ color: "var(--color-text-dim)" }}
          >
            {event.description}
          </p>
        )}

      </div>
    </div>
  );
}
