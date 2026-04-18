// src/lib/travel-content.ts
// All static content for the Travel & Stay page.

export const venues = {
  intercontinental: {
    name: "InterContinental Boston",
    address: "510 Atlantic Ave, Boston, MA 02210",
    mapsUrl: "https://maps.google.com/?q=InterContinental+Boston+510+Atlantic+Ave",
    events: [
      "Welcome Dinner (Fri)",
      "Sangeet & Reception (Sat)",
      "Telugu Wedding (Sun)",
    ],
    preferred: true,
  },
  gurudwara: {
    name: "Westborough Gurudwara Sahib",
    address: "168 Flanders Rd, Westborough, MA 01581",
    mapsUrl: "https://maps.google.com/maps?q=168+Flanders+Rd,+Westborough,+MA+01581",
    events: ["Sikh Ceremony (Sat morning)"],
    preferred: false,
  },
} as const;

export const shuttleInfo = {
  day: "Saturday",
  route: "Westborough Gurudwara → InterContinental Boston",
  departureTime: "TBD",
  note: "No need to drive — we've got you covered.",
};

export const airports = [
  {
    code: "BOS",
    name: "Logan International",
    city: "Boston, MA",
    distance: "~20 min to hotel",
    primary: true,
  },
  {
    code: "PVD",
    name: "Providence TF Green",
    city: "Providence, RI",
    distance: "~1 hr drive",
    primary: false,
  },
  {
    code: "MHT",
    name: "Manchester-Boston Regional",
    city: "Manchester, NH",
    distance: "~1 hr drive",
    primary: false,
  },
] as const;

export const hotels = [
  {
    name: "InterContinental Boston",
    distance: null,
    note: "All Friday, Saturday, and Sunday events are held here — staying at the IC means you're steps from everything.",
    bookingUrl: "https://www.intercontinentalboston.com/",
    preferred: true,
  },
  {
    name: "Marriott Long Wharf",
    distance: "0.3 mi from IC",
    note: null,
    bookingUrl: null,
    preferred: false,
  },
  {
    name: "Westin Boston Seaport",
    distance: "0.5 mi from IC",
    note: null,
    bookingUrl: null,
    preferred: false,
  },
  {
    name: "Omni Boston Hotel",
    distance: "0.7 mi from IC",
    note: null,
    bookingUrl: null,
    preferred: false,
  },
] as const;

export const gettingAround = [
  {
    icon: "🚕",
    label: "Rideshare",
    detail: "Uber and Lyft are widely available throughout Boston.",
  },
  {
    icon: "🚇",
    label: "The T (MBTA)",
    detail:
      "South Station (Red Line & Silver Line) is a 5-minute walk from InterContinental Boston.",
  },
  {
    icon: "🅿️",
    label: "Parking",
    detail: "Valet and self-parking available at InterContinental Boston.",
  },
] as const;

export const bostonFavorites = [
  {
    name: "Coming soon",
    description: "Our favorite Boston spots — check back closer to the date.",
    placeholder: true,
  },
  {
    name: "Coming soon",
    description: "Our favorite Boston spots — check back closer to the date.",
    placeholder: true,
  },
  {
    name: "Coming soon",
    description: "Our favorite Boston spots — check back closer to the date.",
    placeholder: true,
  },
  {
    name: "Coming soon",
    description: "Our favorite Boston spots — check back closer to the date.",
    placeholder: true,
  },
] as const;
