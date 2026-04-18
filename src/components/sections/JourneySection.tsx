"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { db } from "@/lib/instant/db";

interface Slide {
  url: string;
  path: string;
  chapterKey: string;
  chapterTitle: string;
  era: string;
  caption: string;
}

interface Chapter {
  id: string;
  title: string;
  era: string;
  caption: string;
}

const STORY_CHAPTERS: Chapter[] = [
  {
    id: "01",
    title: "How It Started",
    era: "June 2019",
    caption:
      "We first met in high school — two students who had no idea what they were starting. What began as friendship became something neither of us saw coming, and everything we're grateful for.",
  },
  {
    id: "02",
    title: "The Proposal",
    era: "December 13, 2025",
    caption:
      "Six years after we met, on a cold December evening, Rajit got down on one knee. One question changed everything. She said yes.",
  },
  {
    id: "03",
    title: "Engagement",
    era: "March 8, 2026",
    caption:
      "A celebration with the people who've loved us through it all — dinners, late nights, moves across the country, and everything in between. The room was full and so were our hearts.",
  },
  {
    id: "04",
    title: "Nischitartham",
    era: "January 4, 2026",
    caption:
      "In a traditional Telugu ceremony surrounded by both families, we made our commitment official. The beginning of two families becoming one.",
  },
];

const GALLERY_CHAPTER: Chapter = {
  id: "gallery",
  title: "Together",
  era: "Along the Way",
  caption:
    "Portraits of us — captured between the milestones, in the quiet spaces where love actually lives.",
};

function buildSlides(files: { path: string; url: string }[]): Slide[] {
  const slides: Slide[] = [];

  for (const chapter of STORY_CHAPTERS) {
    const chapterFiles = files
      .filter((f) => f.path.match(new RegExp(`^story/${chapter.id}-`)))
      .sort((a, b) => a.path.localeCompare(b.path));
    for (const file of chapterFiles) {
      slides.push({
        url: file.url,
        path: file.path,
        chapterKey: chapter.id,
        chapterTitle: chapter.title,
        era: chapter.era,
        caption: chapter.caption,
      });
    }
  }

  const galleryFiles = files
    .filter((f) => !f.path.startsWith("story/") && !f.path.startsWith("home/"))
    .sort((a, b) => a.path.localeCompare(b.path));
  for (const file of galleryFiles) {
    slides.push({
      url: file.url,
      path: file.path,
      chapterKey: GALLERY_CHAPTER.id,
      chapterTitle: GALLERY_CHAPTER.title,
      era: GALLERY_CHAPTER.era,
      caption: GALLERY_CHAPTER.caption,
    });
  }

  return slides;
}

export function JourneySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const indexRef = useRef(0);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data } = db.useQuery({ $files: {} });
  const allFiles: { path: string; url: string }[] = data?.$files ?? [];
  const slides = buildSlides(allFiles);
  const slidesLenRef = useRef(slides.length);
  slidesLenRef.current = slides.length;

  const hasGallery = slides.some((s) => s.chapterKey === GALLERY_CHAPTER.id);
  const allChapters: Chapter[] = [
    ...STORY_CHAPTERS,
    ...(hasGallery ? [GALLERY_CHAPTER] : []),
  ];

  const currentSlide = slides[currentIndex] ?? null;

  const goTo = useCallback((rawIndex: number) => {
    const len = slidesLenRef.current;
    if (len === 0) return;
    const next = ((rawIndex % len) + len) % len;
    setOpacity(0);
    setTimeout(() => {
      setCurrentIndex(next);
      indexRef.current = next;
      setOpacity(1);
    }, 180);
  }, []);

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  useEffect(() => {
    if (slides.length === 0 || isHovered) return;
    autoRef.current = setTimeout(() => goTo(indexRef.current + 1), 6000);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isHovered, goTo]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  if (slides.length === 0) return null;

  return (
    <section
      id="story"
      className="w-full py-24 px-6"
      style={{ scrollMarginTop: "64px", backgroundColor: "var(--color-bg)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-3xl">
        {/* Section header */}
        <header className="mb-14 text-center">
          <p
            className="mb-3 t-label"
            style={{ color: "var(--color-text-muted)", letterSpacing: "var(--ls-caps)" }}
          >
            Our Story
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontSize: "var(--text-3xl)",
              fontWeight: 400,
            }}
          >
            Every Chapter
          </h2>
          <div className="mx-auto mt-5 h-px w-24" style={{ backgroundColor: "var(--color-border-gold)" }} />
        </header>

        {/* Photo card + nav */}
        <div className="relative select-none" style={{ maxWidth: "480px", margin: "0 auto" }}>
          {/* Image */}
          <div
            className="relative overflow-hidden rounded-xl"
            style={{ aspectRatio: "4 / 5" }}
          >
            {currentSlide && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity,
                  transition: "opacity 0.35s ease",
                }}
              >
                <Image
                  src={currentSlide.url}
                  alt={currentSlide.chapterTitle}
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center 20%" }}
                  priority={currentIndex === 0}
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              </div>
            )}
          </div>

          {/* Prev arrow */}
          <button
            onClick={prev}
            className="absolute -left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "rgba(18,6,8,0.6)",
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

          {/* Next arrow */}
          <button
            onClick={next}
            className="absolute -right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "rgba(18,6,8,0.6)",
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

        {/* Caption */}
        {currentSlide && (
          <div
            key={currentSlide.chapterKey}
            className="mt-10 text-center"
            style={{ animation: "journey-caption-in 0.4s ease forwards" }}
          >
            <p
              className="t-label mb-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              {currentSlide.era}
            </p>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-gold)",
                fontSize: "var(--text-2xl)",
                fontWeight: 400,
                marginBottom: "1rem",
              }}
            >
              {currentSlide.chapterTitle}
            </h3>
            <p
              className="mx-auto"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--color-text-muted)",
                lineHeight: 1.8,
                maxWidth: "52ch",
              }}
            >
              {currentSlide.caption}
            </p>
          </div>
        )}

        {/* Dots + counter */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {allChapters.map((chapter) => {
            const isActive = currentSlide?.chapterKey === chapter.id;
            const firstIndex = slides.findIndex((s) => s.chapterKey === chapter.id);
            return (
              <button
                key={chapter.id}
                onClick={() => goTo(firstIndex)}
                aria-label={`Go to ${chapter.title}`}
                className="transition-all duration-300"
                style={{
                  width: isActive ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: isActive
                    ? "var(--color-gold)"
                    : "var(--color-border-gold)",
                  flexShrink: 0,
                }}
              />
            );
          })}
          <span
            className="ml-2 tabular-nums"
            style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
          >
            {currentIndex + 1} / {slides.length}
          </span>
        </div>
      </div>
    </section>
  );
}
