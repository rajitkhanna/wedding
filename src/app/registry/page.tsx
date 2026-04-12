"use client";

import { paymentOptions } from "@/lib/registry-content";

export default function Registry() {
  return (
    <div
      className="min-h-screen w-full py-20 px-4"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-lg">
        {/* Page header */}
        <header className="mb-12 text-center">
          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontSize: "3rem",
              fontWeight: 400,
              letterSpacing: "0.04em",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}
          >
            Registry
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Honestly, your presence is the greatest gift.
          </p>
          <p
            className="mt-2 text-base leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            But if you'd like to do something, please just Venmo or Zelle us —
            no registry needed.
          </p>
          <div
            className="mx-auto mt-6 h-px w-24"
            style={{ backgroundColor: "var(--color-border-gold)" }}
          />
        </header>

        {/* Payment cards */}
        <div className="flex flex-col gap-5">
          {paymentOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target={option.url.startsWith("http") ? "_blank" : undefined}
              rel={
                option.url.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="group block rounded-lg px-8 py-7 transition-all"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-gold)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "var(--color-gold)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "var(--color-border-gold)";
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-gold)",
                      fontSize: "1.75rem",
                      fontWeight: 400,
                      lineHeight: 1.1,
                    }}
                  >
                    {option.name}
                  </h2>
                  <p
                    className="mt-1 text-sm font-mono tracking-wide"
                    style={{ color: "var(--color-text)" }}
                  >
                    {option.handle}
                  </p>
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {option.detail}
                  </p>
                </div>
                <span
                  className="mt-1 shrink-0 transition-colors"
                  style={{ color: "var(--color-gold-dim)" }}
                  aria-hidden="true"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Footer note */}
        <p
          className="mt-10 text-center text-sm"
          style={{ color: "var(--color-text-dim)" }}
        >
          Thank you so much — we can&apos;t wait to celebrate with you. ♥
        </p>
      </div>
    </div>
  );
}
