export interface PaymentOption {
  name: string;
  handle: string;
  detail: string;
  url: string;
}

export const paymentOptions: PaymentOption[] = [
  {
    name: "Meghana — Venmo",
    handle: "@meghana-avvaru",
    detail: "Tap the button and send whatever feels right.",
    url: "https://venmo.com/u/meghana-avvaru",
  },
  {
    name: "Meghana — Zelle",
    handle: "603-320-3391",
    detail: "Send to Meghana's number — it goes straight through.",
    url: "#zelle-meghana",
  },
];
