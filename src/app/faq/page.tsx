import { Accordion } from "@/components/faq/Accordion";
import { faqItems } from "@/lib/faq-content";

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
