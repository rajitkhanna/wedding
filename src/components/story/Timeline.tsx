"use client";

import { useEffect, useRef } from "react";
import { Chapter, type ChapterData } from "./Chapter";

interface TimelineProps {
  chapters: ChapterData[];
}

export function Timeline({ chapters }: TimelineProps) {
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15 },
    );

    chapterRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [chapters]);

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2"
        style={{ backgroundColor: "var(--color-gold-dim)" }}
      />

      {chapters.map((chapter, index) => (
        <div
          key={chapter.id}
          ref={(el) => {
            chapterRefs.current[index] = el;
          }}
          className="timeline-chapter relative mb-24 opacity-0 translate-y-8 transition-all duration-700 ease-out"
          data-index={index}
        >
          <div
            className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
            style={{ backgroundColor: "var(--color-gold)" }}
          />

          <span
            className="absolute left-1/2 mb-2 -translate-x-1/2 text-xs tracking-widest uppercase"
            style={{
              color: "var(--color-gold)",
              top: "calc(1.5rem + 0.75rem)",
            }}
          >
            {chapter.era}
          </span>

          <Chapter
            chapter={chapter}
            isReversed={index % 2 === 1}
            index={index}
          />
        </div>
      ))}

    </div>
  );
}
