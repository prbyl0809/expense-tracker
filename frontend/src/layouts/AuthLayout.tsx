import {
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { ThemeToggleButton } from "@/components/navigation/ThemeToggleButton";

export function AuthLayout() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
        px: 2,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3} alignItems="stretch">
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              sx={{
                position: "relative",
                overflow: "hidden",
                minHeight: { xs: 260, lg: "calc(100vh - 96px)" },
                p: { xs: 3, md: 5 },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(180deg, #22183c 0%, #181c2b 100%)"
                      : "linear-gradient(180deg, #d1c5f3 0%, #f6f2ff 100%)",
                }}
              />

              <Stack
                sx={{ position: "relative", height: "100%" }}
                justifyContent="space-between"
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography color={isDark ? "common.white" : "primary.dark"} variant="h4">
                    ExpenseTracker
                  </Typography>
                  <ThemeToggleButton />
                </Stack>

                <Stack spacing={2.5} sx={{ maxWidth: 560 }}>
                  <Typography color={isDark ? "#bca8ff" : "primary.main"} variant="overline">
                    Finance Without Friction
                  </Typography>
                  <Typography color={isDark ? "common.white" : "primary.dark"} variant="h2">
                    A sharper personal ledger for daily money decisions.
                  </Typography>
                  <Typography
                    color={isDark ? "rgba(255,255,255,0.78)" : "#645a85"}
                    sx={{ mb: 6 }}
                    variant="body1"
                  >
                    Sign in to review balance flow, category pressure, and recent
                    transactions from the backend you already hardened.
                  </Typography>
                </Stack>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  {[
                    { label: "JWT auth", value: "live" },
                    { label: "Dashboard API", value: "wired" },
                    { label: "Theme mode", value: "ready" },
                  ].map((item) => (
                    <Paper
                      key={item.label}
                      sx={{
                        flex: 1,
                        p: 2.5,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(138,99,255,0.12)"
                            : "rgba(255,255,255,0.72)",
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(188,168,255,0.14)"
                            : "rgba(124,92,255,0.12)",
                      }}
                    >
                      <Typography
                        color={isDark ? "rgba(255,255,255,0.7)" : "#7a71a0"}
                        variant="body2"
                      >
                        {item.label}
                      </Typography>
                      <Typography color={isDark ? "common.white" : "primary.dark"} variant="h5">
                        {item.value}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              sx={{
                minHeight: { xs: "auto", lg: "calc(100vh - 96px)" },
                display: "grid",
                alignItems: "center",
                p: { xs: 3, md: 5 },
              }}
            >
              <Outlet />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
