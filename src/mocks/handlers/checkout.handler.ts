import { http } from "msw";
import type { CheckoutCreditDto } from "@/types/checkout";
import { ok, problem } from "../data/db";
import { fileToDataUri } from "../data/file.utils";
import {
  buildCredit,
  buildOrder,
  credits,
  customerFromRequest,
  orders,
  parseItems,
  validateItems,
  validateStock,
} from "../data/order.db";
import { banks } from "./bank.handler";
import { PayMethod } from "@/types/enum";

const BASE = "*/item/v1/Checkout";

/** The client sends the enum key ("0"/"1"); views return the display name. */
const payMethodName = (key: string) => PayMethod[key as keyof typeof PayMethod] ?? key;

export const checkoutHandlers = [
  // Multipart: bankId, payMethod, receipt (file), items[n].variantId / quantity
  http.post(`${BASE}/Paid`, async ({ request }) => {
    const form = await request.formData();

    const bankId = String(form.get("bankId") ?? "");
    const payMethod = String(form.get("payMethod") ?? "").trim();
    const receipt = form.get("receipt");
    const items = parseItems(form);

    if (!banks.some((b) => b.id === bankId && !b.isDeleted && b.isActive)) {
      return problem(400, "Checkout failed", "Select an active bank account.");
    }
    if (!payMethod)
      return problem(400, "Checkout failed", "A payment method is required.");
    if (!(receipt instanceof File) || receipt.size === 0) {
      return problem(400, "Checkout failed", "A payment receipt is required.");
    }

    const itemsError = validateItems(items) ?? validateStock(items);
    if (itemsError) return problem(400, "Checkout failed", itemsError);

    const customer = customerFromRequest(request);
    orders.push(
      buildOrder(customer.id, items, false, new Date(), {
        bankId,
        payMethod: payMethodName(payMethod),
        receipt: await fileToDataUri(receipt),
      }),
    ); // waits for VerifyOrder

    return ok(null, 201);
  }),

  // JSON: { remark, items }
  http.post(`${BASE}/Credit`, async ({ request }) => {
    const body = (await request.json()) as CheckoutCreditDto;

    const itemsError = validateItems(body.items) ?? validateStock(body.items);
    if (itemsError) return problem(400, "Checkout failed", itemsError);

    const customer = customerFromRequest(request);
    const order = buildOrder(customer.id, body.items, true); // waits for ReviewCrdt
    orders.push(order);
    credits.push(buildCredit(order, body.remark ?? ""));

    return ok(null, 201);
  }),
];
