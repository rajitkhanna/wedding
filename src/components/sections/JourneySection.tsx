"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const SLIDES = [
  "/photos/prom/prom-2019.jpeg",
  "/photos/proposal/proposal-kneeling.jpeg",
  "/photos/proposal/proposal-after-showing-ring.jpeg",
  "/photos/nischitartham/couple-with-garlands.jpg",
  "/photos/engagement/under-the-arch-walking.jpg",
  "/photos/engagement/close-portrait-wall.jpg",
];

export function JourneySection() {
  const [current, setCurrent] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const indexRef = useRef(0);

  const goTo = useCallback((raw: number) => {
    const next = ((raw % SLIDES.length) + SLIDES.length) % SLIDES.length;
    setOpacity(0);
    setTimeout(() => {
      setCurrent(next);
      indexRef.current = next;
      setOpacity(1);
    }, 180);
  }, []);

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  useEffect(() => {
    if (isHovered) return;
    const t = setTimeout(() => goTo(indexRef.current + 1), 6000);
    return () => clearTimeout(t);
  }, [current, isHovered, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <section
      id="story"
      className="w-full py-24 px-6"
      style={{ scrollMarginTop: "64px", backgroundColor: "var(--color-bg)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto" style={{ maxWidth: "480px" }}>
        {/* Section header */}
        <header className="mb-14 text-center">
          <p className="mb-3 t-label" style={{ color: "var(--color-text-muted)", letterSpacing: "var(--ls-caps)" }}>
            Our Story
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)", fontSize: "var(--text-3xl)", fontWeight: 400 }}>
            Every Chapter
          </h2>
          <div className="mx-auto mt-5 h-px w-24" style={{ backgroundColor: "var(--color-border-gold)" }} />
        </header>

        {/* Carousel */}
        <div className="relative select-none">
          <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "4 / 5" }}>
            <div style={{ position: "absolute", inset: 0, opacity, transition: "opacity 0.35s ease" }}>
              <Image
                src={SLIDES[current]}
                alt="Our story"
                fill
                className="object-cover"
                style={{ objectPosition: "center 20%" }}
                priority={current === 0}
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute -left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-opacity hover:opacity-80"
            style={{ backgroundColor: "rgba(18,6,8,0.6)", color: "var(--color-text)", backdropFilter: "blur(4px)", border: "1px solid var(--color-border-gold)" }}
            aria-label="Previous photo"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={next}
            className="absolute -right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-opacity hover:opacity-80"
            style={{ backgroundColor: "rgba(18,6,8,0.6)", color: "var(--color-text)", backdropFilter: "blur(4px)", border: "1px solid var(--color-border-gold)" }}
            aria-label="Next photo"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to photo ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === current ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: i === current ? "var(--color-gold)" : "var(--color-border-gold)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
