"use client";

import { useState } from "react";

interface AccordionItemProps {
  question: string;
  answer: string;
  link?: { label: string; href: string };
  defaultOpen?: boolean;
}

export function AccordionItem({
  question,
  answer,
  link,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  function linkifyEmails(text: string) {
    const parts = text.split(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g);
    return parts.map((part, i) =>
      part.includes("@") ? (
        <a key={i} href={`mailto:${part}`} style={{ color: "var(--color-gold-dim)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
          {part}
        </a>
      ) : part
    );
  }

  return (
    <div
      className="border-b"
      style={{ borderColor: "var(--color-border-gold)" }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span
          className="text-base font-medium"
          style={{ color: "var(--color-text)" }}
        >
          {question}
        </span>
        {/* Chevron — rotates 90° when open */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 shrink-0 transition-transform duration-300"
          style={{
            color: "var(--color-gold)",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
          }}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Answer — smooth max-height animation */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? "600px" : "0px",
        }}
      >
        <div className="pb-5">
          {answer.includes("\n\n") ? (
            answer.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed first:mt-0" style={{ color: "var(--color-text-muted)" }}>
                {linkifyEmails(paragraph)}
              </p>
            ))
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              {linkifyEmails(answer)}
              {link && (
                <a
                  href={link.href}
                  style={{ color: "var(--color-gold)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                >
                  {link.label}
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
