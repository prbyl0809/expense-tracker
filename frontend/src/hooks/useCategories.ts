import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { apiRequest, ApiError } from "@/lib/apiClient";
import { Category, CategoryPayload } from "@/types/api";

export function useCategories() {
  const { token, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["categories"],
    enabled: isAuthenticated,
    queryFn: async () => {
      try {
        return await apiRequest<Category[]>("/api/categories", {
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

export function useCategoryMutations() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["categories"],
    });

  const wrap = async <T,>(callback: () => Promise<T>) => {
    try {
      return await callback();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
        navigate("/login", { replace: true });
      }
      throw error;
    }
  };

  const createCategory = useMutation({
    mutationFn: (payload: CategoryPayload) =>
      wrap(() =>
        apiRequest<Category>("/api/categories", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        }),
      ),
    onSuccess: async () => {
      await invalidate();
      showSnackbar("Category created.", "success");
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ categoryId, payload }: { categoryId: number; payload: CategoryPayload }) =>
      wrap(() =>
        apiRequest<Category>(`/api/categories/${categoryId}`, {
          method: "PUT",
          token,
          body: JSON.stringify(payload),
        }),
      ),
    onSuccess: async () => {
      await invalidate();
      showSnackbar("Category updated.", "success");
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (categoryId: number) =>
      wrap(() =>
        apiRequest<void>(`/api/categories/${categoryId}`, {
          method: "DELETE",
          token,
        }),
      ),
    onSuccess: async () => {
      await invalidate();
      showSnackbar("Category deleted.", "success");
    },
  });

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
