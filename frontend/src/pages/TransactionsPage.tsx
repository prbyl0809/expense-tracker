import { useState } from "react";
import AddRounded from "@mui/icons-material/AddRounded";
import { Button, Stack, Typography } from "@mui/material";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { TransactionEditorCard } from "@/features/transactions/components/TransactionEditorCard";
import { TransactionFilters } from "@/features/transactions/components/TransactionFilters";
import { TransactionListCard } from "@/features/transactions/components/TransactionListCard";
import { useCategories } from "@/hooks/useCategories";
import { useTransactionMutations, useTransactions } from "@/hooks/useTransactions";
import { ApiError } from "@/lib/apiClient";
import {
  Transaction,
  TransactionFilters as TransactionFiltersType,
  TransactionPayload,
} from "@/types/api";

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
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionPendingDelete, setTransactionPendingDelete] = useState<Transaction | null>(
    null,
  );
  const categoriesQuery = useCategories();
  const transactionsQuery = useTransactions(filters);
  const { createTransaction, updateTransaction, deleteTransaction } = useTransactionMutations();
  const { showSnackbar } = useSnackbar();

  const isSubmitting = createTransaction.isPending || updateTransaction.isPending;

  const handleSubmit = async (payload: TransactionPayload, transactionId?: number) => {
    if (transactionId) {
      await updateTransaction.mutateAsync({
        transactionId,
        payload,
      });
      setIsEditorOpen(false);
      setEditingTransaction(null);
      return;
    }

    await createTransaction.mutateAsync(payload);
    setIsEditorOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionPendingDelete) {
      return;
    }
    try {
      await deleteTransaction.mutateAsync(transactionPendingDelete.id);

      if (editingTransaction?.id === transactionPendingDelete.id) {
        setEditingTransaction(null);
        setIsEditorOpen(false);
      }
      setTransactionPendingDelete(null);
    } catch (error) {
      showSnackbar(
        error instanceof ApiError ? error.message : "Deleting transaction failed.",
        "error",
      );
    }
  };

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
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Typography color="text.secondary">
          Manage entries directly from this page: filter the list, add a new
          transaction, update an existing one, or remove incorrect records.
        </Typography>
        <Button
          startIcon={<AddRounded />}
          variant="contained"
          onClick={() => {
            setEditingTransaction(null);
            setIsEditorOpen(true);
          }}
        >
          Add transaction
        </Button>
      </Stack>

      <TransactionFilters
        categories={categoriesQuery.data ?? []}
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(defaultFilters)}
      />

      <TransactionEditorCard
        categories={categoriesQuery.data ?? []}
        isSubmitting={isSubmitting}
        open={isEditorOpen}
        transaction={editingTransaction}
        onCancel={() => {
          setEditingTransaction(null);
          setIsEditorOpen(false);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        confirmLabel="Delete transaction"
        description={`This will permanently remove "${transactionPendingDelete?.description || transactionPendingDelete?.categoryName || "this transaction"}".`}
        isSubmitting={deleteTransaction.isPending}
        open={Boolean(transactionPendingDelete)}
        title="Delete transaction?"
        onCancel={() => setTransactionPendingDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

      <TransactionListCard
        isDeleting={deleteTransaction.isPending}
        isFetching={transactionsQuery.isFetching}
        isLoading={transactionsQuery.isLoading && !transactionsQuery.data}
        transactions={transactionsQuery.data}
        onDelete={setTransactionPendingDelete}
        onEdit={(transaction) => {
          setEditingTransaction(transaction);
          setIsEditorOpen(true);
        }}
        onPreviousPage={() =>
          setFilters((current) => ({
            ...current,
            page: Math.max((current.page ?? 0) - 1, 0),
          }))
        }
        onNextPage={() =>
          setFilters((current) => ({ ...current, page: (current.page ?? 0) + 1 }))
        }
      />
    </Stack>
  );
}
