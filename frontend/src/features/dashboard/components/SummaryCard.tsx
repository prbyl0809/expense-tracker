import TrendingDownRounded from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";

interface SummaryCardProps {
  label: string;
  value: string;
  tone: "income" | "expense" | "neutral";
}

export function SummaryCard({ label, value, tone }: SummaryCardProps) {
  const isIncome = tone === "income";
  const isExpense = tone === "expense";
  const accent = isIncome
    ? { bg: "#dff7ee", fg: "#37b77a" }
    : isExpense
      ? { bg: "#e7f1ff", fg: "#5aa5f2" }
      : { bg: "#ede8ff", fg: "#7c5cff" };

  return (
    <Card sx={{ height: "100%", borderRadius: 2.5 }}>
      <CardContent>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: accent.bg,
                color: accent.fg,
              }}
            >
              {isIncome ? (
                <TrendingUpRounded />
              ) : isExpense ? (
                <TrendingDownRounded />
              ) : (
                <TrendingUpRounded />
              )}
            </Avatar>
            <Stack spacing={0.25}>
              <Typography color="text.secondary" variant="body2">
                {label}
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
