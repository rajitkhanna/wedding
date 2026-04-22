"use client";

import { db } from "@/lib/instant/db";
import { useLotusBackground } from "@/lib/useLotusBackground";

const DAY_TO_DATE: Record<string, { label: string; order: number }> = {
  thursday: { label: "November 26", order: 0 },
  friday: { label: "November 27", order: 1 },
  saturday: { label: "November 28", order: 2 },
  sunday: { label: "November 29", order: 3 },
};

const NAV_LINKS = [
  { href: "/rsvp", label: "RSVP" },
  { href: "/#faq", label: "FAQ" },
];

function useDateRange(): string | null {
  const { user } = db.useAuth();
  const { data } = db.useQuery(
    user
      ? { guests: { invitedEvents: {}, $: { where: { email: user.email! } } } }
      : null,
  );
  const events: any[] = data?.guests?.[0]?.invitedEvents ?? [];
  const days = events
    .map((e) => DAY_TO_DATE[e.day as string])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  if (!days.length) return null;
  const first = days[0].label;
  const last = days[days.length - 1].label;
  if (first === last) return `${first}, 2026`;
  return `${first}–${last.replace("November ", "")}, 2026`;
}

export function Footer() {
  const dateRange = useDateRange();
  const lotusBg = useLotusBackground();

  return (
    <footer
      className="mt-auto pt-12 pb-8 px-6"
      style={{
        backgroundImage: [
          "linear-gradient(rgba(8,28,22,0.72), rgba(8,28,22,0.72))",
          `url('${lotusBg}')`,
        ].join(", "),
        backgroundSize: "cover",
        backgroundPosition: "center",
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

      {/* Date + city — personalized to guest's invited days */}
      <p
        className="text-center mb-8 text-sm tracking-widest uppercase"
        style={{
          color: "var(--color-hero-muted)",
          fontFamily: "var(--font-body)",
          fontWeight: 300,
        }}
      >
        {dateRange ? <>{dateRange} &middot; Boston</> : "Boston"}
      </p>

      {/* Footer links */}
      <nav aria-label="Footer navigation">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} className="flex items-center gap-6">
              <a
                href={link.href}
                className="text-xs tracking-widest uppercase font-light transition-colors"
                style={{
                  color: "var(--color-hero-muted)",
                  fontFamily: "var(--font-body)",
                }}
                onClick={() => { if (link.href === "/rsvp") sessionStorage.setItem("rsvp-intent", String(Date.now())); }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-gold)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-hero-muted)";
                }}
              >
                {link.label}
              </a>
              {i < NAV_LINKS.length - 1 && (
                <span
                  aria-hidden="true"
                  style={{ color: "rgba(211,150,140,0.5)", fontSize: "0.6rem" }}
                >
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Contact */}
      <p
        className="text-center text-xs font-light leading-relaxed mb-4"
        style={{
          color: "var(--color-hero-dim)",
          fontFamily: "var(--font-body)",
        }}
      >
        Issue with this website?{" "}
        <a
          href="sms:16039218190"
          style={{
            color: "var(--color-hero-muted)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Text Rajit at (603) 921-8190
        </a>
      </p>

      {/* Copyright */}
      <p
        className="text-center text-xs tracking-wider mb-3"
        style={{
          color: "var(--color-hero-dim)",
          fontFamily: "var(--font-body)",
          fontWeight: 300,
        }}
      >
        &copy; 2026 &nbsp; All Rights Reserved
      </p>
    </footer>
  );
}
