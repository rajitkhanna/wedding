import { VenueCard } from "@/components/travel/VenueCard";
import { ShuttleCard } from "@/components/travel/ShuttleCard";
import { HotelCard } from "@/components/travel/HotelCard";
import { InfoCard } from "@/components/travel/InfoCard";
import {
  venues,
  shuttleInfo,
  airports,
  hotels,
  gettingAround,
  bostonFavorites,
} from "@/lib/travel-content";

// ── Reusable section header ──────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2
        className="text-sm font-medium tracking-[0.25em] uppercase"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--color-gold)",
          fontVariant: "small-caps",
        }}
      >
        {children}
      </h2>
      <hr className="gold-rule mt-2" />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TravelStay() {
  const ic = venues.intercontinental;
  const gurdwara = venues.gurudwara;

  return (
    <div
      className="min-h-screen w-full pt-24 pb-20"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-4xl px-6">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <header className="mb-16 text-center">
          <p
            className="mb-3 text-xs tracking-[0.3em] uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Boston, Massachusetts
          </p>
          <h1
            className="text-5xl md:text-6xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontWeight: 400,
            }}
          >
            Travel & Stay
          </h1>
          <div
            className="mx-auto mt-5 h-px w-24"
            style={{ backgroundColor: "var(--color-border-gold)" }}
          />
          <p
            className="mt-5 text-base font-light"
            style={{ color: "var(--color-text-muted)" }}
          >
            We can&apos;t wait to celebrate with you in Boston.
          </p>
        </header>

        {/* ── Getting Here ─────────────────────────────────────────────── */}
        <section className="mb-16">
          <SectionHeader>Getting Here</SectionHeader>

          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Flying */}
            <InfoCard icon="✈️" title="Flying In">
              <p className="mb-3">
                <span style={{ color: "var(--color-gold-light)" }}>BOS</span>{" "}
                Logan International is the closest airport — about{" "}
                <span style={{ color: "var(--color-text)" }}>20 minutes</span>{" "}
                from InterContinental Boston.
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-dim)" }}
              >
                Also served by:
              </p>
              <ul className="mt-1 space-y-1">
                {airports
                  .filter((a) => !a.primary)
                  .map((a) => (
                    <li key={a.code} className="text-xs">
                      <span style={{ color: "var(--color-text-muted)" }}>
                        {a.code}
                      </span>{" "}
                      <span style={{ color: "var(--color-text-dim)" }}>
                        {a.name} — {a.distance}
                      </span>
                    </li>
                  ))}
              </ul>
            </InfoCard>

            {/* Driving */}
            <InfoCard icon="🚗" title="Driving">
              <p>
                Take <span style={{ color: "var(--color-text)" }}>I-90 / Mass Pike</span>{" "}
                into Boston. Both valet and self-parking are available at
                InterContinental Boston.
              </p>
            </InfoCard>

            {/* Train */}
            <InfoCard icon="🚆" title="Train">
              <p>
                Amtrak&apos;s{" "}
                <span style={{ color: "var(--color-text)" }}>South Station</span>{" "}
                is a 5-minute walk from InterContinental Boston, with connections
                from New York, Providence, and beyond.
              </p>
            </InfoCard>
          </div>
        </section>

        {/* ── Where to Stay ────────────────────────────────────────────── */}
        <section className="mb-16">
          <SectionHeader>Where to Stay</SectionHeader>

          <div className="space-y-4">
            {/* Preferred hotel first */}
            {hotels
              .filter((h) => h.preferred)
              .map((h) => (
                <HotelCard
                  key={h.name}
                  name={h.name}
                  distance={h.distance ?? null}
                  note={h.note ?? null}
                  bookingUrl={h.bookingUrl ?? null}
                  preferred={h.preferred}
                />
              ))}

            {/* Nearby alternatives */}
            <div
              className="rounded-lg p-5"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl" role="img" aria-label="Hotel">🏨</span>
                <h3
                  className="text-lg"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--color-text)",
                    fontWeight: 400,
                  }}
                >
                  Nearby Alternatives
                </h3>
              </div>
              <ul className="space-y-3">
                {hotels
                  .filter((h) => !h.preferred)
                  .map((h) => (
                    <li
                      key={h.name}
                      className="flex items-baseline justify-between"
                    >
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {h.name}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-text-dim)" }}
                      >
                        {h.distance}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── The Two Venues ───────────────────────────────────────────── */}
        <section className="mb-16">
          <SectionHeader>The Two Venues</SectionHeader>

          <div className="flex flex-col gap-4 sm:flex-row">
            <VenueCard
              name={ic.name}
              address={ic.address}
              mapsUrl={ic.mapsUrl}
              events={ic.events}
            />
            <VenueCard
              name={gurdwara.name}
              address={gurdwara.address}
              mapsUrl={gurdwara.mapsUrl}
              events={gurdwara.events}
            />
          </div>
        </section>

        {/* ── Saturday Shuttle ─────────────────────────────────────────── */}
        <section className="mb-16">
          <SectionHeader>Saturday Shuttle</SectionHeader>
          <ShuttleCard
            day={shuttleInfo.day}
            route={shuttleInfo.route}
            departureTime={shuttleInfo.departureTime}
            note={shuttleInfo.note}
          />
        </section>

        {/* ── Getting Around Boston ────────────────────────────────────── */}
        <section className="mb-16">
          <SectionHeader>Getting Around Boston</SectionHeader>

          <div className="flex flex-col gap-4 sm:flex-row">
            {gettingAround.map((item) => (
              <InfoCard key={item.label} icon={item.icon} title={item.label}>
                <p>{item.detail}</p>
              </InfoCard>
            ))}
          </div>
        </section>

        {/* ── While You're in Boston ───────────────────────────────────── */}
        <section className="mb-16">
          <SectionHeader>While You&apos;re in Boston</SectionHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {bostonFavorites.map((fav, i) => (
              <div
                key={i}
                className="rounded-lg p-5"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  opacity: 0.6,
                }}
              >
                <p
                  className="text-sm italic"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  {fav.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer rule ──────────────────────────────────────────────── */}
        <div className="mt-4 text-center">
          <div
            className="mx-auto mb-6 h-px w-24"
            style={{ backgroundColor: "var(--color-border-gold)" }}
          />
          <p
            className="text-sm font-light"
            style={{ color: "var(--color-text-dim)" }}
          >
            More details will be added as the date approaches.
          </p>
        </div>

      </div>
    </div>
  );
}
