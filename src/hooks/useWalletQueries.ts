import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@/api/wallet";

export const walletKeys = {
  all: ["wallet"] as const,
  balance: () => [...walletKeys.all, "balance"] as const,
};

export function useWalletBalance() {
  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: walletApi.getBalance,
    staleTime: 30_000,
  });
}
