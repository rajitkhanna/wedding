"use client";

import { RegistrySection } from "@/components/sections/RegistrySection";

export default function RegistryPage() {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="pt-16">
        <RegistrySection />
      </div>
    </div>
  );
}
