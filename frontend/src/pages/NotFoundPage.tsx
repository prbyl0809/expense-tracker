import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 3,
      }}
    >
      <Stack spacing={2} alignItems="flex-start" sx={{ maxWidth: 520 }}>
        <Typography color="secondary.main" variant="overline">
          404
        </Typography>
        <Typography variant="h2">This page is outside the ledger.</Typography>
        <Typography color="text.secondary">
          The requested route does not exist in the current frontend shell.
        </Typography>
        <Button
          component={RouterLink}
          startIcon={<ArrowBackRounded />}
          to="/"
          variant="contained"
        >
          Back to the app
        </Button>
      </Stack>
    </Box>
  );
}
