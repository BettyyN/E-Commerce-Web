import { useMutation } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import type { LoginDto, LoginResDto } from "@/types/auth/auth";
import type { CustReg, RegRes } from "@/types/auth/register";
import { useAuthStore } from "@/store/auth.store";

/* LOGIN */
export const useLogin = () => {
  return useMutation<LoginResDto, unknown, LoginDto>({
    mutationFn: authApi.login,

    onSuccess: (data) => {
      useAuthStore
        .getState()
        .login(data.accessToken, data.refreshToken, data.expiresDate);
    },
  });
};

/* REGISTER */
export const useRegister = () => {
  return useMutation<RegRes, unknown, CustReg>({
    mutationFn: authApi.register,
  });
};
