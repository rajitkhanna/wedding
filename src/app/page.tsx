"use client";

import { useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { HeroRSVPModal } from "@/components/rsvp/HeroRSVPModal";
import { JourneySection } from "@/components/sections/JourneySection";
import { VenuesSection } from "@/components/sections/VenuesSection";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { TravelSection } from "@/components/sections/TravelSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { RegistrySection } from "@/components/sections/RegistrySection";
import { isRsvpOpen } from "@/lib/rsvp/rsvpDeadline";

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

function scrollToSchedule() {
  document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" });
}

export default function Home() {
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const rsvpOpen = isRsvpOpen();

  return (
    <main style={{ backgroundColor: "var(--color-bg)" }}>
      <HeroRSVPModal
        open={rsvpModalOpen}
        onClose={() => setRsvpModalOpen(false)}
        onAfterSubmit={scrollToSchedule}
        allowSubmit={rsvpOpen}
      />

      {/* 1. Big photo + RSVP */}
      <HeroSection onRSVPClick={() => setRsvpModalOpen(true)} />

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
