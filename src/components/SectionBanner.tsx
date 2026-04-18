"use client";

import Image from "next/image";
import { db } from "@/lib/instant/db";

interface SectionBannerProps {
  /** Path substring to match — e.g. "palace", "venue/", "ceremony/" */
  match: string;
  /** Fallback if nothing matches */
  fallbackMatch?: string;
  height?: string;
}

export function SectionBanner({
  match,
  fallbackMatch,
  height = "30vh",
}: SectionBannerProps) {
  const { data } = db.useQuery({ $files: {} });
  const files: { path: string; url: string }[] = data?.$files ?? [];

  const photo =
    files.find((f) => f.path.toLowerCase().includes(match.toLowerCase())) ??
    (fallbackMatch
      ? files.find((f) =>
          f.path.toLowerCase().includes(fallbackMatch.toLowerCase()),
        )
      : undefined);

  if (!photo) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height }}
      aria-hidden="true"
    >
      <Image
        src={photo.url}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(18,6,8,0.15) 0%, rgba(18,6,8,0.65) 100%)",
        }}
      />
    </div>
  );
}
