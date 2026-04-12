"use client";

import { MagicLinkForm } from "./MagicLinkForm";

export function AuthGate() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-24"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Page title */}
      <div className="mb-12 text-center">
        <p
          className="mb-3 text-xs tracking-[0.3em] uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          November 27 – 29, 2025
        </p>
        <h1
          className="text-5xl md:text-6xl"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-gold)",
            fontWeight: 400,
          }}
        >
          Schedule
        </h1>
        <p
          className="mt-3 text-sm font-light italic"
          style={{ color: "var(--color-text-muted)" }}
        >
          Your personalized wedding itinerary
        </p>
        <div
          className="mx-auto mt-5 h-px w-24"
          style={{ backgroundColor: "var(--color-border-gold)" }}
        />
      </div>

      {/* Auth card */}
      <div
        className="w-full max-w-md rounded-lg px-8 py-10"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border-gold)",
        }}
      >
        <div className="mb-7 text-center">
          <h2
            className="mt-3 text-xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
              fontWeight: 400,
            }}
          >
            Your schedule is waiting for you.
          </h2>
          <p
            className="mt-2 text-sm font-light"
            style={{ color: "var(--color-text-muted)" }}
          >
            Enter your email to receive a personalized magic link.
          </p>
        </div>

        <MagicLinkForm />

        <p
          className="mt-5 text-center text-xs"
          style={{ color: "var(--color-text-dim)" }}
        >
          No password needed.
        </p>
      </div>
    </div>
  );
}
