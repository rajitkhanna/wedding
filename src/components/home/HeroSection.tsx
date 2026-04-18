"use client";

import Image from "next/image";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex h-screen min-h-[600px] items-end justify-center overflow-hidden"
    >
      <Image
        src="/hero.jpg"
        alt="Meghana and Rajit"
        fill
        className="object-cover"
        style={{ objectPosition: "center 55%" }}
        priority
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(18,6,8,0.05) 0%, rgba(18,6,8,0.2) 40%, rgba(18,6,8,0.88) 100%)",
        }}
      />
      <div className="relative z-10 pb-20 px-6 text-center">
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
          Meghana weds Rajit
        </h1>
        <p
          className="mt-5 t-label"
          style={{ color: "var(--color-text-muted)", letterSpacing: "var(--ls-caps)" }}
        >
          Nov 28, 2026
        </p>
        <p
          className="mt-2 t-label"
          style={{ color: "var(--color-text-dim)", letterSpacing: "var(--ls-caps)" }}
        >
          Boston, MA
        </p>
        <div className="mt-8">
          <a
            href="#rsvp"
            className="inline-block px-10 py-3 text-xs tracking-[0.25em] uppercase transition-all hover:opacity-80"
            style={{
              border: "1px solid var(--color-gold)",
              color: "var(--color-gold)",
            }}
          >
            RSVP
          </a>
        </div>
      </div>
    </section>
  );
}
