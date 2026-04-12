"use client";

import Link from "next/link";

const NAV_CARDS = [
  {
    href: "/story",
    label: "Our Story",
    description: "How two families became one",
    icon: "❧",
  },
  {
    href: "/schedule",
    label: "Schedule",
    description: "Ceremony & celebration details",
    icon: "◈",
  },
  {
    href: "/travel-stay",
    label: "Travel & Stay",
    description: "Getting here & where to stay",
    icon: "◉",
  },
  {
    href: "/registry",
    label: "Registry",
    description: " Gifts or cash — thank you!",
    icon: "♥",
  },
] as const;

export function NavCards() {
  return (
    <section
      className="mx-auto max-w-5xl px-6 py-16"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {NAV_CARDS.map((card) => (
          <Link key={card.href} href={card.href} className="group block">
            <div
              className="flex h-full flex-col items-center gap-3 rounded-lg border px-6 py-8 text-center
                         transition-all duration-300
                         group-hover:-translate-y-1"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border-gold)",
                boxShadow: "0 0 0 0 transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "var(--color-gold)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 0 20px rgba(201,168,76,0.18), 0 4px 24px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "var(--color-border-gold)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 0 0 0 transparent";
              }}
            >
              <span
                className="text-3xl"
                style={{ color: "var(--color-gold)", lineHeight: 1 }}
                aria-hidden
              >
                {card.icon}
              </span>
              <h2
                className="text-xl tracking-widest"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-gold)",
                }}
              >
                {card.label}
              </h2>
              <p
                className="text-sm font-light leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
