"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/instant/db";
import { cld } from "@/lib/cloudflare";

const HERO_IMAGE_ORDER = [
  "hero/colonnade-smiling-cover",
  "hero/close-portrait-wall",
  "hero/telugu-saree",
  "hero/prom-2019",
  "hero/proposal-after-showing-ring",
  "hero/couple-with-garlands",
  "hero/under-the-arch-walking",
];

const HERO_IMAGE_OFFSETS: Record<string, string> = {
  "hero/proposal-after-showing-ring": "translateY(4%)",
};

export function HeroSection() {
  const router = useRouter();
  const { data } = db.useQuery({
    $files: { $: { where: { path: { $like: "hero/%" } } } },
  });
  const files = data?.$files ?? [];

  const heroSlides = useMemo(() => {
    return HERO_IMAGE_ORDER.flatMap((pattern) => {
      const file = files.find((f) => f.path.startsWith(pattern));
      return file
        ? [{ src: cld(file.url, { width: 900, quality: 80 }), pattern }]
        : [];
    });
  }, [files]);

  // Fall back to local public files during dev if InstantDB has no images yet
  const slides =
    heroSlides.length > 0
      ? heroSlides
      : HERO_IMAGE_ORDER.map((pattern) => {
          const filename = pattern.replace("hero/", "");
          const ext =
            filename === "prom-2019" ||
            filename === "proposal-after-showing-ring"
              ? "jpeg"
              : "jpg";
          const localFile =
            filename === "colonnade-smiling-cover" ? "hero" : filename;
          return { src: `/${localFile}.${ext}`, pattern };
        });

  const looped = [...slides, ...slides];

  return (
    <section id="hero" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="relative overflow-hidden" style={{ minHeight: "86vh" }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="hero-filmstrip h-full">
            {looped.map(({ src, pattern }, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${src}-${idx}`}
                src={src}
                alt="Meghana and Rajit"
                className="hero-filmstrip-frame"
                loading={idx < slides.length ? "eager" : "lazy"}
                style={{ transform: HERO_IMAGE_OFFSETS[pattern] ?? "none" }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="px-6 py-10 text-center sm:py-12"
        style={{
          backgroundColor: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-5xl">
          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
              fontSize: "var(--text-hero)",
              fontWeight: 400,
              letterSpacing: "var(--ls-wide)",
              lineHeight: "var(--lh-tight)",
            }}
          >
            Meghana and Rajit
          </h1>
          <p
            className="mt-5 t-label"
            style={{
              color: "var(--color-text-muted)",
              letterSpacing: "var(--ls-caps)",
            }}
          >
            Nov 27 to 29, 2026
          </p>
          <p
            className="mt-2 t-label"
            style={{
              color: "var(--color-text-dim)",
              letterSpacing: "var(--ls-caps)",
            }}
          >
            Boston, MA
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={() => router.push("/rsvp")}
              className="inline-block cursor-pointer px-10 py-3 text-xs tracking-[0.25em] uppercase transition-all hover:opacity-80"
              style={{
                border: "1px solid var(--color-gold)",
                backgroundColor: "var(--color-gold)",
                color: "var(--color-bg)",
                boxShadow: "0 10px 28px var(--color-shadow-soft)",
              }}
            >
              RSVP
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
