"use client";

import { ScheduleSummarySection } from "@/components/sections/ScheduleSummarySection";

/**
 * Dedicated weekend itinerary page — the post-RSVP home for guests.
 * Reuses the personalized schedule section (per-day tabs, add-to-calendar,
 * event detail links, attire link).
 */
export default function SchedulePage() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <ScheduleSummarySection />
    </div>
  );
}
