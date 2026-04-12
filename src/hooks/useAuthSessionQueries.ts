import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authSessionApi } from "@/api/auth/sessions";
import { useAuthStore } from "@/store/useAuthStore";

export const authSessionKeys = {
  all: ["auth", "sessions"] as const,
};

export function useAuthSessions() {
  const isLoggedIn = useAuthStore((state) => state.tokens != null);

  return useQuery({
    queryKey: authSessionKeys.all,
    queryFn: authSessionApi.getSessions,
    enabled: isLoggedIn,
    staleTime: 30_000,
  });
}

export function useRevokeAuthSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tokenFamilyId: string) => authSessionApi.revokeSession(tokenFamilyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authSessionKeys.all });
    },
  });
}
