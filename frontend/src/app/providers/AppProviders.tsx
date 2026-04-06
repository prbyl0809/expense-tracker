import { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { SnackbarProvider } from "@/components/feedback/SnackbarProvider";
import { ThemeModeProvider } from "@/theme/colorMode";
import { AuthProvider } from "@/features/auth/hooks/useAuth";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeModeProvider>
      <SnackbarProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeModeProvider>
  );
}
