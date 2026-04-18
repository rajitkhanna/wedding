import { SectionBanner } from "@/components/SectionBanner";
import { VenueCard } from "@/components/travel/VenueCard";
import { HotelCard } from "@/components/travel/HotelCard";
import { InfoCard } from "@/components/travel/InfoCard";
import {
  venues,
  airports,
  hotels,
  gettingAround,
  bostonFavorites,
} from "@/lib/travel-content";

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3
        className="text-sm font-medium tracking-[0.25em] uppercase"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--color-gold)",
          fontVariant: "small-caps",
        }}
      >
        {children}
      </h3>
      <hr className="gold-rule mt-2" />
    </div>
  );
}

export function TravelSection() {
  const ic = venues.intercontinental;
  const gurdwara = venues.gurudwara;

  return (
    <section
      id="travel"
      className="w-full pt-0 pb-24 px-6"
      style={{ backgroundColor: "var(--color-bg)", scrollMarginTop: "64px" }}
    >
      <SectionBanner match="palace" fallbackMatch="venue/" height="26vh" />
      <div className="mx-auto max-w-4xl px-6 pt-16 pb-24">
        <header className="mb-16 text-center">
          <p
            className="mb-3 text-xs tracking-[0.3em] uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Boston, Massachusetts
          </p>
          <h2
            className="text-5xl md:text-6xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontWeight: 400,
            }}
          >
            Travel &amp; Stay
          </h2>
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

        {/* Getting Here */}
        <div className="mb-16">
          <SectionHeader>Getting Here</SectionHeader>
          <div className="flex flex-col gap-4 sm:flex-row">
            <InfoCard icon="✈️" title="Flying In">
              <p className="mb-3">
                <span style={{ color: "var(--color-gold-light)" }}>BOS</span>{" "}
                Logan International is the closest airport — about{" "}
                <span style={{ color: "var(--color-text)" }}>20 minutes</span>{" "}
                from InterContinental Boston.
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
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
            <InfoCard icon="🚗" title="Driving">
              <p>
                Take{" "}
                <span style={{ color: "var(--color-text)" }}>
                  I-90 / Mass Pike
                </span>{" "}
                into Boston. Both valet and self-parking are available at
                InterContinental Boston.
              </p>
            </InfoCard>
            <InfoCard icon="🚆" title="Train">
              <p>
                Amtrak&apos;s{" "}
                <span style={{ color: "var(--color-text)" }}>South Station</span>{" "}
                is a 5-minute walk from InterContinental Boston, with connections
                from New York, Providence, and beyond.
              </p>
            </InfoCard>
          </div>
        </div>

        {/* Where to Stay */}
        <div className="mb-16">
          <SectionHeader>Where to Stay</SectionHeader>
          <div className="space-y-4">
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
            <div
              className="rounded-lg p-5"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl" role="img" aria-label="Hotel">
                  🏨
                </span>
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
        </div>

        {/* The Two Venues */}
        <div className="mb-16">
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
        </div>

        {/* Getting Around */}
        <div className="mb-16">
          <SectionHeader>Getting Around Boston</SectionHeader>
          <div className="flex flex-col gap-4 sm:flex-row">
            {gettingAround.map((item) => (
              <InfoCard key={item.label} icon={item.icon} title={item.label}>
                <p>{item.detail}</p>
              </InfoCard>
            ))}
          </div>
        </div>

        {/* While You're in Boston */}
        <div className="mb-16">
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
        </div>

        <div className="text-center">
          <div
            className="mx-auto mb-6 h-px w-24"
            style={{ backgroundColor: "var(--color-border-gold)" }}
          />
          <p className="text-sm font-light" style={{ color: "var(--color-text-dim)" }}>
            More details will be added as the date approaches.
          </p>
        </div>
      </div>
    </section>
  );
}
