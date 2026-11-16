import type { OrderViewDto } from "@/types/order";
import type { OrderItemListDto } from "@/types/orderItem";
import type { ReceiptOrder } from "@/components/Customer/checkout/OrderReceipt";

export const toNumber = (value: string | number | null | undefined): number => {
  if (typeof value === "number") return value;
  return Number(String(value ?? "").replace(/,/g, "")) || 0;
};

/* Formats a number as words for the receipt's "Amount in Words" line
   (e.g. 12345.5 -> "Twelve Thousand Three Hundred Forty Five Birr and 50"),
   following the Ethiopian Birr style used on fiscal receipts. */
const ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const tens = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];
const threeDigitWords = (n: number): string => {
  const parts: string[] = [];
  if (n >= 100) {
    parts.push(`${ones[Math.floor(n / 100)]} Hundred`);
    n %= 100;
  }
  if (n >= 20) {
    parts.push(tens[Math.floor(n / 10)]);
    n %= 10;
  }
  if (n > 0) parts.push(ones[n]);
  return parts.join(" ");
};
export const amountInWords = (value: number): string => {
  const safe = Math.max(0, Math.round(value * 100) / 100);
  const whole = Math.floor(safe);
  const cents = Math.round((safe - whole) * 100);
  const groups = [
    { div: 1_000_000_000, word: "Billion" },
    { div: 1_000_000, word: "Million" },
    { div: 1_000, word: "Thousand" },
  ];
  let rest = whole;
  const chunks: string[] = [];
  for (const g of groups) {
    const count = Math.floor(rest / g.div);
    if (count > 0) {
      chunks.push(`${threeDigitWords(count)} ${g.word}`);
      rest %= g.div;
    }
  }
  if (rest > 0 || chunks.length === 0) chunks.push(threeDigitWords(rest) || "Zero");
  const centsPart = cents > 0 ? ` and ${cents}` : "";
  return `${chunks.join(" ")} Birr${centsPart}`;
};

/* Builds the printable receipt model from the admin order view + its items.
   `paymentMethod` is the live payment method for paid orders; credit orders
   fall back to the order's own credit label. */
export const buildReceiptOrder = (
  order: OrderViewDto,
  items: OrderItemListDto[],
  paymentMethod?: string,
): ReceiptOrder => {
  const lines = items.map((i) => ({
    id: i.id,
    name: i.product,
    quantity: i.quantity,
    unitPrice: toNumber(i.unitPrice),
    unit: i.unit,
  }));
  const subtotal = lines.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const vat = items.reduce((s, i) => s + toNumber(i.vat), 0);
  const grandTotal = toNumber(order.total) || subtotal + vat;

  return {
    id: order.code,
    reference: order.id,
    date: order.orderDateAt?.split("T")[0] ?? "",
    customerName: order.fullName || "—",
    customerPhone: order.phoneNum || "—",
    customerAddress:
      [order.tin ? `TIN: ${order.tin}` : "", order.email || ""]
        .filter(Boolean)
        .join(" · ") || "—",
    customerTin: order.tin || undefined,
    paymentMethod: order.isCredit
      ? order.isCreditStr || "Credit"
      : paymentMethod || "—",
    preparedBy: "Sales",
    items: lines,
    vat,
    grandTotal,
    amountInWords: amountInWords(grandTotal),
  };
};
