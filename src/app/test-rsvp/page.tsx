"use client";

// Test-only page that renders RSVPSection with mock data.
// Enabled by NEXT_PUBLIC_ENABLE_TEST_LOGIN=true to prevent production exposure.

import { RSVPSection } from "@/components/schedule/RSVPSection";

const MOCK_EVENTS = [
  { id: "evt-1", title: "Baraat & Ceremony", day: "saturday", startTime: "11:00 AM", group: "all" },
  { id: "evt-2", title: "Reception", day: "saturday", startTime: "6:00 PM", group: "all" },
  { id: "evt-3", title: "Mehndi Night", day: "friday", startTime: "7:00 PM", group: "all" },
];

const MOCK_GUEST_SINGLE = {
  id: "guest-test-1",
  email: "test@wedding.test",
  name: "Test Guest",
  partyMembers: JSON.stringify([
    { name: "Test Guest", eventIds: [], meal: "", dietary: "" },
  ]),
};

const MOCK_GUEST_FAMILY = {
  id: "guest-family-1",
  email: "family@wedding.test",
  name: "Smith Family",
  partyMembers: JSON.stringify([
    { name: "Dad Smith", eventIds: [], meal: "", dietary: "" },
    { name: "Mom Smith", eventIds: [], meal: "", dietary: "" },
    { name: "Kid Smith", eventIds: [], meal: "", dietary: "" },
  ]),
};

export default function TestRSVPPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN !== "true") {
    return <div>Test page disabled.</div>;
  }

  const params = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
  const variant = params.get("variant") ?? "single";

  const guest = variant === "family" ? MOCK_GUEST_FAMILY : MOCK_GUEST_SINGLE;

  return (
    <div
      className="min-h-screen py-16 px-6 max-w-2xl mx-auto"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <RSVPSection guest={guest} visibleEvents={MOCK_EVENTS} />
    </div>
  );
}
