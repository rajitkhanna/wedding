import Link from "next/link";
import { ATTIRE_FAQ_HREF } from "@/lib/faq-content";

/**
 * Clear "what to wear" link, pointing at the attire FAQ section.
 * Used from the RSVP events and the schedule so guests can jump straight
 * to the guidance instead of asking.
 *
 * `tone`:
 *  - "light" (default) for light backgrounds → gold-dim
 *  - "dark" for dark backgrounds (RSVP page) → gold
 */
export function AttireLink({
  tone = "light",
  className,
  label = "What to wear",
  href = ATTIRE_FAQ_HREF,
  showIcon = true,
}: {
  tone?: "light" | "dark";
  className?: string;
  /** Link text — override for a contextual question (e.g. "What is traditional Indian attire?"). */
  label?: string;
  /** Link target — defaults to the attire FAQ. */
  href?: string;
  /** Hide the leading shirt icon (e.g. when the row already shows one). */
  showIcon?: boolean;
}) {
  const color = tone === "dark" ? "var(--color-gold)" : "var(--color-gold-dim)";

  return (
    <Link
      href={href}
      className={
        className ??
        "inline-flex items-center gap-1.5 text-xs tracking-[0.1em] uppercase transition-opacity hover:opacity-70"
      }
      style={{ color }}
    >
      {showIcon && (
        <svg
          width="12"
          height="12"
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
      )}
      {label}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
