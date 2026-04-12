"use client";

import { useState } from "react";
import Image from "next/image";
import { db } from "@/lib/instant/db";

const GALLERY_CONFIG = [
  { path: "R5VN7937.jpg",      alt: "Meghana and Rajit",  span: "col-span-2 row-span-2", localSrc: "/photos/R5VN7937.jpg" },
  { path: "R6VN9843.jpg",      alt: "Strolling together",  span: "",                      localSrc: "/photos/R6VN9843.jpg" },
  { path: "RJF-08032.jpg",     alt: "Ceremony moment",    span: "",                      localSrc: "/photos/RJF-08032.jpg" },
  { path: "RJF-08390.jpg",     alt: "Couple portrait",    span: "",                      localSrc: "/photos/RJF-08390.jpg" },
  { path: "R5VN7788 copy.jpg", alt: "Elegant pose",       span: "col-span-2",            localSrc: "/photos/R5VN7788 copy.jpg" },
  { path: "R6VN9828.jpg",      alt: "Joyful moment",      span: "",                      localSrc: "/photos/R6VN9828.jpg" },
  { path: "R6VN0568.jpg",      alt: "Romantic portrait",  span: "row-span-2",            localSrc: "/photos/R6VN0568.jpg" },
  { path: "RJF-03982.jpg",     alt: "Wedding day",        span: "",                      localSrc: "/photos/RJF-03982.jpg" },
];

export function PhotoGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { data } = db.useQuery({ $files: {} });

  const urlMap = new Map<string, string>(
    (data?.$files ?? []).map((f: { path: string; url: string }) => [f.path, f.url])
  );

  const photos = GALLERY_CONFIG.map((item) => ({
    ...item,
    src: urlMap.get(item.path) ?? item.localSrc,
  }));

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
          {photos.map((photo, index) => (
            <button
              key={photo.src}
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
                src={photo.src}
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

            {selectedIndex < photos.length - 1 && (
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
                src={photos[selectedIndex].src}
                alt={photos[selectedIndex].alt}
                width={1200}
                height={800}
                className="object-contain rounded-lg"
                style={{ maxHeight: "85vh" }}
              />
              <p
                className="text-center mt-4 text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {photos[selectedIndex].alt}
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href="/story"
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
