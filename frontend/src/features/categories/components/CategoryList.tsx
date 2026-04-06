import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Category } from "@/types/api";

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
  isDeleting: boolean;
}

export function CategoryList({
  categories,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: CategoryListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary">Loading categories...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        eyebrow="Categories"
        title="No categories yet"
        description="Create at least one income or expense category before you start recording transactions."
      />
    );
  }

  return (
    <Stack spacing={2}>
      {categories.map((category) => (
        <Card key={category.id}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack spacing={0.75}>
                <Typography variant="subtitle1">{category.name}</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    color={category.type === "INCOME" ? "success" : "secondary"}
                    label={category.type}
                    size="small"
                  />
                  <Chip label={new Date(category.createdAt).toLocaleDateString()} size="small" />
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1}>
                <IconButton onClick={() => onEdit(category)}>
                  <EditRounded />
                </IconButton>
                <IconButton disabled={isDeleting} onClick={() => onDelete(category.id)}>
                  <DeleteOutlineRounded />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
