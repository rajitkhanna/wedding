"use client";

import Link from "next/link";

const footerLinks = [
  { href: "/travel-stay", label: "Travel & Stay" },
  { href: "/registry", label: "Registry" },
  { href: "/faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer
      className="mt-auto pt-12 pb-8 px-6"
      style={{
        borderTop: "1px solid var(--color-border)",
        background: "var(--color-bg)",
      }}
    >
      {/* Gold ornament divider */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span
          className="flex-1 max-w-[120px]"
          style={{ height: "1px", background: "var(--color-gold-dim)" }}
        />
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-gold)",
            fontSize: "1.25rem",
            lineHeight: 1,
          }}
        >
          ♥
        </span>
        <span
          className="flex-1 max-w-[120px]"
          style={{ height: "1px", background: "var(--color-gold-dim)" }}
        />
      </div>

      {/* Names */}
      <p
        className="text-center mb-2"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-gold)",
          fontSize: "1.375rem",
          fontWeight: 400,
          letterSpacing: "0.04em",
        }}
      >
        With love, Meghana &amp; Rajit
      </p>

      {/* Date + city */}
      <p
        className="text-center mb-8 text-sm tracking-widest uppercase"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-body)",
          fontWeight: 300,
        }}
      >
        November 28, 2026 &middot; Boston
      </p>

      {/* Footer links */}
      <nav aria-label="Footer navigation">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6">
          {footerLinks.map((link, i) => (
            <li key={link.href} className="flex items-center gap-6">
              <Link
                href={link.href}
                className="text-xs tracking-widest uppercase font-light transition-colors"
                style={{
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-body)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--color-gold)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--color-text-muted)";
                }}
              >
                {link.label}
              </Link>
              {i < footerLinks.length - 1 && (
                <span
                  aria-hidden="true"
                  style={{
                    color: "var(--color-border-gold)",
                    fontSize: "0.6rem",
                  }}
                >
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Copyright */}
      <p
        className="text-center text-xs tracking-wider"
        style={{
          color: "var(--color-text-dim)",
          fontFamily: "var(--font-body)",
          fontWeight: 300,
        }}
      >
        &copy; 2026 &nbsp; All Rights Reserved
      </p>
    </footer>
  );
}
