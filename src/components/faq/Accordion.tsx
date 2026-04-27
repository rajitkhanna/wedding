import { AccordionItem } from "./AccordionItem";
import type { FAQItem } from "@/lib/faq-content";

interface AccordionProps {
  items: FAQItem[];
}

export function Accordion({ items }: AccordionProps) {
  return (
    <div
      className="rounded-lg px-2"
      style={{ borderTop: "1px solid var(--color-border-gold)" }}
    >
      {items.map((item, index) => (
        <AccordionItem
          key={item.q}
          question={item.q}
          answer={item.a}
          link={item.link}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}
