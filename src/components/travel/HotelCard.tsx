"use client";

interface HotelCardProps {
  name: string;
  distance: string | null;
  note: string | null;
  bookingUrl: string | null;
  preferred?: boolean;
}

export function HotelCard({
  name,
  distance,
  note,
  bookingUrl,
  preferred = false,
}: HotelCardProps) {
  const hasBooking = bookingUrl && bookingUrl !== "TBD";

  return (
    <div
      className="relative flex flex-col rounded-lg p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        border: preferred
          ? "1px solid var(--color-gold-dim)"
          : "1px solid var(--color-border)",
      }}
    >
      {/* Preferred badge */}
      {preferred && (
        <span
          className="absolute right-4 top-4 rounded px-2 py-0.5 text-xs font-medium tracking-widest uppercase"
          style={{
            backgroundColor: "var(--color-surface-alt)",
            border: "1px solid var(--color-gold-dim)",
            color: "var(--color-gold)",
          }}
        >
          ★ Preferred
        </span>
      )}

      <h3
        className="pr-24 text-lg"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-text)",
          fontWeight: 400,
        }}
      >
        {name}
      </h3>

      {distance && (
        <p
          className="mt-1 text-xs tracking-wide uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          {distance}
        </p>
      )}

      {note && (
        <p
          className="mt-2 text-sm font-light leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          {note}
        </p>
      )}

      {/* Book Now button */}
      {preferred && (
        <div className="mt-4">
          {hasBooking ? (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded px-5 py-2 text-sm tracking-wide transition-colors"
              style={{
                border: "1px solid var(--color-gold-dim)",
                color: "var(--color-gold)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = "var(--color-surface-alt)";
                el.style.color = "var(--color-gold-light)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = "transparent";
                el.style.color = "var(--color-gold)";
              }}
            >
              Book Room Block →
            </a>
          ) : (
            <span
              className="inline-block rounded px-5 py-2 text-sm tracking-wide"
              style={{
                border: "1px solid var(--color-border-gold)",
                color: "var(--color-text-dim)",
              }}
            >
              Booking link coming soon
            </span>
          )}
        </div>
      )}
    </div>
  );
}
