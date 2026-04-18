"use client";

import { useState } from "react";
import Image from "next/image";
import { db } from "@/lib/instant/db";

interface PhotoItem {
  path: string;
  url: string;
  alt: string;
  span: string;
}

function getSpanClass(index: number): string {
  if (index === 0) return "col-span-2 row-span-2";
  if (index === 4) return "col-span-2";
  if (index === 7) return "row-span-2";
  return "";
}

function getAltFromPath(path: string): string {
  const name = path.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ");
  if (name.includes("RJF")) return "Wedding moment";
  if (name.includes("R5VN")) return "Couple portrait";
  if (name.includes("R6VN")) return "Romantic moment";
  if (name.includes("hero")) return "Wedding photo";
  return name;
}

export function PhotoGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { data } = db.useQuery({ $files: {} });

  const allFiles: PhotoItem[] = (data?.$files ?? [])
    .filter(
      (f: { path: string }) =>
        !f.path.startsWith("story/") && !f.path.startsWith("home/"),
    )
    .map((f: { path: string; url: string }, i: number) => ({
      path: f.path,
      url: f.url,
      alt: getAltFromPath(f.path),
      span: getSpanClass(i),
    }))
    .sort((a: PhotoItem, b: PhotoItem) => {
      const aHero = a.path.includes("hero") ? 0 : 1;
      const bHero = b.path.includes("hero") ? 0 : 1;
      if (aHero !== bHero) return aHero - bHero;
      return a.path.localeCompare(b.path);
    });

  if (allFiles.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: "var(--color-gold)" }}
          >
            Our Story
          </p>
          <h2
            className="text-4xl md:text-5xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
              fontWeight: 400,
            }}
          >
            Moments Together
          </h2>
          <div
            className="mx-auto mt-6 h-px w-24"
            style={{ backgroundColor: "var(--color-border-gold)" }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {allFiles.map((photo, index) => (
            <button
              key={photo.path}
              onClick={() => setSelectedIndex(index)}
              className={`relative overflow-hidden rounded-lg group cursor-pointer ${photo.span}`}
              style={{
                aspectRatio: photo.span.includes("row-span-2") ? "3/4" : "1/1",
                minHeight: photo.span.includes("row-span-2")
                  ? "300px"
                  : "150px",
              }}
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)",
                }}
              >
                <div
                  className="absolute bottom-3 left-3 right-3"
                  style={{ color: "var(--color-text)" }}
                >
                  <p className="text-xs font-light">{photo.alt}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedIndex !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(10, 5, 8, 0.95)" }}
            onClick={() => setSelectedIndex(null)}
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

            {selectedIndex > 0 && (
              <button
                className="absolute left-4 p-3 rounded-full transition-opacity hover:opacity-70"
                style={{ color: "var(--color-gold)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(selectedIndex - 1);
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

            {selectedIndex < allFiles.length - 1 && (
              <button
                className="absolute right-4 p-3 rounded-full transition-opacity hover:opacity-70"
                style={{ color: "var(--color-gold)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(selectedIndex + 1);
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
              <Image
                src={allFiles[selectedIndex].url}
                alt={allFiles[selectedIndex].alt}
                width={1200}
                height={800}
                className="object-contain rounded-lg"
                style={{ maxHeight: "85vh" }}
              />
              <p
                className="text-center mt-4 text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {allFiles[selectedIndex].alt}
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href="#story"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase transition-all hover:gap-4"
            style={{ color: "var(--color-gold)" }}
          >
            <span>Read our story</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
