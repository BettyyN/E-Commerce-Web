import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutApi } from "./checkout.api";
import { creditKeys } from "../credit/credit.key";
import { orderKeys } from "../order/order.key"; // adjust path
import type { CheckoutPayDto, CheckoutCreditDto } from "@/types/checkout";

export const useCheckoutPaid = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, CheckoutPayDto>({
    mutationFn: checkoutApi.paid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

export const useCheckoutCredit = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, CheckoutCreditDto>({
    mutationFn: checkoutApi.credit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
    },
  });
};
