import { useState } from "react";
import AddRounded from "@mui/icons-material/AddRounded";
import { Button, Stack, Typography } from "@mui/material";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { CategoryEditorDialog } from "@/features/categories/components/CategoryEditorDialog";
import { CategoryList } from "@/features/categories/components/CategoryList";
import { useCategories, useCategoryMutations } from "@/hooks/useCategories";
import { ApiError } from "@/lib/apiClient";
import { Category, CategoryPayload } from "@/types/api";

export function CategoriesPage() {
  const categoriesQuery = useCategories();
  const { createCategory, updateCategory, deleteCategory } = useCategoryMutations();
  const { showSnackbar } = useSnackbar();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  const handleSubmit = async (payload: CategoryPayload, categoryId?: number) => {
    if (categoryId) {
      await updateCategory.mutateAsync({
        categoryId,
        payload,
      });
      setEditingCategory(null);
      setIsEditorOpen(false);
      return;
    }

    await createCategory.mutateAsync(payload);
    setIsEditorOpen(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditorOpen(true);
  };

  const handleDelete = async (categoryId: number) => {
    const category = (categoriesQuery.data ?? []).find((item) => item.id === categoryId);
    const confirmed = window.confirm(`Delete "${category?.name ?? "this category"}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteCategory.mutateAsync(categoryId);
      if (editingCategory?.id === categoryId) {
        setEditingCategory(null);
        setIsEditorOpen(false);
      }
    } catch (error) {
      showSnackbar(
        error instanceof ApiError ? error.message : "Deleting category failed.",
        "error",
      );
    }
  };

  if (categoriesQuery.isError) {
    return (
      <EmptyState
        eyebrow="Categories"
        title="Categories are unavailable"
        description="The backend did not return the authenticated user's category list."
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Typography color="text.secondary">
          Build and maintain your income and expense taxonomy here. Add new categories
          or update existing ones without leaving the list context.
        </Typography>
        <Button
          startIcon={<AddRounded />}
          variant="contained"
          onClick={() => {
            setEditingCategory(null);
            setIsEditorOpen(true);
          }}
        >
          Add category
        </Button>
      </Stack>

      <CategoryEditorDialog
        isSubmitting={isSubmitting}
        open={isEditorOpen}
        category={editingCategory}
        onCancel={() => {
          setEditingCategory(null);
          setIsEditorOpen(false);
        }}
        onSubmit={handleSubmit}
      />

      <CategoryList
        categories={categoriesQuery.data ?? []}
        isDeleting={deleteCategory.isPending}
        isLoading={categoriesQuery.isLoading}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </Stack>
  );
}
