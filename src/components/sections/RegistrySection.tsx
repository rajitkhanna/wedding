"use client";

import { useState } from "react";
import { paymentOptions } from "@/lib/registry-content";

export function RegistrySection() {
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(value: string, key: string) {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <section
      id="registry"
      className="w-full pt-0 pb-24 px-4"
      style={{ scrollMarginTop: "64px" }}
    >
      <div className="mx-auto max-w-lg px-4 pt-16">
        <header className="mb-12 text-center">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontSize: "3rem",
              fontWeight: 400,
              letterSpacing: "0.04em",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
              textShadow: "0 2px 12px rgba(0,0,0,0.7)",
            }}
          >
            Registry
          </h2>
          <p
            className="mt-2 text-base leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.75)",
              textShadow: "0 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            We are so blessed and grateful for all of your love and well wishes.
            If you do wish to celebrate with a gift, a contribution to our Newly
            Wed Fund would be appreciated.{" "}
          </p>
          <div
            className="mx-auto mt-6 h-px w-24"
            style={{ backgroundColor: "var(--color-border-gold)" }}
          />
        </header>

        <div className="flex flex-col gap-5">
          {paymentOptions.map((option) => {
            const isCopied = copied === option.name;
            const sharedStyle = {
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-gold)",
            };
            const inner = (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-gold)",
                      fontSize: "1.75rem",
                      fontWeight: 400,
                      lineHeight: 1.1,
                    }}
                  >
                    {option.name}
                  </h3>
                  <p
                    className="mt-1 text-sm font-mono tracking-wide"
                    style={{ color: "var(--color-text)" }}
                  >
                    {isCopied ? "Copied" : option.handle}
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
            );

            // Copy-only card (no link target), e.g. Zelle email.
            if (option.copyValue && !option.url.startsWith("http")) {
              return (
                <button
                  key={option.name}
                  onClick={() => handleCopy(option.copyValue!, option.name)}
                  className="group block w-full rounded-lg px-8 py-7 text-left transition-all"
                  style={sharedStyle}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--color-gold)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--color-border-gold)";
                  }}
                >
                  {inner}
                </button>
              );
            }

            return (
              <div key={option.name} className="flex flex-col gap-2">
                {/* Same tab: lets iOS/Android deep-link into the Venmo app. */}
                <a
                  href={option.url}
                  className="group block rounded-lg px-8 py-7 transition-all"
                  style={sharedStyle}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--color-gold)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--color-border-gold)";
                  }}
                >
                  {inner}
                </a>
                {option.copyValue ? (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(option.copyValue!, `${option.name}-copy`)
                    }
                    className="self-end pr-1 font-mono text-xs tracking-wide transition-colors hover:text-[var(--color-gold)]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {copied === `${option.name}-copy`
                      ? "Copied"
                      : `Copy ${option.copyValue}`}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>

        <p
          className="mt-10 text-center text-sm"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          With lots of love, Meghana &amp; Rajit ♥
        </p>
      </div>
    </section>
  );
}
