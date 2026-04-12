"use client";

import { useState } from "react";

interface TimelinePhotoProps {
  src: string;
  alt: string;
}

export function TimelinePhoto({ src, alt }: TimelinePhotoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="timeline-photo relative overflow-hidden rounded-sm transition-all duration-300"
      style={{
        border: "2px solid var(--color-border-gold)",
        boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.3)",
        aspectRatio: "3/4",
      }}
    >
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <div
            className="h-4 w-4 animate-pulse rounded-full"
            style={{ backgroundColor: "var(--color-gold-dim)" }}
          />
        </div>
      )}

      {hasError ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            style={{ color: "var(--color-gold-dim)" }}
          >
            <rect
              x="4"
              y="6"
              width="24"
              height="18"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle
              cx="11"
              cy="13"
              r="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M4 20l6-5 4 4 5-5 9 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`h-full w-full object-cover transition-all duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: isLoaded ? "scale(1)" : "scale(1.05)",
          }}
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(135deg, transparent 60%, rgba(201, 168, 76, 0.1) 100%)",
          opacity: 0,
        }}
      />

    </div>
  );
}
