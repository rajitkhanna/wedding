export interface PaymentOption {
  name: string;
  handle: string;
  url: string;
  copyValue?: string;
}

export const paymentOptions: PaymentOption[] = [
  {
    name: "Meghana — Venmo",
    handle: "@meghana-avvaru",
    url: "https://venmo.com/u/meghana-avvaru",
  },
  {
    name: "Meghana — Zelle",
    handle: "603-320-3391",
    url: "#",
    copyValue: "603-320-3391",
  },
];
