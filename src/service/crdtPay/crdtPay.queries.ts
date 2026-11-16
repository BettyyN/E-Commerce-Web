import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crdtPayApi } from "./crdtPay.api";
import { creditKeys } from "../credit/credit.key";
import type { CrdtPayAddDto } from "@/types/creditPay";
import type { StatChangeDto } from "@/types/dto";
import { payKeys } from "../pay/pay.key";
import { myDataKeys } from "../myData/myData.key";

export const useAddCreditPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, CrdtPayAddDto>({
    mutationFn: crdtPayApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: payKeys.all });
    },
  });
};

export const useReviewCreditPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, StatChangeDto>({
    mutationFn: crdtPayApi.review,
    onSuccess: () => {
      // approving a payment moves paid/remain and can flip unpaid -> paid
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: payKeys.all });
       queryClient.invalidateQueries({ queryKey: myDataKeys.all });
       queryClient.invalidateQueries({ queryKey: payKeys.all });
    },
  });
};

export const useDeleteCreditPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<string | undefined, Error, string>({
    mutationFn: crdtPayApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: payKeys.all });
    },
  });
};
