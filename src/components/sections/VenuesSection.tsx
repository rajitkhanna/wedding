"use client";

import { venues } from "@/lib/travel-content";

export function VenuesSection() {
  const ic = venues.intercontinental;
  const gurdwara = venues.gurudwara;

  return (
    <section
      id="venues"
      className="w-full py-24 px-6"
      style={{ backgroundColor: "var(--color-bg)", scrollMarginTop: "64px" }}
    >
      <div className="mx-auto max-w-3xl">
        <header className="mb-14 text-center">
          <p
            className="mb-3 t-label"
            style={{ color: "var(--color-text-muted)", letterSpacing: "var(--ls-caps)" }}
          >
            Boston, Massachusetts
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontSize: "var(--text-3xl)",
              fontWeight: 400,
            }}
          >
            Where We're Getting Married
          </h2>
          <div className="mx-auto mt-5 h-px w-24" style={{ backgroundColor: "var(--color-border-gold)" }} />
        </header>

        <div className="flex flex-col gap-6 md:flex-row">
          {/* IC */}
          <div
            className="flex-1 rounded-xl p-8"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border-gold)",
            }}
          >
            <p
              className="t-label mb-3"
              style={{ color: "var(--color-gold)", letterSpacing: "var(--ls-caps)" }}
            >
              Friday · Saturday · Sunday
            </p>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
                fontSize: "var(--text-xl)",
                fontWeight: 400,
                marginBottom: "0.5rem",
              }}
            >
              {ic.name}
            </h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "1.25rem" }}>
              {ic.address}
            </p>
            <ul className="space-y-2 mb-6">
              {ic.events.map((e) => (
                <li key={e} style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                  <span style={{ color: "var(--color-gold-dim)", marginRight: "0.5rem" }}>·</span>
                  {e}
                </li>
              ))}
            </ul>
            <a
              href={ic.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "var(--text-sm)", color: "var(--color-gold)" }}
              className="underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              View on Map →
            </a>
          </div>

          {/* Gurudwara */}
          <div
            className="flex-1 rounded-xl p-8"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="t-label mb-3"
              style={{ color: "var(--color-text-muted)", letterSpacing: "var(--ls-caps)" }}
            >
              Saturday Morning
            </p>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
                fontSize: "var(--text-xl)",
                fontWeight: 400,
                marginBottom: "0.5rem",
              }}
            >
              {gurdwara.name}
            </h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "1.25rem" }}>
              {gurdwara.address}
            </p>
            <ul className="space-y-2 mb-6">
              {gurdwara.events.map((e) => (
                <li key={e} style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                  <span style={{ color: "var(--color-gold-dim)", marginRight: "0.5rem" }}>·</span>
                  {e}
                </li>
              ))}
            </ul>
            {gurdwara.mapsUrl && (
              <a
                href={gurdwara.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "var(--text-sm)", color: "var(--color-gold)" }}
                className="underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                View on Map →
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
