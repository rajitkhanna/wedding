export interface CeremonyGuideData {
  name: string;
  subtitle: string;
  description: string;
  details: string[];
  bullets: string[];
}

export interface FAQItem {
  /** URL-safe slug — makes the item directly linkable as /#<id>. */
  id: string;
  q: string;
  a: string;
  link?: { label: string; href: string; inline?: boolean };
  links?: { label: string; href: string }[];
}

export const ceremonyGuides: CeremonyGuideData[] = [
  {
    name: "Anand Karaj",
    subtitle: "Sikh Ceremony · Saturday",
    description:
      '"Blissful union" — a Sikh wedding ceremony conducted in the Gurudwara. The couple circles the Guru Granth Sahib (holy scripture) four times as hymns are sung. Family and guests sit together on the floor.',
    details: ["Duration: ~1.5 hours"],
    bullets: [
      "Cover your head — bring a dupatta, scarf, or bandana (extras available at the Gurudwara)",
      "Remove shoes before entering the main hall",
      "Sit on the floor (seating by gender is traditional but guests may sit together)",
      "A langar (community meal) follows the ceremony",
    ],
  },
  {
    name: "Telugu Wedding",
    subtitle: "Hindu Ceremony · Sunday",
    description:
      "A Hindu Brahmin ceremony with ancient Vedic rituals. Rituals include Kashi Yatra, Jeelakarra Bellam, Talambralu (showering rice on the couple), and Saptapadi (seven steps). A priest conducts in Telugu and Sanskrit.",
    details: [
      "Ceremony: 10:00 AM – 1:00 PM, Abigail Adams Ballroom",
      "Breakfast buffet at 8:00 AM in the Rose Kennedy Ballroom",
      "Lunch at 1:00 PM in the Rose Kennedy Ballroom",
    ],
    bullets: [
      "Arrive by 9:45 AM — ceremony starts promptly at 10:00 AM",
      "Bright, festive colors encouraged (the more color the better!)",
      "Indian attire warmly welcomed; Western semi-formal also great",
      "The ceremony is seated; comfortable shoes recommended",
    ],
  },
];

/** Anchor target for the attire FAQ — used to deep-link "what to wear" from events. */
export const ATTIRE_FAQ_HREF = "/#attire";

/** Slug of the attire FAQ item — used by the "what to wear" links. */
export const ATTIRE_FAQ_ID = "attire";

/** Single source of truth for the attire guidance shown in the FAQ and linked from events. */
export const attireFaqItem: FAQItem = {
  id: ATTIRE_FAQ_ID,
  q: "What does traditional Indian attire mean?",
  a: 'Search terms to check on Indian clothing websites include "festive wear" or "occasion wear." For men, a festive kurta set, Nehru jacket with trousers, or a bandhgala jacket are all great options — avoid cotton; silk, silk blend, and chanderi are ideal fabrics. For women, anything that\'s not bridal attire works.',
  links: [
    {
      label: "Guide to Indian wedding attire",
      href: "https://www.hitched.co.uk/wedding-planning/bridalwear-articles/what-to-wear-indian-wedding/",
    },
    {
      label: "Our Pinterest board — Sikh wedding attire",
      href: "https://pin.it/2tH4dMRet",
    },
    { label: "Lashkaraa", href: "https://www.lashkaraa.com/" },
    { label: "House of Indya", href: "https://www.houseofindya.com/" },
    {
      label: "Pernia's Pop Up Shop",
      href: "https://www.perniaspopupshop.com/",
    },
    { label: "Aza Fashions", href: "https://www.azafashions.com/" },
  ],
};

export const faqItems: FAQItem[] = [
  attireFaqItem,
  {
    id: "events",
    q: "Which events should I RSVP to and which events are only for family?",
    a: "We'd love to see you at all of the events. We will have the family-specific events before the wedding weekend.",
  },
  {
    id: "food",
    q: "Will there be vegetarian options?",
    a: "Yes — full vegetarian options will be available at all meals across both South Indian and Punjabi cuisines.",
  },
  {
    id: "gifts",
    q: "Can I bring a gift?",
    a: "Having you with us is truly the greatest gift. If you'd like to honor us with something, we'd be so touched by a contribution to our Newly Wed Fund — you can find it under the Registry tab. We kindly ask that wrapped or boxed gifts not be brought to the venue.",
    link: { label: "Registry", href: "/registry", inline: true },
  },
  {
    id: "contact",
    q: "Who do I contact with questions?",
    a: "Email Rajesh Khanna at khannaspb@gmail.com or Venkat Avvaru at vavvaru@gmail.com.",
  },
];
