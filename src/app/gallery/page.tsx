"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { db } from "@/lib/instant/db";
import { cld } from "@/lib/cloudflare";
import { useLotusBackground } from "@/lib/useLotusBackground";

export default function GalleryPage() {
  const lotusBg = useLotusBackground();
  const [lightbox, setLightbox] = useState<string | null>(null);

  const EXCLUDED_EVENTS = new Set(["hero", "ui-asset"]);

  const { isLoading, data } = db.useQuery({ $files: {} });
  const files = data?.$files ?? [];

  const photos = useMemo(() => {
    return files
      .filter((f) => (f as any).event && !EXCLUDED_EVENTS.has((f as any).event))
      .sort((a, b) => a.path.localeCompare(b.path))
      .map((f) => ({
        thumb: cld(f.url, { width: 600, quality: 80 }),
        full: cld(f.url, { width: 1800, quality: 90 }),
        event: (f as any).event as string,
      }));
  }, [files]);

  return (
    <div
      className="min-h-screen w-full pb-24"
      style={{
        backgroundImage: lotusBg
          ? [
              "linear-gradient(to bottom, rgba(8,28,22,0.55) 0%, rgba(8,28,22,0.55) 75%, rgba(8,28,22,0.85) 100%)",
              `url('${lotusBg}')`,
            ].join(", ")
          : "linear-gradient(to bottom, rgba(8,28,22,1) 0%, rgba(8,28,22,1) 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-5xl px-5 pt-32">
        <header className="mb-12 text-center">
          <p
            className="mb-3 text-xs tracking-[0.3em] uppercase font-medium"
            style={{
              color: "rgba(255,255,255,0.75)",
              textShadow: "0 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            Meghana &amp; Rajit
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontSize: "clamp(3rem, 8vw, 5rem)",
              fontWeight: 400,
              letterSpacing: "0.06em",
              lineHeight: 1.05,
              textShadow: "0 2px 12px rgba(0,0,0,0.7)",
            }}
          >
            Gallery
          </h1>
          <div
            className="mx-auto mt-5 h-px w-24"
            style={{ backgroundColor: "var(--color-gold-dim)", opacity: 0.6 }}
          />
        </header>

        {isLoading ? (
          <p
            className="text-center text-sm py-12"
            style={{ color: "var(--color-hero-muted)" }}
          >
            Loading photos…
          </p>
        ) : photos.length === 0 ? (
          <p
            className="text-center text-sm py-12"
            style={{ color: "var(--color-hero-muted)" }}
          >
            No photos found.
          </p>
        ) : (
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            }}
          >
            {photos.map(({ thumb, full }, i) => (
              <button
                key={i}
                onClick={() => setLightbox(full)}
                className="group relative overflow-hidden rounded-lg focus:outline-none"
                style={{
                  aspectRatio: "3 / 4",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Image
                  src={thumb}
                  alt={`Gallery photo ${i + 1}`}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                    <path d="M11 8v6M8 11h6" strokeLinecap="round" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 p-2 rounded-full transition-opacity hover:opacity-70"
            style={{ color: "white" }}
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
          <div
            className="relative"
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox}
              alt="Full size photo"
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
