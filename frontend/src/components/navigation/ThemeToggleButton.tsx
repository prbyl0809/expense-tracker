import DarkModeRounded from "@mui/icons-material/DarkModeRounded";
import LightModeRounded from "@mui/icons-material/LightModeRounded";
import { IconButton, Tooltip } from "@mui/material";
import { useThemeMode } from "@/theme/colorMode";

export function ThemeToggleButton() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton color="inherit" onClick={toggleMode}>
        {mode === "dark" ? <LightModeRounded /> : <DarkModeRounded />}
      </IconButton>
    </Tooltip>
  );
}
