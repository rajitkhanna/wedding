"use client";

import { useEffect } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { RegistrySection } from "@/components/sections/RegistrySection";
import { ScheduleSummarySection } from "@/components/sections/ScheduleSummarySection";
import { db } from "@/lib/instant/db";
import { cld } from "@/lib/cloudflare";
import { useLotusBackground } from "@/lib/useLotusBackground";

function Divider() {
  return (
    <div className="flex items-center justify-center py-4">
      <div
        className="h-px w-24"
        style={{ backgroundColor: "var(--color-border-gold)", opacity: 0.35 }}
      />
    </div>
  );
}

function LotusDivider() {
  const { data } = db.useQuery({ $files: {} });
  const file = (data?.$files ?? []).find((f) =>
    f.path.toLowerCase().includes("removebg"),
  );
  const src = file ? cld(file.url) : "/blue_lotus_circle-removebg-preview.png";

  return (
    <div
      className="flex items-center justify-center py-2"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        style={{
          width: "clamp(100px, 16vw, 180px)",
          height: "auto",
          opacity: 0.9,
        }}
      />
    </div>
  );
}

export default function Home() {
  const lotusBg = useLotusBackground();

  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main style={{ backgroundColor: "var(--color-bg)" }}>
      <HeroSection />
      <Divider />
      <JourneySection />
      <Divider />
      <ScheduleSummarySection />
      <LotusDivider />

      <div
        style={{
          backgroundImage: lotusBg
            ? [
                "linear-gradient(to bottom, var(--color-bg) 0%, var(--color-bg) 55%, rgba(8,28,22,0.55) 100%)",
                `url('${lotusBg}')`,
              ].join(", ")
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }}
      >
        <FAQSection />
      </div>
      {/* <Divider />
      <RegistrySection /> */}
    </main>
  );
}
