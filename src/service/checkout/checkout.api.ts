import type { CheckoutPayDto, CheckoutCreditDto } from "@/types/checkout";
import { api, getErrorMessage, multipart } from "../api";

const BASE = `${import.meta.env.VITE_ITEM_URL}/Checkout`;

// Array items go out as items[0].variantId, items[0].quantity, ... which is
// the form shape ASP.NET model binding reads into List<OrderItemsAdd>.
const buildPaidForm = (payload: CheckoutPayDto) => {
  const form = new FormData();
  form.append("bankId", payload.bankId);
  form.append("payMethod", payload.payMethod);
  form.append("receipt", payload.receipt);

  payload.items.forEach((item, i) => {
    form.append(`items[${i}].variantId`, item.variantId);
    form.append(`items[${i}].quantity`, String(item.quantity));
  });

  return form;
};

export const checkoutApi = {
  paid: async (payload: CheckoutPayDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(
        `${BASE}/Paid`,
        buildPaidForm(payload),
        multipart,
      );
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },

  credit: async (payload: CheckoutCreditDto): Promise<string | undefined> => {
    try {
      const { data } = await api.post(`${BASE}/Credit`, payload);
      return data?.message;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  },
};
