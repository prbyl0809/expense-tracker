import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useThemeMode } from "@/theme/colorMode";

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showSnackbar("Signed out.", "info");
    navigate("/login", { replace: true });
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h5">Workspace profile</Typography>
            <Typography color="text.secondary">
              Signed in as {user?.displayName} ({user?.email})
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">Appearance</Typography>
            <Typography color="text.secondary">
              The UI theme is persisted locally and already supports light and dark mode.
            </Typography>
            <Button
              color="secondary"
              sx={{ alignSelf: "flex-start" }}
              variant="contained"
              onClick={toggleMode}
            >
              Switch to {mode === "dark" ? "light" : "dark"} mode
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">Session</Typography>
            <Typography color="text.secondary">
              The current frontend uses JWT from local storage and redirects to login on
              unauthorized API responses.
            </Typography>
            <Button
              color="inherit"
              sx={{ alignSelf: "flex-start" }}
              variant="outlined"
              onClick={handleLogout}
            >
              Sign out
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
