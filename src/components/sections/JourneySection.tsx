"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { db } from "@/lib/instant/db";
import { cld } from "@/lib/cloudflare";

type Slide = { url: string; label: string; caption: string };

const EVENT_SLIDES: Record<string, { label: string; caption: string }> = {
  prom: {
    label: "Prom · June 2019",
    caption:
      "We started dating during our senior year of high school. The summer of 2019 was one of the best summers of our lives, but that fall we started long-distance as Meghana went to Cornell in Ithaca, NY and Rajit went to Georgia Tech in Atlanta, GA.",
  },
  proposal: {
    label: "Proposal · December 2025",
    caption:
      "When Rajit joined Meghana in SF in 2024, he realized he couldn't live without her anymore. He proposed December 13, 2025.",
  },
  nischitartham: {
    label: "Nischitartham · January 2026",
    caption:
      "We set the date for our wedding and started the process of joining our two families at the Nischitartham on January 4th.",
  },
  "engagement-shoot": {
    label: "Engagement Photos · March 2026",
    caption:
      "We're excited to start our lives together and can't wait to celebrate with everyone who helped make it possible.",
  },
};

const EVENT_ORDER = Object.keys(EVENT_SLIDES);

function Carousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const indexRef = useRef(0);

  const goTo = useCallback(
    (raw: number) => {
      if (!slides.length) return;
      const next = ((raw % slides.length) + slides.length) % slides.length;
      setOpacity(0);
      setTimeout(() => {
        setCurrent(next);
        indexRef.current = next;
        setOpacity(1);
      }, 180);
    },
    [slides.length],
  );

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
    <div
      className="mx-auto overflow-hidden rounded-xl select-none"
      style={{
        maxWidth: "480px",
        border: "1px solid var(--color-border-gold)",
        backgroundColor: "var(--color-surface)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Photo */}
      <div className="relative" style={{ aspectRatio: "4 / 5" }}>
        <div style={{ position: "absolute", inset: 0, opacity, transition: "opacity 0.35s ease" }}>
          <Image
            src={slides[current].url}
            alt="Our story"
            fill
            unoptimized
            className="object-cover"
            style={{ objectPosition: "center 20%" }}
            priority={current === 0}
            sizes="(max-width: 768px) 100vw, 480px"
          />
        </div>

        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "rgba(251, 245, 238, 0.88)",
            color: "var(--color-text)",
            backdropFilter: "blur(4px)",
            border: "1px solid var(--color-border-gold)",
          }}
          aria-label="Previous photo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "rgba(251, 245, 238, 0.88)",
            color: "var(--color-text)",
            backdropFilter: "blur(4px)",
            border: "1px solid var(--color-border-gold)",
          }}
          aria-label="Next photo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Text panel */}
      <div className="px-8 py-7" style={{ opacity, transition: "opacity 0.35s ease" }}>
        <p className="mb-3 text-xs tracking-[0.2em] uppercase" style={{ color: "var(--color-gold-dim)" }}>
          {slides[current].label}
        </p>
        <p className="text-base leading-relaxed" style={{ color: "var(--color-text-muted)", minHeight: "5rem" }}>
          {slides[current].caption}
        </p>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 pb-7">
        {slides.map((_, i) => (
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
  );
}

export function JourneySection() {
  const { isLoading, data } = db.useQuery({ $files: {} });
  const files = data?.$files ?? [];

  const slides = useMemo(() => {
    const byEvent = new Map<string, typeof files>();
    for (const f of files) {
      const event = (f as any).event as string | undefined;
      if (!event || !EVENT_ORDER.includes(event)) continue;
      if (!byEvent.has(event)) byEvent.set(event, []);
      byEvent.get(event)!.push(f);
    }
    return EVENT_ORDER.flatMap((event) => {
      const first = (byEvent.get(event) ?? []).sort((a, b) =>
        a.path.localeCompare(b.path),
      )[0];
      return first ? [{ url: cld(first.url), label: EVENT_SLIDES[event].label, caption: EVENT_SLIDES[event].caption }] : [];
    });
  }, [files]);

  return (
    <section
      id="story"
      className="w-full py-24 px-6"
      style={{ scrollMarginTop: "64px", backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "480px" }}>
        <header className="mb-14 text-center">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontSize: "var(--text-3xl)",
              fontWeight: 400,
            }}
          >
            Our Story
          </h2>
          <div
            className="mx-auto mt-5 h-px w-24"
            style={{ backgroundColor: "var(--color-border-gold)" }}
          />
        </header>

        {!isLoading && slides.length > 0 && <Carousel slides={slides} />}
      </div>
    </section>
  );
}
