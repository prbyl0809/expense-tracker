import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { apiRequest, ApiError } from "@/lib/apiClient";
import { DashboardSummary } from "@/types/api";

export function useDashboardSummary() {
  const { token, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["dashboard-summary", "current-month"],
    enabled: isAuthenticated,
    queryFn: async () => {
      try {
        return await apiRequest<DashboardSummary>("/api/dashboard/summary/current-month", {
          token,
        });
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          logout();
          navigate("/login", { replace: true });
        }
        throw error;
      }
    },
  });
}
