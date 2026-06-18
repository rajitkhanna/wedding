export interface PaymentOption {
  name: string;
  handle: string;
  url: string;
  copyValue?: string;
}

export const paymentOptions: PaymentOption[] = [
  {
    name: "Venmo",
    handle: "@meghana-avvaru",
    url: "https://venmo.com/u/meghana-avvaru",
  },
  {
    name: "Zelle",
    handle: "meghanaavvaru20@gmail.com",
    url: "#",
    copyValue: "meghanaavvaru20@gmail.com",
  },
];
