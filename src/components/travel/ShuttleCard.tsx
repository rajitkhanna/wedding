interface ShuttleCardProps {
  day: string;
  route: string;
  departureTime: string;
  note: string;
}

export function ShuttleCard({ day, route, departureTime, note }: ShuttleCardProps) {
  return (
    <div
      className="w-full rounded-lg p-6"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-gold-dim)",
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Icon + route */}
        <div className="flex items-start gap-4">
          <span
            className="text-3xl leading-none"
            role="img"
            aria-label="Shuttle bus"
          >
            🚌
          </span>
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase"
              style={{ color: "var(--color-gold-dim)" }}
            >
              {day} · After the Sikh Ceremony
            </p>
            <h3
              className="mt-1 text-xl"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-gold)",
                fontWeight: 400,
              }}
            >
              {route}
            </h3>
            <p
              className="mt-1 text-sm font-light"
              style={{ color: "var(--color-text-muted)" }}
            >
              {note}
            </p>
          </div>
        </div>

        {/* Departure time badge */}
        <div
          className="shrink-0 rounded px-4 py-2 text-center"
          style={{
            backgroundColor: "var(--color-surface-alt)",
            border: "1px solid var(--color-border-gold)",
          }}
        >
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Departs
          </p>
          <p
            className="mt-0.5 text-base"
            style={{
              fontFamily: "var(--font-display)",
              color: departureTime === "TBD" ? "var(--color-text-dim)" : "var(--color-gold)",
            }}
          >
            {departureTime === "TBD" ? "Time TBD" : departureTime}
          </p>
        </div>
      </div>
    </div>
  );
}
