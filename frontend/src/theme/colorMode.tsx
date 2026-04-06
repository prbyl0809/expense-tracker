import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PaletteMode, ThemeProvider } from "@mui/material/styles";
import { getStoredTheme, setStoredTheme } from "@/lib/storage";
import { createAppTheme } from "@/theme/theme";

interface ThemeModeContextValue {
  mode: PaletteMode;
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(
  undefined,
);

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<PaletteMode>(() => getStoredTheme() ?? "dark");

  useEffect(() => {
    setStoredTheme(mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => {
        setMode((current) => (current === "dark" ? "light" : "dark"));
      },
    }),
    [mode],
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  }

  return context;
}
