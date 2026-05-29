export interface CeremonyGuideData {
  name: string;
  subtitle: string;
  description: string;
  details: string[];
  bullets: string[];
}

export interface FAQItem {
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
      "Ceremony: 10:00 AM – 11:30 AM, Abigail Adams Ballroom",
      "Breakfast buffet at 8:00 AM (all guests welcome)",
      "Lunch at 12:00 PM, wraps up ~2:00 PM",
    ],
    bullets: [
      "Arrive by 9:45 AM — ceremony starts promptly at 10:00 AM",
      "Bright, festive colors encouraged (the more color the better!)",
      "Indian attire warmly welcomed; Western semi-formal also great",
      "The ceremony is seated; comfortable shoes recommended",
    ],
  },
];

export const faqItems: FAQItem[] = [
  {
    q: "What does traditional Indian attire mean?",
    a: "Search terms to check on Indian clothing websites include \"festive wear\" or \"occasion wear.\" For men, a festive kurta set, Nehru jacket with trousers, or a bandhgala jacket are all great options — avoid cotton; silk, silk blend, and chanderi are ideal fabrics. For women, anything that's not bridal attire works beautifully.",
    links: [
      { label: "Guide to Indian wedding attire", href: "https://www.hitched.co.uk/wedding-planning/bridalwear-articles/what-to-wear-indian-wedding/" },
      { label: "Lashkaraa", href: "https://www.lashkaraa.com/" },
      { label: "House of Indya", href: "https://www.houseofindya.com/" },
      { label: "Pernia's Pop Up Shop", href: "https://www.perniaspopupshop.com/" },
      { label: "Aza Fashions", href: "https://www.azafashions.com/" },
    ],
  },
  {
    q: "Which events should I RSVP to and which events are only for family?",
    a: "We'd love to see you at all of the events. We will have the family-specific events before the wedding weekend.",
  },
  {
    q: "Will there be vegetarian options?",
    a: "Yes — full vegetarian options will be available at all meals across both South Indian and Punjabi cuisines.",
  },
  {
    q: "I have a dietary restriction not covered in my RSVP.",
    a: "Email Rajesh Khanna at khannaspb@gmail.com or Venkat Avvaru at vavvaru@gmail.com and they'll make sure you're taken care of.",
  },
  {
    q: "Can I bring a gift?",
    a: "Your presence is the greatest gift we can ask for. If you'd like to give something, please do not bring a box gift to the venue — instead, you can visit the Registry tab to contribute to our honeymoon fund.",
    link: { label: "Registry", href: "/registry", inline: true },
  },
  {
    q: "Who do I contact with questions?",
    a: "Email Rajesh Khanna at khannaspb@gmail.com or Venkat Avvaru at vavvaru@gmail.com.",
  },
];
