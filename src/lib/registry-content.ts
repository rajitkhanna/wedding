export interface PaymentOption {
  name: string;
  handle: string;
  detail: string;
  url: string;
}

export const paymentOptions: PaymentOption[] = [
  {
    name: "Venmo",
    handle: "@rajit-khanna",
    detail: "Tap the button and send whatever feels right.",
    url: "https://venmo.com/u/rajit-khanna",
  },
  {
    name: "Zelle",
    handle: "603-921-8190",
    detail: "Send to Rajit's number — it goes straight through.",
    url: "#zelle",
  },
];
