"use client";

import { useState, useRef, useEffect } from "react";
import { db } from "@/lib/instant/db";

const mainLinks = [
  { href: "#story", label: "Our Story" },
  { href: "#schedule", label: "Schedule" },
];

const moreLinks = [
  { href: "#travel", label: "Travel & Stay" },
  { href: "#registry", label: "Registry" },
  { href: "#faq", label: "FAQ" },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block ml-1 transition-transform duration-200"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path
        d="M1 1l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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
  const [moreOpen, setMoreOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", update);
    update();
    return () => window.removeEventListener("hashchange", update);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isMoreActive = moreLinks.some((l) => activeHash === l.href);

  const linkStyle = (href: string) => ({
    color: activeHash === href ? "var(--color-gold)" : "var(--color-text-muted)",
    borderBottom: activeHash === href ? "2px solid var(--color-gold)" : "2px solid transparent",
    paddingBottom: "2px",
    transition: "color 150ms, border-color 150ms",
  });

  const moreButtonStyle = {
    color: isMoreActive ? "var(--color-gold)" : "var(--color-text-muted)",
    borderBottom: isMoreActive ? "2px solid var(--color-gold)" : "2px solid transparent",
    paddingBottom: "2px",
    transition: "color 150ms, border-color 150ms",
  };

  async function handleSignOut() {
    await db.auth.signOut();
  }

  function toggleSageSurfaces() {
    const root = document.documentElement;
    const next = root.dataset.surface === "sage" ? "" : "sage";
    if (next) {
      root.dataset.surface = next;
      window.localStorage.setItem("surface-mode", next);
    } else {
      delete root.dataset.surface;
      window.localStorage.removeItem("surface-mode");
    }
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
            href="#hero"
            className="text-xl tracking-widest hover:opacity-80 transition-opacity"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontWeight: 500,
            }}
          >
            M &amp; R
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {mainLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm tracking-widest uppercase font-light"
                style={linkStyle(link.href)}
                onMouseEnter={(e) => {
                  if (activeHash !== link.href)
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-gold)";
                }}
                onMouseLeave={(e) => {
                  if (activeHash !== link.href)
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-text-muted)";
                }}
              >
                {link.label}
              </a>
            ))}

            {/* More dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMoreOpen((v) => !v)}
                className="text-sm tracking-widest uppercase font-light flex items-center"
                style={moreButtonStyle}
                onMouseEnter={(e) => {
                  if (!isMoreActive)
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--color-gold)";
                }}
                onMouseLeave={(e) => {
                  if (!isMoreActive)
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-muted)";
                }}
                aria-expanded={moreOpen}
                aria-haspopup="true"
              >
                More
                <ChevronIcon open={moreOpen} />
              </button>

              {moreOpen && (
                <div
                  className="absolute right-0 top-full mt-3 min-w-[160px] rounded py-2"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border-gold)",
                  }}
                >
                  {moreLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2 text-sm tracking-wider font-light transition-colors"
                      style={{
                        color: activeHash === link.href ? "var(--color-gold)" : "var(--color-text-muted)",
                        fontFamily: "var(--font-body)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-gold)";
                        (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-surface-alt)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          activeHash === link.href ? "var(--color-gold)" : "var(--color-text-muted)";
                        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Sign out */}
            <button
              onClick={toggleSageSurfaces}
              className="text-xs tracking-widest uppercase font-light transition-opacity hover:opacity-70"
              style={{ color: "var(--color-text-dim)" }}
            >
              Sage Preview
            </button>
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
            maxHeight: drawerOpen ? "600px" : "0px",
            background: "var(--color-surface)",
            borderTop: drawerOpen ? "1px solid var(--color-border)" : "none",
          }}
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {mainLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className="py-3 text-sm tracking-widest uppercase font-light border-b"
                style={{
                  color: activeHash === link.href ? "var(--color-gold)" : "var(--color-text-muted)",
                  borderColor: "var(--color-border)",
                }}
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={() => { toggleSageSurfaces(); setDrawerOpen(false); }}
              className="py-3 text-sm tracking-widest uppercase font-light border-b flex items-center w-full text-left"
              style={{
                color: "var(--color-text-muted)",
                borderColor: "var(--color-border)",
              }}
            >
              Sage Preview
            </button>

            <button
              className="py-3 text-sm tracking-widest uppercase font-light border-b flex items-center w-full text-left"
              style={{
                color: isMoreActive ? "var(--color-gold)" : "var(--color-text-muted)",
                borderColor: "var(--color-border)",
              }}
              onClick={() => setMobileMoreOpen((v) => !v)}
            >
              More
              <ChevronIcon open={mobileMoreOpen} />
            </button>

            {mobileMoreOpen && (
              <div className="pl-4 flex flex-col gap-1">
                {moreLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => { setDrawerOpen(false); setMobileMoreOpen(false); }}
                    className="py-2.5 text-sm tracking-wider font-light border-b"
                    style={{
                      color: activeHash === link.href ? "var(--color-gold)" : "var(--color-text-muted)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

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
