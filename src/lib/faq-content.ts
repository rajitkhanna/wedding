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
    q: "Will there be vegetarian options?",
    a: "Yes — full vegetarian options will be available at all meals across both South Indian and Punjabi cuisines.",
  },
  {
    q: "Can I take photos during the ceremony?",
    a: "Sikh Ceremony: respectful photography is welcome.\n\nTelugu Wedding: we'll have a professional photographer; please hold phones during the ceremony.",
  },
  {
    q: "Where do I park?",
    a: "The InterContinental has both valet and self-parking available. The Westborough Gurudwara has a free parking lot.",
  },
  {
    q: "What time should I arrive?",
    a: "Plan to arrive at least 30 minutes before each event. For the Telugu ceremony, please arrive by 9:45 AM — it begins promptly at 10:00 AM.",
  },
  {
    q: "I have a dietary restriction not covered in my RSVP.",
    a: "Please text Rajit at 603-921-8190 and he'll make sure you're taken care of.",
  },
  {
    q: "Who do I contact with questions?",
    a: "Text or call Rajit: 603-921-8190.",
  },
];
