"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { VenuesSection } from "@/components/sections/VenuesSection";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { TravelSection } from "@/components/sections/TravelSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { RegistrySection } from "@/components/sections/RegistrySection";

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

export default function Home() {
  return (
    <main style={{ backgroundColor: "var(--color-bg)" }}>
      {/* 1. Big photo + RSVP */}
      <HeroSection />

      {/* 2. Our Story carousel */}
      <JourneySection />

      <Divider />

      {/* 3. Where we're getting married */}
      <VenuesSection />

      <Divider />

      {/* 4. Schedule (tailored to the guest) */}
      <ScheduleSection />

      <Divider />

      {/* 5. Travel — parking + where to stay */}
      <TravelSection />

      <Divider />

      {/* 6. FAQ */}
      <FAQSection />

      <Divider />

      {/* 7. Gift registry */}
      <RegistrySection />
    </main>
  );
}
