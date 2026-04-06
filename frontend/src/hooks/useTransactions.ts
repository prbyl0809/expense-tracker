import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { apiRequest, ApiError } from "@/lib/apiClient";
import { PagedResponse, Transaction, TransactionFilters } from "@/types/api";

export function useTransactions(filters: TransactionFilters) {
  const { token, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const hasFilters =
    Boolean(filters.fromDate) ||
    Boolean(filters.toDate) ||
    Boolean(filters.type) ||
    Boolean(filters.categoryId);

  return useQuery({
    queryKey: ["transactions", filters],
    enabled: isAuthenticated,
    queryFn: async () => {
      try {
        return await apiRequest<PagedResponse<Transaction>>(
          hasFilters ? "/api/transactions/filter" : "/api/transactions",
          {
            token,
            query: {
              page: filters.page ?? 0,
              size: filters.size ?? 10,
              sort: filters.sort ?? "date,desc",
              fromDate: filters.fromDate,
              toDate: filters.toDate,
              type: filters.type,
              categoryId: filters.categoryId,
            },
          },
        );
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          logout();
          navigate("/login", { replace: true });
        }
        throw error;
      }
    },
  });
}
