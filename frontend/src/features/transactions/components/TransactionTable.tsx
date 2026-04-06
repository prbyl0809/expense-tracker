import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import NavigateBeforeRounded from "@mui/icons-material/NavigateBeforeRounded";
import NavigateNextRounded from "@mui/icons-material/NavigateNextRounded";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PagedResponse, Transaction } from "@/types/api";

interface TransactionTableProps {
  transactions: PagedResponse<Transaction> | undefined;
  isLoading: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function TransactionTable({
  transactions,
  isLoading,
  onPreviousPage,
  onNextPage,
}: TransactionTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary">Loading transactions...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.content.length === 0) {
    return (
      <EmptyState
        eyebrow="Transactions"
        title="Nothing to review yet"
        description="Once data comes in, this list will show paginated transaction activity from the backend."
      />
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2.5}>
          {transactions.content.map((transaction, index) => (
            <Box key={transaction.id}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle1">
                      {transaction.description || "Untitled transaction"}
                    </Typography>
                    <Chip
                      color={transaction.type === "INCOME" ? "success" : "secondary"}
                      label={transaction.type}
                      size="small"
                    />
                  </Stack>
                  <Typography color="text.secondary" variant="body2">
                    {transaction.categoryName} • {transaction.date}
                  </Typography>
                </Box>

                <Typography
                  color={transaction.type === "INCOME" ? "success.main" : "text.primary"}
                  variant="h6"
                >
                  {Number(transaction.amount).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </Typography>
              </Stack>
              {index < transactions.content.length - 1 ? <Divider sx={{ mt: 2.5 }} /> : null}
            </Box>
          ))}

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography color="text.secondary" variant="body2">
              Page {transactions.page + 1} of {Math.max(transactions.totalPages, 1)} •{" "}
              {transactions.totalElements} items
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton disabled={transactions.first} onClick={onPreviousPage}>
                <NavigateBeforeRounded />
              </IconButton>
              <IconButton disabled={transactions.last} onClick={onNextPage}>
                <NavigateNextRounded />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
