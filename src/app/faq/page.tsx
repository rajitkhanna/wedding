import { CeremonyGuide } from "@/components/faq/CeremonyGuide";
import { Accordion } from "@/components/faq/Accordion";
import { ceremonyGuides, faqItems } from "@/lib/faq-content";

export default function FAQ() {
  return (
    <div
      className="min-h-screen w-full py-20 px-4"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Page header */}
        <header className="mb-14 text-center">
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
            FAQ
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1rem" }}>
            Everything you might be wondering.
          </p>
          <div
            className="mx-auto mt-5 h-px w-24"
            style={{ backgroundColor: "var(--color-border-gold)" }}
          />
        </header>

        {/* Ceremony Guides */}
        <section className="mb-14">
          <h2
            className="mb-6 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--color-gold)" }}
          >
            Ceremony Guides
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {ceremonyGuides.map((guide) => (
              <CeremonyGuide key={guide.name} guide={guide} />
            ))}
          </div>
        </section>

        {/* Gold rule */}
        <hr className="gold-rule mb-14" />

        {/* FAQ Accordion */}
        <section>
          <h2
            className="mb-6 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--color-gold)" }}
          >
            Questions
          </h2>
          <Accordion items={faqItems} />
        </section>
      </div>
    </div>
  );
}
