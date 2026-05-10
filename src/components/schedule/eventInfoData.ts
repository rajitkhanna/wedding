export type EventInfoSection = {
  heading: string;
  paragraphs: string[];
};

export type RichEventInfo = {
  slug: string;
  title: string;
  intro?: string;
  sections: EventInfoSection[];
};

const ANAND_KARAJ_INFO: RichEventInfo = {
  slug: 'anand-karaj',
  title: 'Anand Karaj — A Guide for Guests',
  intro:
    "We are incredibly honored to have so many family and friends help celebrate our wedding day. We understand that for some, this may be your first time at a Sikh wedding. To help make the experience as comfortable as possible, we've put together a brief guide to the key elements of a Sikh wedding. Feel free to reach out to us with any questions.",
  sections: [
    {
      heading: 'The Ceremony',
      paragraphs: [
        'An Anand Karaj is the traditional Sikh wedding ceremony performed at a Gurdwara (Sikh Temple). Anand Karaj translates to "Blissful Union" and signifies the union of two souls in the presence of the Guru Granth Sahib — the Sikh holy scripture — and the congregation.',
        'It emphasizes equality, love, and commitment between the bride and groom, who circle the Guru Granth Sahib four times as hymns and prayers are recited. Each round carries its own significance, representing a different stage of married life and spiritual union. A lunch reception follows the ceremony.',
      ],
    },
    {
      heading: 'Entering the Gurdwara',
      paragraphs: [
        'Upon entering the Gurdwara you will find a coat and shoe room to the right and the langar hall (kitchen) to the left. Shoes are required to be removed before entering. Feel free to enjoy breakfast and socialize in the langar hall prior to the ceremony.',
        'The ceremony takes place in the Darbar Hall (main prayer room) upstairs. Head coverings are required while in the Darbar Hall out of respect. You will notice members of the Sikh community walk toward the altar and bow before the Guru Granth Sahib, then offer a small monetary donation for the temple. Non-Sikhs are not obligated to bow — but if you wish to, you are most welcome.',
        'It is a cultural norm for men and women to sit on opposite sides, but couples and families may choose to sit together. If you arrive after the ceremony has begun, please wait until the end to bow at the altar.',
      ],
    },
    {
      heading: 'Head Coverings & Shoes',
      paragraphs: [
        'Both men and women must remove their shoes before entering the temple and cover their heads. There are plenty of shelves for shoes — feel free to walk barefoot or in socks.',
        'Gentlemen, we will provide a rumaal (bandana) for you, or you\'re welcome to bring your own. Ballcaps and beanies are not considered appropriate headwear for the occasion. Ladies, please bring a scarf or shawl (chunni or dupatta) to cover your head and shoulders while at the temple.',
      ],
    },
    {
      heading: 'Dress Code',
      paragraphs: [
        'Formal and conservative attire is required. Guests will be seated on the floor during the ceremony, so please wear something that allows you to sit comfortably. If you choose to wear a dress, please keep your legs covered.',
        'If you are interested in wearing Indian attire, we encourage it — colorful and celebratory is the spirit of the day.',
      ],
    },
  ],
};

// All rich event info entries — keyed by slug for O(1) lookup
const ALL_RICH_INFO: RichEventInfo[] = [ANAND_KARAJ_INFO];

const BY_SLUG = new Map(ALL_RICH_INFO.map((e) => [e.slug, e]));

// Matches event title keywords → entry
const KEYWORD_MAP: Array<{ keywords: string[]; info: RichEventInfo }> = [
  { keywords: ['anand karaj', 'sikh', 'gurdwara'], info: ANAND_KARAJ_INFO },
];

export function getEventInfo(eventTitle: string): RichEventInfo | null {
  const lower = eventTitle.toLowerCase();
  for (const { keywords, info } of KEYWORD_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) return info;
  }
  return null;
}

export function getEventInfoBySlug(slug: string): RichEventInfo | null {
  return BY_SLUG.get(slug) ?? null;
}

export function getAllEventSlugs(): string[] {
  return ALL_RICH_INFO.map((e) => e.slug);
}
