"use client";

import { useEffect, useRef, useState } from "react";

interface AccordionItemProps {
  /** URL-safe slug — the item is directly linkable as /#<id>. */
  id: string;
  question: string;
  answer: string;
  link?: { label: string; href: string; inline?: boolean };
  links?: { label: string; href: string }[];
  defaultOpen?: boolean;
}

export function AccordionItem({
  id,
  question,
  answer,
  link,
  links,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Deep link: /#<id> opens this item and scrolls it into view.
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    const matches = () =>
      decodeURIComponent(window.location.hash.slice(1)) === id;
    const open = () => {
      setIsOpen(true);
      scrollTimer = setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    };
    // Deferred so the initial open doesn't trip set-state-in-effect (and to avoid SSR mismatch).
    const mountTimer = setTimeout(() => {
      if (matches()) open();
    }, 0);

    const onHash = () => {
      if (matches()) open();
    };
    window.addEventListener("hashchange", onHash);
    return () => {
      clearTimeout(mountTimer);
      if (scrollTimer) clearTimeout(scrollTimer);
      window.removeEventListener("hashchange", onHash);
    };
  }, [id]);

  async function copyLink() {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for contexts without Clipboard API access.
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    // Reflect the deep link in the address bar too, so it can be copied from there.
    window.history.replaceState(null, "", `#${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function linkifyEmails(text: string) {
    const parts = text.split(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    );
    return parts.map((part, i) =>
      part.includes("@") ? (
        <a
          key={i}
          href={`mailto:${part}`}
          style={{
            color: "var(--color-gold-dim)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          {part}
        </a>
      ) : (
        part
      ),
    );
  }

  return (
    <div
      id={id}
      ref={ref}
      className="border-b"
      style={{
        borderColor: "var(--color-border-gold)",
        scrollMarginTop: "88px",
      }}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex flex-1 items-center justify-between gap-4 py-5 text-left"
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

        {/* Copy a direct link to this question */}
        <button
          type="button"
          onClick={copyLink}
          className="shrink-0 self-center rounded p-2 transition-opacity hover:opacity-70"
          title={copied ? "Link copied" : "Copy link to this question"}
          aria-label={`Copy link to: ${question}`}
          style={{
            color: copied ? "var(--color-gold)" : "var(--color-text-dim)",
          }}
        >
          {copied ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.71-1.71"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

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
              <p
                key={i}
                className="mt-2 text-sm leading-relaxed first:mt-0"
                style={{ color: "var(--color-text-muted)" }}
              >
                {linkifyEmails(paragraph)}
              </p>
            ))
          ) : (
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              {link?.inline ? (
                (() => {
                  const [before, after] = answer.split(link.label);
                  return (
                    <>
                      {linkifyEmails(before)}
                      <a
                        href={link.href}
                        style={{
                          color: "var(--color-gold)",
                          textDecoration: "underline",
                          textUnderlineOffset: "3px",
                        }}
                      >
                        {link.label}
                      </a>
                      {linkifyEmails(after ?? "")}
                    </>
                  );
                })()
              ) : (
                <>
                  {linkifyEmails(answer)}
                  {link && (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--color-gold)",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      {link.label}
                    </a>
                  )}
                </>
              )}
            </p>
          )}
          {links && links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                  style={{
                    color: "var(--color-gold)",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
