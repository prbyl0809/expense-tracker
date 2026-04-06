import { PaletteMode, alpha, createTheme } from "@mui/material/styles";
import { darkTokens, lightTokens } from "@/theme/tokens";

export function createAppTheme(mode: PaletteMode) {
  const tokens = mode === "light" ? lightTokens : darkTokens;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.primary,
        dark: tokens.primaryStrong,
      },
      secondary: {
        main: tokens.secondary,
        dark: tokens.secondaryStrong,
      },
      background: {
        default: tokens.background,
        paper: tokens.surface,
      },
      text: {
        primary: tokens.textPrimary,
        secondary: tokens.textSecondary,
      },
      divider: tokens.divider,
      success: {
        main: "#2fbf71",
      },
      error: {
        main: "#ef5a6f",
      },
      warning: {
        main: "#f0a43a",
      },
    },
    typography: {
      fontFamily: '"Public Sans", "Segoe UI", sans-serif',
      h1: {
        fontFamily: '"Literata", Georgia, serif',
        fontWeight: 700,
      },
      h2: {
        fontFamily: '"Literata", Georgia, serif',
        fontWeight: 700,
      },
      h3: {
        fontFamily: '"Literata", Georgia, serif',
        fontWeight: 700,
      },
      h4: {
        fontFamily: '"Literata", Georgia, serif',
        fontWeight: 700,
      },
      h5: {
        fontFamily: '"Literata", Georgia, serif',
        fontWeight: 700,
      },
      h6: {
        fontWeight: 700,
      },
      button: {
        textTransform: "none",
        fontWeight: 700,
      },
    },
    shape: {
      borderRadius: 22,
    },
    shadows: [
      "none",
      "0 10px 30px rgba(8, 19, 33, 0.06)",
      "0 14px 40px rgba(8, 19, 33, 0.08)",
      "0 20px 50px rgba(8, 19, 33, 0.10)",
      "0 26px 65px rgba(8, 19, 33, 0.12)",
      "0 32px 80px rgba(8, 19, 33, 0.14)",
      "0 38px 90px rgba(8, 19, 33, 0.16)",
      "0 44px 100px rgba(8, 19, 33, 0.18)",
      "0 50px 110px rgba(8, 19, 33, 0.20)",
      "0 54px 120px rgba(8, 19, 33, 0.22)",
      "0 58px 130px rgba(8, 19, 33, 0.24)",
      "0 62px 140px rgba(8, 19, 33, 0.26)",
      "0 66px 150px rgba(8, 19, 33, 0.28)",
      "0 70px 160px rgba(8, 19, 33, 0.30)",
      "0 74px 170px rgba(8, 19, 33, 0.32)",
      "0 78px 180px rgba(8, 19, 33, 0.34)",
      "0 82px 190px rgba(8, 19, 33, 0.36)",
      "0 86px 200px rgba(8, 19, 33, 0.38)",
      "0 90px 210px rgba(8, 19, 33, 0.40)",
      "0 94px 220px rgba(8, 19, 33, 0.42)",
      "0 98px 230px rgba(8, 19, 33, 0.44)",
      "0 102px 240px rgba(8, 19, 33, 0.46)",
      "0 106px 250px rgba(8, 19, 33, 0.48)",
      "0 110px 260px rgba(8, 19, 33, 0.50)",
      "0 114px 270px rgba(8, 19, 33, 0.52)"
    ],
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            boxShadow: "none",
            backdropFilter: "blur(20px)",
            backgroundColor:
              mode === "light"
                ? alpha("#f3f6fa", 0.82)
                : alpha("#1d2129", 0.92),
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${alpha(tokens.divider, 0.4)}`,
          },
          rounded: {
            borderRadius: 24,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            paddingInline: 18,
            minHeight: 44,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            backgroundColor: alpha(tokens.surfaceAlt, 0.5),
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${alpha(tokens.divider, 0.4)}`,
            backgroundColor:
              mode === "light"
                ? "#ffffff"
                : "#1d2129",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            backgroundColor: alpha(tokens.secondary, 0.16),
          },
        },
      },
    },
  });
}
