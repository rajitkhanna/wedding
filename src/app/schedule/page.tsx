"use client";

import { ScheduleSummarySection } from "@/components/sections/ScheduleSummarySection";

/**
 * Dedicated weekend itinerary page — the post-RSVP home for guests.
 * Reuses the personalized schedule section (per-day tabs, add-to-calendar,
 * event detail links, attire link).
 *
 * Layout: flat sage paper with a warm ivory glow behind the header, so the
 * ivory schedule cards stay the brightest thing on screen.
 */
export default function SchedulePage() {
  return (
    <div
      className="min-h-screen w-full pt-16"
      style={{
        backgroundColor: "var(--color-bg)",
        backgroundImage: [
          "radial-gradient(120% 70% at 50% -12%, rgba(253,244,232,0.85) 0%, rgba(253,244,232,0) 62%)",
          "radial-gradient(90% 60% at 100% 100%, rgba(122,170,144,0.12) 0%, rgba(122,170,144,0) 70%)",
        ].join(", "),
        backgroundRepeat: "no-repeat",
      }}
    >
      <ScheduleSummarySection variant="timeline" />
    </div>
  );
}
