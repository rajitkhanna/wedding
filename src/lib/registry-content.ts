export interface PaymentOption {
  name: string;
  handle: string;
  url: string;
  /** Copyable fallback shown under the link (e.g. a handle or email). */
  copyValue?: string;
}

export const paymentOptions: PaymentOption[] = [
  {
    name: "Venmo",
    handle: "@Meghana-Avvaru",
    // Direct pay flow so guests (friends or not) skip the profile page.
    url: "https://venmo.com/?txn=pay&recipients=Meghana-Avvaru&note=Wedding%20gift",
    copyValue: "@Meghana-Avvaru",
  },
  {
    name: "Zelle",
    handle: "meghanaavvaru20@gmail.com",
    url: "#",
    copyValue: "meghanaavvaru20@gmail.com",
  },
];
