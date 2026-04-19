"use client";

const HERO_SLIDES = [
  "/hero.jpg",
  "/close-portrait-wall.jpg",
  "/prom-2019.jpeg",
  "/proposal-after-showing-ring.jpeg",
  "/couple-with-garlands.jpg",
  "/under-the-arch-walking.jpg",
];

const HERO_IMAGE_OFFSETS: Partial<Record<(typeof HERO_SLIDES)[number], string>> = {
  "/proposal-after-showing-ring.jpeg": "translateY(4%)",
};

const LOOPED_SLIDES = [...HERO_SLIDES, ...HERO_SLIDES];

export function HeroSection({ onRSVPClick }: { onRSVPClick: () => void }) {
  return (
    <section id="hero" style={{ backgroundColor: "var(--color-bg)" }}>
      <div
        className="relative overflow-hidden"
        style={{ minHeight: "86vh" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="hero-filmstrip h-full">
            {LOOPED_SLIDES.map((src, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${src}-${idx}`}
                src={src}
                alt="Meghana and Rajit"
                className="hero-filmstrip-frame"
                loading={idx < HERO_SLIDES.length ? "eager" : "lazy"}
                style={{
                  transform: HERO_IMAGE_OFFSETS[src] ?? "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="px-6 py-10 text-center sm:py-12"
        style={{
          backgroundColor: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
              fontSize: "var(--text-hero)",
              fontWeight: 400,
              letterSpacing: "var(--ls-wide)",
              lineHeight: "var(--lh-tight)",
            }}
          >
            Meghana and Rajit
          </h1>
          <p
            className="mt-5 t-label"
            style={{
              color: "var(--color-text-muted)",
              letterSpacing: "var(--ls-caps)",
            }}
          >
            Nov 27 to 29, 2026
          </p>
          <p
            className="mt-2 t-label"
            style={{
              color: "var(--color-text-dim)",
              letterSpacing: "var(--ls-caps)",
            }}
          >
            Boston, MA
          </p>

          <div className="mt-8">
            <button
              type="button"
              onClick={onRSVPClick}
              className="inline-block cursor-pointer px-10 py-3 text-xs tracking-[0.25em] uppercase transition-all hover:opacity-80"
              style={{
                border: "1px solid var(--color-gold)",
                backgroundColor: "var(--color-gold)",
                color: "var(--color-bg)",
                boxShadow: "0 10px 28px var(--color-shadow-soft)",
              }}
            >
              RSVP
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
