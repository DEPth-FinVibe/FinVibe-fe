import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  assetPortfolioApi,
  type CreatePortfolioGroupBody,
  type TransferAssetBody,
  type UpdatePortfolioGroupBody,
} from "@/api/asset";

export const portfolioKeys = {
  all: ["portfolio"] as const,
  list: () => [...portfolioKeys.all, "list"] as const,
  assets: (portfolioId: number) =>
    [...portfolioKeys.all, "assets", portfolioId] as const,
  comparison: () => [...portfolioKeys.all, "comparison"] as const,
  allocation: () => [...portfolioKeys.all, "allocation"] as const,
  performanceChart: (
    startDate: string,
    endDate: string,
    interval: "DAILY" | "WEEKLY" | "MONTHLY",
  ) =>
    [...portfolioKeys.all, "performance-chart", startDate, endDate, interval] as const,
};

export function usePortfolioGroups() {
  return useQuery({
    queryKey: portfolioKeys.list(),
    queryFn: assetPortfolioApi.getPortfolios,
    staleTime: 30_000,
  });
}

export function usePortfolioAssets(
  portfolioId: number | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: portfolioKeys.assets(portfolioId ?? 0),
    queryFn: () => assetPortfolioApi.getAssetsByPortfolio(portfolioId!),
    enabled: enabled && portfolioId != null,
    staleTime: 30_000,
  });
}

export function usePortfolioAssetsQueries(portfolioIds: number[]) {
  return useQueries({
    queries: portfolioIds.map((portfolioId) => ({
      queryKey: portfolioKeys.assets(portfolioId),
      queryFn: () => assetPortfolioApi.getAssetsByPortfolio(portfolioId),
      staleTime: 30_000,
    })),
  });
}

export function usePortfolioComparison() {
  return useQuery({
    queryKey: portfolioKeys.comparison(),
    queryFn: assetPortfolioApi.getPortfolioComparison,
    staleTime: 30_000,
  });
}

export function useAssetAllocation() {
  return useQuery({
    queryKey: portfolioKeys.allocation(),
    queryFn: assetPortfolioApi.getAssetAllocation,
    staleTime: 30_000,
  });
}

export function usePortfolioPerformanceChart(
  startDate: string,
  endDate: string,
  interval: "DAILY" | "WEEKLY" | "MONTHLY",
) {
  return useQuery({
    queryKey: portfolioKeys.performanceChart(startDate, endDate, interval),
    queryFn: () =>
      assetPortfolioApi.getPerformanceChart(startDate, endDate, interval),
    staleTime: 30_000,
  });
}

export function useCreatePortfolioGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreatePortfolioGroupBody) =>
      assetPortfolioApi.createPortfolio(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.comparison() });
    },
  });
}

export function useUpdatePortfolioGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      portfolioGroupId,
      body,
    }: {
      portfolioGroupId: number;
      body: UpdatePortfolioGroupBody;
    }) => assetPortfolioApi.updatePortfolio(portfolioGroupId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.comparison() });
    },
  });
}

export function useDeletePortfolioGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (portfolioGroupId: number) =>
      assetPortfolioApi.deletePortfolio(portfolioGroupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}

export function useTransferPortfolioAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sourcePortfolioId,
      assetId,
      body,
    }: {
      sourcePortfolioId: number;
      assetId: number;
      body: TransferAssetBody;
    }) =>
      assetPortfolioApi.transferAsset(sourcePortfolioId, assetId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.assets(variables.sourcePortfolioId),
      });
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.assets(variables.body.targetPortfolioId),
      });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.comparison() });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.allocation() });
    },
  });
}
