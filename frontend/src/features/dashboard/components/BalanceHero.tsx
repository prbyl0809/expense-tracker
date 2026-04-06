import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

interface BalanceHeroProps {
  balance: string;
  periodLabel: string;
  transactionCount: number;
}

export function BalanceHero({
  balance,
  periodLabel,
  transactionCount,
}: BalanceHeroProps) {
  return (
    <Card
      sx={{
        overflow: "hidden",
        backgroundImage: "none",
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={3}
        >
          <Box>
            <Typography color="secondary.main" variant="overline">
              Current snapshot
            </Typography>
            <Typography sx={{ mt: 1 }} variant="h2">
              {balance}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }} variant="body1">
              Net result for {periodLabel}
            </Typography>
          </Box>

          <Stack alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={1}>
            <Chip color="secondary" label={`${transactionCount} transactions`} />
            <Typography color="text.secondary" variant="body2">
              Positive balance means income still exceeds current-month expense volume.
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
