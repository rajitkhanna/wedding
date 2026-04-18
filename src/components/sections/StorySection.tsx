"use client";

import { db } from "@/lib/instant/db";
import { Timeline } from "@/components/story/Timeline";
import type { ChapterData } from "@/components/story/Chapter";

interface StoryFile {
  id: string;
  path: string;
  url: string;
}

const CHAPTERS = [
  { id: "01", title: "How It Started", era: "June 2019" },
  { id: "02", title: "The Proposal", era: "December 13, 2025" },
  { id: "03", title: "Engagement", era: "March 8, 2026" },
  { id: "04", title: "Nischitartham", era: "January 4, 2026" },
];

function groupPhotosByChapter(files: StoryFile[]): ChapterData[] {
  const grouped: Record<string, StoryFile[]> = {};
  for (const file of files) {
    const match = file.path.match(/^story\/(\d+)-/);
    if (match) {
      const prefix = match[1];
      if (!grouped[prefix]) grouped[prefix] = [];
      grouped[prefix].push(file);
    }
  }
  for (const prefix of Object.keys(grouped)) {
    grouped[prefix].sort((a, b) => a.path.localeCompare(b.path));
  }
  return CHAPTERS.map((chapter) => ({
    ...chapter,
    prefix: chapter.id,
    photos: grouped[chapter.id] ?? [],
  }));
}

export function StorySection() {
  const { isLoading, data } = db.useQuery({ $files: {} });

  const files: StoryFile[] = data?.$files ?? [];
  const storyFiles = files.filter((f) => f.path.startsWith("story/"));
  const chapters = groupPhotosByChapter(storyFiles);
  const hasChapters = chapters.some((c) => c.photos.length > 0);

  return (
    <section
      id="story"
      className="w-full py-24 px-6"
      style={{ backgroundColor: "var(--color-bg)", scrollMarginTop: "64px" }}
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 text-center">
          <p
            className="text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: "var(--color-gold)" }}
          >
            Our Journey
          </p>
          <h2
            className="text-5xl md:text-6xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
              fontWeight: 400,
            }}
          >
            Our Story
          </h2>
          <p
            className="mt-4 text-lg italic"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-muted)",
            }}
          >
            from high school sweethearts to forever
          </p>
          <div
            className="mx-auto mt-6 h-px w-24"
            style={{ backgroundColor: "var(--color-border-gold)" }}
          />
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-solid"
              style={{
                borderColor: "var(--color-gold-dim)",
                borderTopColor: "var(--color-gold)",
              }}
            />
          </div>
        ) : !hasChapters ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            <p className="text-sm tracking-wide">Photos coming soon</p>
          </div>
        ) : (
          <Timeline chapters={chapters} />
        )}
      </div>
    </section>
  );
}
