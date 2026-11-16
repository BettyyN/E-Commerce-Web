import { http } from "msw";
import type { StatChangeDto } from "@/types/dto";
import { ok, problem, notFound } from "../data/db";
import { fileToDataUri } from "../data/file.utils";
import {
  credits,
  creditPayments,
  creditTotals,
  nextPayCode,
} from "../data/order.db";
import { banks } from "./bank.handler";
import { PayMethod } from "@/types/enum";

const BASE = "*/item/v1/CrdtPay";

/** The client sends the enum key ("0"/"1"); views return the display name. */
const payMethodName = (key: string) => PayMethod[key as keyof typeof PayMethod] ?? key;

export const crdtPayHandlers = [
  // Multipart: payMethod, amount, creditId, bankId, receipt (file)
  http.post(`${BASE}/Add`, async ({ request }) => {
    const form = await request.formData();

    const payMethod = String(form.get("payMethod") ?? "").trim();
    const amount = Number(form.get("amount"));
    const creditId = String(form.get("creditId") ?? "");
    const bankId = String(form.get("bankId") ?? "");
    const receipt = form.get("receipt");

    const credit = credits.find((c) => c.id === creditId && !c.isDeleted);
    if (!credit)
      return problem(
        400,
        "Payment failed",
        "The selected credit was not found.",
      );

    if (!banks.some((b) => b.id === bankId && !b.isDeleted && b.isActive)) {
      return problem(400, "Payment failed", "Select an active bank account.");
    }
    if (!payMethod)
      return problem(400, "Payment failed", "A payment method is required.");
    if (!Number.isFinite(amount) || amount <= 0) {
      return problem(
        400,
        "Payment failed",
        "Amount must be greater than zero.",
      );
    }
    if (!(receipt instanceof File) || receipt.size === 0) {
      return problem(400, "Payment failed", "A payment receipt is required.");
    }

    const { remain } = creditTotals(credit);
    if (amount > remain) {
      return problem(
        400,
        "Payment failed",
        "Amount is greater than the remaining balance.",
      );
    }

    creditPayments.push({
      id: crypto.randomUUID(),
      code: nextPayCode(),
      creditId,
      bankId,
      payMethod: payMethodName(payMethod),
      amount,
      status: "Pending",
      payDate: new Date().toISOString(),
      reviewedAt: null,
      receipt: await fileToDataUri(receipt),
    });

    return ok(null, 201);
  }),

  // stat: true = approve, false = reject
  http.post(`${BASE}/Review`, async ({ request }) => {
    const { id, stat } = (await request.json()) as StatChangeDto;

    const payment = creditPayments.find((p) => p.id === id);
    if (!payment) return notFound("Credit payment");

    if (payment.status !== "Pending") {
      return problem(
        400,
        "Review failed",
        "This payment has already been reviewed.",
      );
    }

    payment.status = stat ? "Approved" : "Rejected";
    payment.reviewedAt = new Date().toISOString();
    return ok(null, 201);
  }),

  http.delete(`${BASE}/Del/:id`, ({ params }) => {
    const index = creditPayments.findIndex((p) => p.id === params.id);
    if (index === -1) return notFound("Credit payment");

    if (creditPayments[index].status === "Approved") {
      return problem(
        400,
        "Delete failed",
        "An approved payment cannot be deleted.",
      );
    }

    creditPayments.splice(index, 1);
    return ok();
  }),
];
