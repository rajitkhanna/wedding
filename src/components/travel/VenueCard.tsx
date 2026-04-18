interface VenueCardProps {
  name: string;
  address: string;
  mapsUrl: string | null;
  events: readonly string[];
}

export function VenueCard({ name, address, mapsUrl, events }: VenueCardProps) {
  const mapAvailable = !!mapsUrl && mapsUrl !== "TBD";
  const addressAvailable = !address.startsWith("TBD") && !address.startsWith("Address will");

  return (
    <div
      className="flex flex-1 flex-col rounded-lg p-6"
      style={{
        backgroundColor: "var(--color-surface)",
        borderLeft: "3px solid var(--color-red)",
      }}
    >
      <h3
        className="text-xl"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-text)",
          fontWeight: 400,
        }}
      >
        {name}
      </h3>

      {/* Events */}
      <ul className="mt-3 space-y-1">
        {events.map((event) => (
          <li
            key={event}
            className="text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span style={{ color: "var(--color-gold-dim)" }}>·</span>{" "}
            {event}
          </li>
        ))}
      </ul>

      {/* Address */}
      <p
        className="mt-4 text-sm font-light"
        style={{ color: addressAvailable ? "var(--color-text-muted)" : "var(--color-text-dim)" }}
      >
        {address}
      </p>

      {/* Map link */}
      <div className="mt-4">
        {mapAvailable ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm underline underline-offset-2 transition-colors"
            style={{ color: "var(--color-gold)" }}
          >
            View on Map →
          </a>
        ) : (
          <span
            className="text-sm"
            style={{ color: "var(--color-text-dim)" }}
          >
            Map link coming soon
          </span>
        )}
      </div>
    </div>
  );
}
