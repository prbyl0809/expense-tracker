import { Card, CardContent, LinearProgress, Stack, Typography } from "@mui/material";
import { CategorySummary } from "@/types/api";

interface CategoryBreakdownProps {
  items: CategorySummary[];
}

export function CategoryBreakdown({ items }: CategoryBreakdownProps) {
  const maxAmount = Math.max(...items.map((item) => Math.abs(Number(item.totalAmount))), 0);

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={2.5}>
          <Typography variant="h5">Category pressure</Typography>
          {items.length === 0 ? (
            <Typography color="text.secondary">
              No category activity for the selected period yet.
            </Typography>
          ) : (
            items.map((item) => {
              const amount = Math.abs(Number(item.totalAmount));
              const progress = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;

              return (
                <Stack key={`${item.type}-${item.categoryId}`} spacing={1.1}>
                  <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Typography variant="subtitle2">{item.categoryName}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    color={item.type === "INCOME" ? "success" : "secondary"}
                    value={progress}
                    variant="determinate"
                  />
                </Stack>
              );
            })
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
