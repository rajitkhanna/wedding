"use client";

import { HotelCard } from "@/components/travel/HotelCard";
import { VenueCard } from "@/components/travel/VenueCard";
import { venues, hotels, airports, gettingAround } from "@/lib/travel-content";
import { useLotusBackground } from "@/lib/useLotusBackground";

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-8 text-center">
      <p className="mb-2 text-xs tracking-[0.3em] uppercase" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </p>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-gold)",
          fontSize: "var(--text-3xl)",
          fontWeight: 400,
          letterSpacing: "var(--ls-wide)",
        }}
      >
        {title}
      </h2>
      <div className="mx-auto mt-4 h-px w-16" style={{ backgroundColor: "var(--color-border-gold)" }} />
    </div>
  );
}

export default function TravelPage() {
  const lotusBg = useLotusBackground();

  return (
    <div
      className="min-h-screen w-full pt-16"
      style={{
        backgroundColor: "var(--color-bg)",
        backgroundImage: lotusBg
          ? [
              "linear-gradient(to bottom, rgba(8,28,22,0.55) 0%, rgba(8,28,22,0.55) 75%, rgba(8,28,22,0.85) 100%)",
              `url('${lotusBg}')`,
            ].join(", ")
          : "linear-gradient(to bottom, rgba(8,28,22,1) 0%, rgba(8,28,22,1) 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-2xl px-6 py-20 flex flex-col gap-20">

        {/* Header */}
        <header className="text-center">
          <p className="mb-3 text-xs tracking-[0.3em] uppercase" style={{ color: "var(--color-text-muted)" }}>
            Getting Here & Staying
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontSize: "3rem",
              fontWeight: 400,
              letterSpacing: "0.04em",
              lineHeight: 1.1,
            }}
          >
            Hotel & Travel
          </h1>
          <div className="mx-auto mt-5 h-px w-24" style={{ backgroundColor: "var(--color-border-gold)" }} />
        </header>

        {/* Venues */}
        <section>
          <SectionHeading label="Where We'll Be" title="Venues" />
          <div className="flex flex-col gap-4 sm:flex-row">
            {Object.values(venues).map((venue) => (
              <VenueCard
                key={venue.name}
                name={venue.name}
                address={venue.address}
                mapsUrl={venue.mapsUrl}
                events={venue.events}
              />
            ))}
          </div>
        </section>

        {/* Hotels */}
        <section>
          <SectionHeading label="Where to Stay" title="Hotels" />
          <div className="flex flex-col gap-4">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.name}
                name={hotel.name}
                distance={hotel.distance}
                note={hotel.note}
                bookingUrl={hotel.bookingUrl}
                preferred={hotel.preferred}
              />
            ))}
          </div>
        </section>

        {/* Airports */}
        <section>
          <SectionHeading label="Flying In" title="Airports" />
          <div className="flex flex-col gap-3">
            {airports.filter((a) => a.code === "BOS").map((airport) => (
              <div
                key={airport.code}
                className="flex items-center justify-between rounded-lg px-5 py-4"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: airport.primary
                    ? "1px solid var(--color-gold-dim)"
                    : "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="text-sm font-mono tracking-widest"
                    style={{ color: "var(--color-gold)" }}
                  >
                    {airport.code}
                  </span>
                  <div>
                    <p className="text-sm" style={{ color: "var(--color-text)" }}>
                      {airport.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {airport.city}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-right" style={{ color: "var(--color-text-muted)" }}>
                  {airport.distance}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Getting Around */}
        <section>
          <SectionHeading label="In Boston" title="Getting Around" />
          <div className="flex flex-col gap-3">
            {gettingAround.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-lg px-5 py-4"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span className="text-xl leading-none" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm font-light" style={{ color: "var(--color-text-muted)" }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
