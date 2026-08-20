import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@/api/wallet";
import { useIsLoggedIn } from "@/store/useAuthStore";

export const walletKeys = {
  all: ["wallet"] as const,
  balance: () => [...walletKeys.all, "balance"] as const,
};

export function useWalletBalance() {
  const isLoggedIn = useIsLoggedIn();

  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: walletApi.getBalance,
    staleTime: 30_000,
    // 비로그인 상태에서는 호출하지 않음 (401 방지)
    enabled: isLoggedIn,
  });
}
