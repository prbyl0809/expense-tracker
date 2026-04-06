import { Grid, Stack, Typography } from "@mui/material";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useCategories } from "@/hooks/useCategories";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { useTransactions } from "@/hooks/useTransactions";
import { BalanceHero } from "@/features/dashboard/components/BalanceHero";
import { CategoryBreakdown } from "@/features/dashboard/components/CategoryBreakdown";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { TransactionTable } from "@/features/transactions/components/TransactionTable";

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function DashboardPage() {
  const summaryQuery = useDashboardSummary();
  const categoriesQuery = useCategories();
  const transactionsQuery = useTransactions({
    page: 0,
    size: 5,
    sort: "date,desc",
  });

  if (summaryQuery.isError) {
    return (
      <EmptyState
        eyebrow="Dashboard"
        title="Dashboard data is unavailable"
        description="Check whether the backend is running and the authenticated session is still valid."
      />
    );
  }

  const summary = summaryQuery.data;

  return (
    <Stack spacing={3}>
      <BalanceHero
        balance={formatCurrency(Number(summary?.balance ?? 0))}
        periodLabel={
          summary ? `${summary.fromDate} to ${summary.toDate}` : "the current month"
        }
        transactionCount={summary?.transactionCount ?? 0}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            label="Income"
            value={formatCurrency(Number(summary?.totalIncome ?? 0))}
            tone="income"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            label="Expense"
            value={formatCurrency(Number(summary?.totalExpense ?? 0))}
            tone="expense"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            label="Categories"
            value={String(categoriesQuery.data?.length ?? 0)}
            tone="neutral"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, xl: 5 }}>
          <CategoryBreakdown items={summary?.categorySummaries ?? []} />
        </Grid>
        <Grid size={{ xs: 12, xl: 7 }}>
          <Stack spacing={2}>
            <Typography variant="h5">Recent transactions</Typography>
            <TransactionTable
              transactions={transactionsQuery.data}
              isLoading={transactionsQuery.isLoading}
              onPreviousPage={() => undefined}
              onNextPage={() => undefined}
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
