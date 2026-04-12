import Link from "next/link";

export default function RSVPPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-24"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="text-center max-w-sm">
        <h1
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-gold)",
            fontSize: "3rem",
            fontWeight: 400,
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}
        >
          RSVP
        </h1>
        <p
          className="text-base leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          RSVP is part of your personalized schedule. Sign in with your email
          to view your itinerary and let us know you&apos;re coming.
        </p>
        <div
          className="mx-auto my-8 h-px w-16"
          style={{ backgroundColor: "var(--color-border-gold)" }}
        />
        <Link
          href="/schedule"
          className="inline-flex items-center gap-2 rounded px-6 py-3 text-sm font-medium tracking-widest uppercase transition-colors"
          style={{
            background: "var(--color-gold)",
            color: "#120608",
          }}
        >
          Go to Schedule →
        </Link>
      </div>
    </div>
  );
}
