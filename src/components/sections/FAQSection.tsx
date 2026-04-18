import { Accordion } from "@/components/faq/Accordion";
import { faqItems } from "@/lib/faq-content";
import { SectionBanner } from "@/components/SectionBanner";

export function FAQSection() {
  return (
    <section
      id="faq"
      className="w-full pt-0 pb-24 px-4"
      style={{ backgroundColor: "var(--color-bg)", scrollMarginTop: "64px" }}
    >
      <SectionBanner match="palace" fallbackMatch="venue/" height="20vh" />
      <div className="mx-auto max-w-3xl px-4 pt-16">
        <header className="mb-14 text-center">
          <h2
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
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1rem" }}>
            Everything you might be wondering.
          </p>
          <div
            className="mx-auto mt-5 h-px w-24"
            style={{ backgroundColor: "var(--color-border-gold)" }}
          />
        </header>

        <div>
          <h3
            className="mb-6 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--color-gold)" }}
          >
            Questions
          </h3>
          <Accordion items={faqItems} />
        </div>
      </div>
    </section>
  );
}
