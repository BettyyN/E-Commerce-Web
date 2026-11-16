import { customers } from "./db";
import { variants, products, currentPrice, splitPrice } from "./product.db";
import { svgPlaceholder } from "./file.utils";

export { money } from "./file.utils";

export interface OrderItem {
  variantId: string;
  quantity: number;
}

export interface MockOrderItem extends OrderItem {
  id: string;
  unitPrice: number; // per unit, VAT excluded
  vat: number;
  total: number;
}

export type OrderStatus = "Pending" | "Verified" | "Approved" | "Rejected";

export interface OrderPayInput {
  bankId: string;
  payMethod: string;
  receipt: string; // data URI
}

export interface MockOrderPayment extends OrderPayInput {
  amount: number;
  payDate: string;
}

export interface MockOrder {
  id: string;
  code: string;
  customerId: string;
  isCredit: boolean;
  status: OrderStatus;
  items: MockOrderItem[];
  subTotal: number;
  vat: number;
  total: number;
  hasShipping: boolean;
  orderDate: string;
  isDeleted: boolean;
  payment: MockOrderPayment | null; // null for credit orders
}

export interface MockCredit {
  id: string;
  code: string;
  orderId: string;
  orderCode: string;
  customerId: string;
  remark: string;
  total: number;
  dueDate: string | null; // set when the credit order is approved
  appDate: string | null;
  createdAt: string;
  isDeleted: boolean;
}

export interface MockCreditPayment {
  id: string;
  code: string;
  creditId: string;
  bankId: string;
  payMethod: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  payDate: string;
  reviewedAt: string | null;
  receipt: string; // data URI
}

/* ---------- pricing ---------- */

const round = (n: number) => Math.round(n * 100) / 100;

const FALLBACK_PRICE = 250;

export const itemPricing = (variantId: string, quantity: number) => {
  const unitTotal = currentPrice(variantId) ?? FALLBACK_PRICE;
  const total = round(unitTotal * quantity);
  const unitPrice = splitPrice(unitTotal).price;

  return { unitPrice, vat: round(total - unitPrice * quantity), total };
};

export const productName = (variantId: string) => {
  const variant = variants.find((v) => v.id === variantId);
  const product = products.find((p) => p.id === variant?.productId);

  return variant && product
    ? `${product.name} - ${variant.name}`
    : `Variant ${variantId}`;
};

// Every variant must exist, be active, and have enough stock
export const validateStock = (items: OrderItem[]): string | null => {
  for (const item of items) {
    const variant = variants.find(
      (v) => v.id === item.variantId && !v.isDeleted && v.isActive,
    );

    if (!variant) return `Product variant ${item.variantId} is not available.`;
    if (item.quantity > variant.quantity) {
      return `Only ${variant.quantity} left in stock for ${productName(item.variantId)}.`;
    }
  }

  return null;
};

/* ---------- builders ---------- */

let seq = 100;
let paySeq = 101;

export const nextPayCode = () => `PAY-${paySeq++}`;

export const buildOrder = (
  customerId: string,
  items: OrderItem[],
  isCredit: boolean,
  orderDate = new Date(),
  pay: OrderPayInput | null = null,
): MockOrder => {
  seq += 1;

  const orderItems: MockOrderItem[] = items.map((i) => ({
    ...i,
    id: crypto.randomUUID(),
    ...itemPricing(i.variantId, i.quantity),
  }));

  const total = round(orderItems.reduce((sum, i) => sum + i.total, 0));
  const vat = round(orderItems.reduce((sum, i) => sum + i.vat, 0));

  return {
    id: crypto.randomUUID(),
    code: `ORD-${seq}`,
    customerId,
    isCredit,
    status: "Pending",
    items: orderItems,
    subTotal: round(total - vat),
    vat,
    total,
    hasShipping: false,
    orderDate: orderDate.toISOString(),
    isDeleted: false,
    payment: pay
      ? { ...pay, amount: total, payDate: orderDate.toISOString() }
      : null,
  };
};

export const buildCredit = (order: MockOrder, remark = ""): MockCredit => ({
  id: crypto.randomUUID(),
  code: `CR-${order.code.split("-")[1]}`,
  orderId: order.id,
  orderCode: order.code,
  customerId: order.customerId,
  remark,
  total: order.total,
  dueDate: null,
  appDate: null,
  createdAt: order.orderDate,
  isDeleted: false,
});

// Called when a credit order is approved: days = how long the customer has to pay
export const setTerms = (
  credit: MockCredit,
  days: number,
  from = new Date(),
) => {
  const due = new Date(from);
  due.setDate(due.getDate() + days);
  credit.appDate = from.toISOString();
  credit.dueDate = due.toISOString();
};

/* ---------- seed data ---------- */

const RECEIPT = svgPlaceholder("R", "#64748b");

const seedOrder = (
  over: Pick<MockOrder, "id" | "customerId" | "isCredit" | "status"> &
    Partial<MockOrder>,
  items: OrderItem[],
  date: string,
  pay: Omit<OrderPayInput, "receipt"> | null = null,
): MockOrder => ({
  ...buildOrder(
    over.customerId,
    items,
    over.isCredit,
    new Date(date),
    pay ? { ...pay, receipt: RECEIPT } : null,
  ),
  ...over,
});

export const orders: MockOrder[] = [
  seedOrder(
    {
      id: "o-100",
      customerId: "c-100",
      isCredit: true,
      status: "Approved",
      hasShipping: true,
    },
    [{ variantId: "v-100", quantity: 2 }],
    "2026-06-01",
  ),
  seedOrder(
    { id: "o-101", customerId: "c-102", isCredit: true, status: "Approved" },
    [{ variantId: "v-101", quantity: 4 }],
    "2026-05-10",
  ),
  seedOrder(
    { id: "o-102", customerId: "c-100", isCredit: false, status: "Pending" },
    [
      { variantId: "v-102", quantity: 1 },
      { variantId: "v-100", quantity: 3 },
    ],
    "2026-09-15",
    { bankId: "b-100", payMethod: "Bank transfer" },
  ),
  seedOrder(
    { id: "o-103", customerId: "c-102", isCredit: true, status: "Pending" },
    [{ variantId: "v-101", quantity: 6 }],
    "2026-09-17",
  ),
  seedOrder(
    {
      id: "o-104",
      customerId: "c-101",
      isCredit: false,
      status: "Verified",
      hasShipping: true,
    },
    [{ variantId: "v-103", quantity: 2 }],
    "2026-08-20",
    { bankId: "b-101", payMethod: "Mobile banking" },
  ),
];

const seedCredit = (
  id: string,
  order: MockOrder,
  remark: string,
  days: number,
  from?: string,
) => {
  const credit = { ...buildCredit(order, remark), id };
  if (from) setTerms(credit, days, new Date(from));
  return credit;
};

export const credits: MockCredit[] = [
  seedCredit("cr-100", orders[0], "Seed unpaid credit", 30, "2026-06-02"),
  seedCredit("cr-101", orders[1], "Seed paid credit", 30, "2026-05-11"),
  seedCredit("cr-102", orders[3], "Seed credit awaiting review", 0),
];

export const creditPayments: MockCreditPayment[] = [
  {
    id: "cp-100",
    code: "PAY-100",
    creditId: "cr-101",
    bankId: "b-100",
    payMethod: "Bank transfer",
    amount: credits[1].total,
    status: "Approved",
    payDate: "2026-05-20T09:00:00.000Z",
    reviewedAt: "2026-05-21T10:00:00.000Z",
    receipt: RECEIPT,
  },
];

// paid = sum of approved payments; pending/rejected payments don't count
export const creditTotals = (credit: MockCredit) => {
  const paid = creditPayments
    .filter((p) => p.creditId === credit.id && p.status === "Approved")
    .reduce((sum, p) => sum + p.amount, 0);
  const remain = Math.max(credit.total - paid, 0);

  return { paid, remain, isPaid: remain <= 0 };
};

// Reads the customer from the mock JWT's cId claim (falls back to the first customer)
export const customerFromRequest = (request: Request) => {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  try {
    const payload = JSON.parse(
      atob(token!.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    const found = customers.find((c) => c.id === payload.cId);
    if (found) return found;
  } catch {
    // no / malformed token: fall through
  }

  return customers[0];
};

// Raw role claim ("cust" | "emp" | "mngr" | "admin") from the mock JWT
export const roleFromRequest = (request: Request): string => {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  try {
    const payload = JSON.parse(
      atob(token!.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return String(payload.r ?? "");
  } catch {
    return "";
  }
};

/* ---------- form / item helpers ---------- */

// Reads items[0].variantId / items[0].quantity ... from multipart form data
export const parseItems = (form: FormData): OrderItem[] => {
  const byIndex = new Map<number, Partial<OrderItem>>();

  for (const [key, value] of form.entries()) {
    const match = key.match(/^items\[(\d+)\]\.(variantId|quantity)$/i);
    if (!match) continue;

    const index = Number(match[1]);
    const entry = byIndex.get(index) ?? {};

    if (match[2].toLowerCase() === "variantid") entry.variantId = String(value);
    else entry.quantity = Number(value);

    byIndex.set(index, entry);
  }

  return [...byIndex.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, item]) => item as OrderItem);
};

export const validateItems = (
  items: OrderItem[] | undefined,
): string | null => {
  if (!items || items.length === 0) return "At least one item is required.";

  const invalid = items.some(
    (i) => !i.variantId || !Number.isFinite(i.quantity) || i.quantity <= 0,
  );

  return invalid
    ? "Every item needs a variant and a quantity greater than zero."
    : null;
};
