"use client";

import { TimelinePhoto } from "./TimelinePhoto";

interface StoryFile {
  id: string;
  path: string;
  url: string;
}

export interface ChapterData {
  id: string;
  prefix: string;
  title: string;
  era: string;
  photos: StoryFile[];
}

interface ChapterProps {
  chapter: ChapterData;
  isReversed: boolean;
  index: number;
}

export function Chapter({ chapter, isReversed, index }: ChapterProps) {
  const isNischitartham = chapter.id === "04";

  return (
    <div
      className={`flex flex-col gap-8 md:flex-row md:items-center md:gap-12 ${
        isReversed ? "md:flex-row-reverse" : ""
      }`}
      style={{ paddingTop: "4rem" }}
    >
      <div className="flex-1">
        <div
          className={`relative overflow-hidden rounded-lg p-6 ${
            isNischitartham ? "rounded-xl" : ""
          }`}
          style={{
            backgroundColor: isNischitartham
              ? "var(--color-surface-alt)"
              : "var(--color-surface)",
            border: `1px solid var(--color-border-gold)`,
          }}
        >
          <div className="mb-4">
            <h2
              className="text-3xl md:text-4xl"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-gold)",
              }}
            >
              {chapter.title}
            </h2>
            <p
              className="mt-2 text-sm tracking-wider uppercase"
              style={{ color: "var(--color-gold-dim)" }}
            >
              {chapter.era}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {chapter.photos.length > 0 ? (
          <TimelinePhoto src={chapter.photos[0].url} alt={chapter.title} />
        ) : (
          <div
            className="flex aspect-[4/3] items-center justify-center rounded-lg border-2 border-dashed"
            style={{
              borderColor: "var(--color-border-gold)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <PlaceholderOrnament />
          </div>
        )}
      </div>
    </div>
  );
}

function PlaceholderOrnament() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      style={{ color: "var(--color-gold-dim)" }}
    >
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M24 12v24M12 24h24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
