import MenuRounded from "@mui/icons-material/MenuRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggleButton } from "@/components/navigation/ThemeToggleButton";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";

const routeCopy: Record<string, { title: string; subtitle: string }> = {
  "/app/dashboard": {
    title: "Financial command center",
    subtitle: "Track balance, volume, and category movement in one place.",
  },
  "/app/transactions": {
    title: "Transactions",
    subtitle: "Review every movement with filters, paging, and fast scanning.",
  },
  "/app/categories": {
    title: "Categories",
    subtitle: "Shape the income and expense taxonomy your dashboard depends on.",
  },
  "/app/settings": {
    title: "Settings",
    subtitle: "Control your workspace preferences and active session.",
  },
};

interface AppTopBarProps {
  onMenuClick: () => void;
}

export function AppTopBar({ onMenuClick }: AppTopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showSnackbar } = useSnackbar();
  const copy = routeCopy[location.pathname] ?? routeCopy["/app/dashboard"];

  const handleLogout = () => {
    logout();
    showSnackbar("Signed out.", "info");
    navigate("/login", { replace: true });
  };

  return (
    <Paper
      component="header"
      elevation={0}
      sx={(theme) => ({
        mb: 3,
        borderRadius: 1,
        borderColor: "divider",
        bgcolor:
          theme.palette.mode === "light"
            ? alpha(theme.palette.common.white, 0.98)
            : theme.palette.background.paper,
      })}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          minHeight: 84,
          px: { xs: 2, md: 3 },
          gap: 2,
        }}
      >
        <Button
          color="inherit"
          sx={{ display: { xs: "inline-flex", lg: "none" }, minWidth: 0, px: 1.5 }}
          onClick={onMenuClick}
        >
          <MenuRounded />
        </Button>

        <Stack spacing={0.35} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5">{copy.title}</Typography>
          <Typography color="text.secondary" variant="body2">
            {copy.subtitle}
          </Typography>
        </Stack>

        <ThemeToggleButton />

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            px: { sm: 1.5 },
            py: { sm: 0.5 },
            borderRadius: 2.5,
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main", width: 42, height: 42 }}>
            {user?.displayName?.charAt(0)?.toUpperCase() ?? "U"}
          </Avatar>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography variant="subtitle2">{user?.displayName ?? "Unknown user"}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.email ?? "No email"}
            </Typography>
          </Box>
          <Button
            color="inherit"
            startIcon={<LogoutRounded />}
            variant="outlined"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
