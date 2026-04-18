"use client";

import { useState } from "react";
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
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
              <p
                className="mt-3 text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {chapter.photos.length} photo
                {chapter.photos.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {chapter.photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {chapter.photos.map((photo, i) => (
                <button
                  key={photo.id}
                  onClick={() => setLightboxIndex(i)}
                  className="overflow-hidden rounded-lg transition-transform hover:scale-[1.02]"
                >
                  <TimelinePhoto src={photo.url} alt={chapter.title} />
                </button>
              ))}
            </div>
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

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(10, 5, 8, 0.95)" }}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full transition-opacity hover:opacity-70"
            style={{ color: "var(--color-text-muted)" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 p-3 rounded-full transition-opacity hover:opacity-70"
              style={{ color: "var(--color-gold)" }}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {lightboxIndex < chapter.photos.length - 1 && (
            <button
              className="absolute right-4 p-3 rounded-full transition-opacity hover:opacity-70"
              style={{ color: "var(--color-gold)" }}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M9 18l6-6-6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          <div
            className="relative max-w-4xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={chapter.photos[lightboxIndex].url}
              alt={chapter.title}
              className="object-contain rounded-lg w-full"
              style={{ maxHeight: "85vh" }}
            />
            <p
              className="text-center mt-4 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              {lightboxIndex + 1} / {chapter.photos.length}
            </p>
          </div>
        </div>
      )}
    </>
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
