import type { SyntheticEvent } from "react";
import {
  Alert,
  AlertColor,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface SnackbarState {
  message: string;
  severity: AlertColor;
}

interface SnackbarContextValue {
  showSnackbar: (message: string, severity?: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(
  undefined,
);

export function SnackbarProvider({ children }: PropsWithChildren) {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  const showSnackbar = useCallback(
    (message: string, severity: AlertColor = "info") => {
      setSnackbar({ message, severity });
    },
    [],
  );

  const handleClose = useCallback(
    (_event?: Event | SyntheticEvent, reason?: SnackbarCloseReason) => {
      if (reason === "clickaway") {
        return;
      }

      setSnackbar(null);
    },
    [],
  );

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        autoHideDuration={3600}
        open={Boolean(snackbar)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleClose}
      >
        <Alert
          variant="filled"
          severity={snackbar?.severity ?? "info"}
          onClose={handleClose}
          sx={{ minWidth: 280 }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar must be used within SnackbarProvider");
  }

  return context;
}
