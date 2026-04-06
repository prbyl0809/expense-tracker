import { FormEvent, useMemo, useState } from "react";
import SaveRounded from "@mui/icons-material/SaveRounded";
import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { CategoryList } from "@/features/categories/components/CategoryList";
import { useCategories, useCategoryMutations } from "@/hooks/useCategories";
import { ApiError } from "@/lib/apiClient";
import { Category, TransactionType } from "@/types/api";

const initialFormState = {
  name: "",
  type: "EXPENSE" as TransactionType,
};

export function CategoriesPage() {
  const categoriesQuery = useCategories();
  const { createCategory, updateCategory, deleteCategory } = useCategoryMutations();
  const { showSnackbar } = useSnackbar();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formState, setFormState] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitLabel = editingCategory ? "Save changes" : "Create category";

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  const titleCopy = useMemo(
    () =>
      editingCategory
        ? {
            title: "Edit category",
            description: "Update the label or type without exposing any user id in the UI.",
          }
        : {
            title: "Create category",
            description: "This writes directly to the authenticated user's category set.",
          },
    [editingCategory],
  );

  const resetForm = () => {
    setEditingCategory(null);
    setFormState(initialFormState);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          categoryId: editingCategory.id,
          payload: formState,
        });
      } else {
        await createCategory.mutateAsync(formState);
      }

      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : "Saving category failed.");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormState({
      name: category.name,
      type: category.type,
    });
    setErrorMessage(null);
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await deleteCategory.mutateAsync(categoryId);
      if (editingCategory?.id === categoryId) {
        resetForm();
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
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, xl: 7 }}>
        <Stack spacing={2}>
          <Typography variant="h5">Your category set</Typography>
          <CategoryList
            categories={categoriesQuery.data ?? []}
            isDeleting={deleteCategory.isPending}
            isLoading={categoriesQuery.isLoading}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, xl: 5 }}>
        <Card>
          <CardContent>
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
              <div>
                <Typography variant="h5">{titleCopy.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {titleCopy.description}
                </Typography>
              </div>

              {errorMessage ? (
                <Typography color="error.main" variant="body2">
                  {errorMessage}
                </Typography>
              ) : null}

              <TextField
                required
                label="Category name"
                value={formState.name}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, name: event.target.value }))
                }
              />

              <TextField
                select
                required
                label="Type"
                value={formState.type}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    type: event.target.value as TransactionType,
                  }))
                }
              >
                <MenuItem value="EXPENSE">Expense</MenuItem>
                <MenuItem value="INCOME">Income</MenuItem>
              </TextField>

              <Stack direction="row" spacing={1.5}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  startIcon={<SaveRounded />}
                  variant="contained"
                >
                  {submitLabel}
                </Button>
                <Button variant="text" onClick={resetForm}>
                  Clear
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
