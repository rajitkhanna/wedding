"use client";

import { db } from "@/lib/instant/db";
import Image from "next/image";
import { Timeline } from "@/components/story/Timeline";
import type { ChapterData } from "@/components/story/Chapter";

interface StoryFile {
  id: string;
  path: string;
  url: string;
}

const CHAPTERS = [
  {
    id: "01",
    title: "How It Started",
    era: "June 2019",
  },
  {
    id: "02",
    title: "The Proposal",
    era: "December 13, 2025",
  },
  {
    id: "03",
    title: "Nischitartham",
    era: "January 4, 2026",
  },
  {
    id: "04",
    title: "Engagement",
    era: "March 8, 2026",
  },
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

  // Sort each chapter's photos by path for consistent ordering
  for (const prefix of Object.keys(grouped)) {
    grouped[prefix].sort((a, b) => a.path.localeCompare(b.path));
  }

  return CHAPTERS.map((chapter) => ({
    ...chapter,
    prefix: chapter.id,
    photos: grouped[chapter.id] ?? [],
  }));
}

export default function Story() {
  const { isLoading, data } = db.useQuery({ $files: {} });

  if (isLoading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-solid"
          style={{
            borderColor: "var(--color-gold-dim)",
            borderTopColor: "var(--color-gold)",
          }}
        />
      </div>
    );
  }

  const files: StoryFile[] = data?.$files ?? [];
  const storyFiles = files.filter((f) => f.path.startsWith("story/"));
  const chapters = groupPhotosByChapter(storyFiles);
  const heroFile = files.find((f) => f.path === "home/hero-2.jpg");
  const heroUrl = heroFile?.url ?? "/photos/R5VN8026-3.jpg";
  const hasChapters = chapters.some((c) => c.photos.length > 0);

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <header className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,5,8,0.3) 0%, rgba(10,5,8,0.9) 100%)",
          }}
        />
        <Image
          src={heroUrl}
          alt="Meghana and Rajit"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="relative z-10 text-center px-6">
          <p
            className="text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: "var(--color-gold)" }}
          >
            Our Journey
          </p>
          <h1
            className="text-5xl md:text-7xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
              fontWeight: 400,
            }}
          >
            Our Story
          </h1>
          <p
            className="mt-4 text-lg italic"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-muted)",
            }}
          >
            from high school sweethearts to forever
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16">
        {!hasChapters ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              className="mb-4 opacity-40"
            >
              <circle
                cx="32"
                cy="32"
                r="30"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M32 18v28M18 32h28"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-sm tracking-wide">Photos coming soon</p>
          </div>
        ) : (
          <Timeline chapters={chapters} />
        )}
      </div>
    </div>
  );
}
