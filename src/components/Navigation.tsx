"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/instant/db";

const NAV_LINKS = [
  { href: "/rsvp",      label: "RSVP" },
  { href: "/gallery",   label: "Gallery" },
  { href: "/#faq",      label: "FAQ" },
];

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" width="22" height="16" viewBox="0 0 22 16" fill="none">
      {open ? (
        <>
          <line x1="1" y1="1" x2="21" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="21" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="1" y1="2" x2="21" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1" y1="8" x2="21" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1" y1="14" x2="21" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const update = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", update);
    update();
    return () => window.removeEventListener("hashchange", update);
  }, []);

  function isActive(href: string) {
    if (href.startsWith("/#")) return activeHash === href.slice(1);
    return pathname === href;
  }

  function linkStyle(href: string) {
    const active = isActive(href);
    return {
      color: active ? "var(--color-gold)" : "var(--color-text-muted)",
      borderBottom: active ? "2px solid var(--color-gold)" : "2px solid transparent",
      paddingBottom: "2px",
      transition: "color 150ms, border-color 150ms",
    };
  }

  async function handleSignOut() {
    await db.auth.signOut();
  }

  return (
    <>
      <nav
        className="absolute top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: "var(--color-overlay-nav)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <a
            href="/"
            className="text-xl tracking-widest hover:opacity-80 transition-opacity"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)", fontWeight: 500 }}
          >
            M &amp; R
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm tracking-widest uppercase font-light"
                style={linkStyle(link.href)}
                onClick={() => {}}
                onMouseEnter={(e) => {
                  if (!isActive(link.href))
                    (e.currentTarget as HTMLElement).style.color = "var(--color-gold)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href))
                    (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)";
                }}
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={handleSignOut}
              className="text-xs tracking-widest uppercase font-light transition-opacity hover:opacity-70"
              style={{ color: "var(--color-text-dim)" }}
            >
              Sign Out
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1"
            style={{ color: "var(--color-text-muted)" }}
            onClick={() => setDrawerOpen((v) => !v)}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
          >
            <HamburgerIcon open={drawerOpen} />
          </button>
        </div>

        {/* Mobile drawer */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: drawerOpen ? "400px" : "0px",
            background: "var(--color-surface)",
            borderTop: drawerOpen ? "1px solid var(--color-border)" : "none",
          }}
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className="py-3 text-sm tracking-widest uppercase font-light border-b"
                style={{
                  color: isActive(link.href) ? "var(--color-gold)" : "var(--color-text-muted)",
                  borderColor: "var(--color-border)",
                }}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={handleSignOut}
              className="mt-3 py-3 text-xs tracking-widest uppercase font-light text-left transition-opacity hover:opacity-70"
              style={{ color: "var(--color-text-dim)" }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
