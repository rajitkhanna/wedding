"use client";

import { MagicLinkForm } from "@/components/schedule/MagicLinkForm";

export function GlobalAuthGate() {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mb-10 text-center">
        <p
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-gold)",
            fontSize: "4.5rem",
            fontWeight: 400,
            letterSpacing: "0.08em",
            lineHeight: 1,
          }}
        >
          Meghana and Rajit
        </p>
        <p
          className="t-label mt-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          Boston, MA
        </p>
        <div
          className="mx-auto mt-5 h-px w-16"
          style={{ backgroundColor: "var(--color-border-gold)" }}
        />
      </div>

      <div
        className="w-full max-w-sm rounded-lg px-8 py-10"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border-gold)",
        }}
      >
        <div className="mb-7 text-center">
          <h2
            className="t-sub"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            You&apos;re invited.
          </h2>
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
