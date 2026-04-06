import { useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { apiRequest, ApiError } from "@/lib/apiClient";
import {
  PagedResponse,
  Transaction,
  TransactionFilters,
  TransactionPayload,
} from "@/types/api";

export function useTransactions(filters: TransactionFilters) {
  const { token, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasFilters =
    Boolean(filters.fromDate) ||
    Boolean(filters.toDate) ||
    Boolean(filters.type) ||
    Boolean(filters.categoryId);

  const fetchTransactions = useCallback(async (pageFilters: TransactionFilters) => {
    try {
      return await apiRequest<PagedResponse<Transaction>>(
        hasFilters ? "/api/transactions/filter" : "/api/transactions",
        {
          token,
          query: {
            page: pageFilters.page ?? 0,
            size: pageFilters.size ?? 10,
            sort: pageFilters.sort ?? "date,desc",
            fromDate: pageFilters.fromDate,
            toDate: pageFilters.toDate,
            type: pageFilters.type,
            categoryId: pageFilters.categoryId,
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
  }, [hasFilters, logout, navigate, token]);

  const query = useQuery({
    queryKey: ["transactions", filters],
    enabled: isAuthenticated,
    placeholderData: (previousData) => previousData,
    queryFn: () => fetchTransactions(filters),
  });

  useEffect(() => {
    if (!isAuthenticated || !query.data || query.data.last) {
      return;
    }

    const nextFilters: TransactionFilters = {
      ...filters,
      page: (filters.page ?? 0) + 1,
    };

    void queryClient.prefetchQuery({
      queryKey: ["transactions", nextFilters],
      queryFn: () => fetchTransactions(nextFilters),
    });
  }, [filters, fetchTransactions, isAuthenticated, query.data, queryClient]);

  return query;
}

export function useTransactionMutations() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary"],
      }),
    ]);
  };

  const wrap = async <T,>(callback: () => Promise<T>) => {
    try {
      return await callback();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
        navigate("/login", { replace: true });
      }
      throw error;
    }
  };

  const createTransaction = useMutation({
    mutationFn: (payload: TransactionPayload) =>
      wrap(() =>
        apiRequest<Transaction>("/api/transactions", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        }),
      ),
    onSuccess: async () => {
      await invalidate();
      showSnackbar("Transaction created.", "success");
    },
  });

  const updateTransaction = useMutation({
    mutationFn: ({
      transactionId,
      payload,
    }: {
      transactionId: number;
      payload: TransactionPayload;
    }) =>
      wrap(() =>
        apiRequest<Transaction>(`/api/transactions/${transactionId}`, {
          method: "PUT",
          token,
          body: JSON.stringify(payload),
        }),
      ),
    onSuccess: async () => {
      await invalidate();
      showSnackbar("Transaction updated.", "success");
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: (transactionId: number) =>
      wrap(() =>
        apiRequest<void>(`/api/transactions/${transactionId}`, {
          method: "DELETE",
          token,
        }),
      ),
    onSuccess: async () => {
      await invalidate();
      showSnackbar("Transaction deleted.", "success");
    },
  });

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
