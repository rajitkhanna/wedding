"use client";

import type { PaymentOption } from "@/lib/registry-content";

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

interface RegistryCardProps {
  item: PaymentOption;
}

export function RegistryCard({ item }: RegistryCardProps) {
  return (
    <a
      href={item.url}
      target={item.url.startsWith("http") ? "_blank" : undefined}
      rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex flex-col gap-4 rounded-lg border border-[var(--color-border-gold)] bg-[var(--color-surface)] p-6 transition-all hover:border-[var(--color-gold)] hover:bg-[var(--color-surface-alt)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3
            className="text-2xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
            }}
          >
            {item.name}
          </h3>
          <p
            className="mt-1 text-sm font-mono tracking-wide"
            style={{ color: "var(--color-text)" }}
          >
            {item.handle}
          </p>
        </div>
        <span
          className="mt-1 shrink-0 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-gold)]"
          aria-hidden="true"
        >
          <ArrowIcon />
        </span>
      </div>
    </a>
  );
}
