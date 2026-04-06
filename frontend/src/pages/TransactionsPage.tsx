import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { EmptyState } from "@/components/feedback/EmptyState";
import { TransactionFilters } from "@/features/transactions/components/TransactionFilters";
import { TransactionTable } from "@/features/transactions/components/TransactionTable";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionFilters as TransactionFiltersType } from "@/types/api";

const defaultFilters: TransactionFiltersType = {
  page: 0,
  size: 10,
  sort: "date,desc",
  type: "",
  categoryId: "",
  fromDate: "",
  toDate: "",
};

export function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFiltersType>(defaultFilters);
  const categoriesQuery = useCategories();
  const transactionsQuery = useTransactions(filters);

  if (categoriesQuery.isError || transactionsQuery.isError) {
    return (
      <EmptyState
        eyebrow="Transactions"
        title="Transactions could not be loaded"
        description="Check API availability and authentication, then reload the page."
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Typography color="text.secondary">
        The page already supports backend pagination and filter parameters. Create and edit
        flows can be layered onto this foundation next without changing the route structure.
      </Typography>

      <TransactionFilters
        categories={categoriesQuery.data ?? []}
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(defaultFilters)}
      />

      <TransactionTable
        transactions={transactionsQuery.data}
        isLoading={transactionsQuery.isLoading}
        onPreviousPage={() =>
          setFilters((current) => ({ ...current, page: Math.max((current.page ?? 0) - 1, 0) }))
        }
        onNextPage={() =>
          setFilters((current) => ({ ...current, page: (current.page ?? 0) + 1 }))
        }
      />
    </Stack>
  );
}
