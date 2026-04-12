import type { CeremonyGuideData } from "@/lib/faq-content";

interface CeremonyGuideProps {
  guide: CeremonyGuideData;
}

export function CeremonyGuide({ guide }: CeremonyGuideProps) {
  return (
    <div
      className="flex flex-col gap-4 rounded-lg p-6"
      style={{
        backgroundColor: "var(--color-surface)",
        borderTop: "3px solid var(--color-gold)",
      }}
    >
      {/* Header */}
      <div>
        <h3
          className="text-2xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
        >
          {guide.name}
        </h3>
        <p
          className="mt-1 text-sm tracking-wide uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          {guide.subtitle}
        </p>
      </div>

      {/* Divider */}
      <hr className="gold-rule" />

      {/* Description */}
      <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
        {guide.description}
      </p>

      {/* Details */}
      {guide.details.length > 0 && (
        <ul className="flex flex-col gap-1">
          {guide.details.map((detail) => (
            <li
              key={detail}
              className="text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              {detail}
            </li>
          ))}
        </ul>
      )}

      {/* What to know */}
      <div>
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-gold-dim)" }}
        >
          What to know
        </p>
        <ul className="flex flex-col gap-2">
          {guide.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2 text-sm">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: "var(--color-gold)" }}
                aria-hidden="true"
              />
              <span style={{ color: "var(--color-text)" }}>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
