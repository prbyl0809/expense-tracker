import { FormEvent, useState } from "react";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ApiError } from "@/lib/apiClient";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();
  const auth = useAuth();
  const { showSnackbar } = useSnackbar();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isRegister = mode === "register";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isRegister) {
        await auth.register({ displayName, email, password });
        showSnackbar("Account created.", "success");
      } else {
        await auth.login({ email, password });
        showSnackbar("Signed in successfully.", "success");
      }

      navigate("/app/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "Authentication failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 520, mx: "auto" }}>
      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <Box>
          <Typography color="secondary.main" variant="overline">
            {isRegister ? "Create account" : "Welcome back"}
          </Typography>
          <Typography sx={{ mt: 1 }} variant="h3">
            {isRegister ? "Set up your workspace." : "Sign in to your ledger."}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5 }}>
            {isRegister
              ? "Register once, then the app works against your own categories and transactions."
              : "Use your JWT-backed account to continue with the secured API."}
          </Typography>
        </Box>

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <Stack spacing={2}>
          {isRegister ? (
            <TextField
              required
              label="Display name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          ) : null}
          <TextField
            required
            type="email"
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            required
            type="password"
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Stack>

        <Button
          type="submit"
          endIcon={<ArrowForwardRounded />}
          disabled={isSubmitting}
          size="large"
          variant="contained"
        >
          {isSubmitting
            ? "Please wait..."
            : isRegister
              ? "Create account"
              : "Sign in"}
        </Button>

        <Typography color="text.secondary" variant="body2">
          {isRegister ? "Already have an account?" : "Need an account?"}{" "}
          <Typography
            component={RouterLink}
            sx={{ color: "secondary.main", fontWeight: 700, textDecoration: "none" }}
            to={isRegister ? "/login" : "/register"}
            variant="inherit"
          >
            {isRegister ? "Sign in" : "Register"}
          </Typography>
        </Typography>
      </Stack>
    </Box>
  );
}
