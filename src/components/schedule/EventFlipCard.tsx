"use client";

import { AttireLink } from "@/components/AttireLink";

type EventShape = {
  id: string;
  title: string;
  day: string;
  startTime: string;
  endTime?: string;
  location?: string;
  locationUrl?: string;
  dressCode?: string;
  description?: string;
  informational?: boolean;
  sortOrder: number;
};

/** Contextual attire question for an event's dress code (null when none applies). */
function attireHintFor(dressCode?: string): { label: string } | null {
  const d = (dressCode ?? "").toLowerCase();
  if (!d) return null;
  const indian = d.includes("indian");
  const western = d.includes("western");
  if (indian && !western)
    return { label: "What is traditional Indian attire?" };
  if (western) return { label: "What should I wear?" };
  return null;
}

function ClockIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7v5l3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="9"
      height="12"
      viewBox="0 0 12 14"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <path
        d="M6 0C3.79 0 2 1.79 2 4c0 3 4 8.5 4 8.5S10 7 10 4c0-2.21-1.79-4-4-4zm0 5.5C5.17 5.5 4.5 4.83 4.5 4S5.17 2.5 6 2.5 7.5 3.17 7.5 4 6.83 5.5 6 5.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShirtIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <path
        d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10a2 2 0 002 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EventFlipCard({
  event,
  names,
  isSingle,
}: {
  event: EventShape;
  names: string[];
  isSingle: boolean;
}) {
  const attireHint = attireHintFor(event.dressCode);
  const metaColor = "var(--color-text-muted)";

  return (
    <article
      className="group relative rounded-[3px] transition-all duration-300 hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 1px 2px rgba(10, 51, 35, 0.04)",
      }}
    >
      <div className="px-6 py-6 sm:px-7">
        {/* Time kicker */}
        <p
          className="mb-2.5 flex items-center gap-2 text-[0.7rem] font-medium uppercase"
          style={{
            color: "var(--color-gold-dim)",
            letterSpacing: "0.18em",
          }}
        >
          <ClockIcon />
          {event.startTime}
          {event.endTime && (
            <>
              <span aria-hidden style={{ opacity: 0.5 }}>
                —
              </span>
              {event.endTime}
            </>
          )}
        </p>

        {/* Title */}
        <h3
          className="leading-snug"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            color: "var(--color-text)",
            fontWeight: 400,
            letterSpacing: "var(--ls-normal)",
          }}
        >
          {event.title}
        </h3>

        {event.description && (
          <div className="mt-2 flex flex-col gap-0.5">
            {event.description.split("\\n").map((line, i) => (
              <p
                key={i}
                className="text-xs leading-relaxed"
                style={{ color: metaColor }}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Details */}
        {(event.dressCode ||
          event.location ||
          (!isSingle && names.length > 0)) && (
          <div
            className="mt-5 flex flex-col gap-2 border-t pt-4"
            style={{ borderColor: "var(--color-border)", color: metaColor }}
          >
            {event.dressCode && (
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs">
                <span className="flex items-center gap-1.5">
                  <span style={{ color: "var(--color-gold-dim)" }}>
                    <ShirtIcon />
                  </span>
                  <span
                    className="uppercase"
                    style={{
                      color: "var(--color-text-dim)",
                      letterSpacing: "0.14em",
                      fontSize: "0.6rem",
                    }}
                  >
                    Dress code
                  </span>
                  {event.dressCode}
                </span>
                {attireHint && (
                  <>
                    <span
                      aria-hidden
                      style={{ color: "var(--color-border-gold)" }}
                    >
                      ·
                    </span>
                    <AttireLink
                      label={attireHint.label}
                      showIcon={false}
                      className="inline-flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
                    />
                  </>
                )}
              </div>
            )}

            {event.location && (
              <p className="flex items-start gap-1.5 text-xs leading-relaxed">
                <span
                  style={{
                    color: "var(--color-gold-dim)",
                    paddingTop: "2px",
                  }}
                >
                  <PinIcon />
                </span>
                {event.locationUrl ? (
                  <a
                    href={event.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors"
                    style={{
                      color: metaColor,
                      textDecoration: "underline",
                      textDecorationColor: "var(--color-border-gold)",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    {event.location}
                  </a>
                ) : (
                  event.location
                )}
              </p>
            )}

            {!isSingle && names.length > 0 && (
              <p className="text-xs leading-relaxed">
                <span
                  className="uppercase"
                  style={{
                    color: "var(--color-text-dim)",
                    letterSpacing: "0.14em",
                    fontSize: "0.65rem",
                  }}
                >
                  With
                </span>{" "}
                <span style={{ color: metaColor }}>{names.join(" · ")}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
