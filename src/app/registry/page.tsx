"use client";

import { RegistrySection } from "@/components/sections/RegistrySection";
import { useLotusBackground } from "@/lib/useLotusBackground";

export default function RegistryPage() {
  const lotusBg = useLotusBackground();

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: "var(--color-bg)",
        backgroundImage: lotusBg
          ? [
              "linear-gradient(to bottom, rgba(8,28,22,0.55) 0%, rgba(8,28,22,0.55) 75%, rgba(8,28,22,0.85) 100%)",
              `url('${lotusBg}')`,
            ].join(", ")
          : "linear-gradient(to bottom, rgba(8,28,22,1) 0%, rgba(8,28,22,1) 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="pt-16">
        <RegistrySection />
      </div>
    </div>
  );
}
