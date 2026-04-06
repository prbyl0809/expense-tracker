import { FormEvent, useEffect, useState } from "react";
import SaveRounded from "@mui/icons-material/SaveRounded";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ApiError } from "@/lib/apiClient";
import { Category, CategoryPayload, TransactionType } from "@/types/api";

interface CategoryEditorDialogProps {
  isSubmitting: boolean;
  open: boolean;
  category: Category | null;
  onCancel: () => void;
  onSubmit: (payload: CategoryPayload, categoryId?: number) => Promise<void>;
}

interface CategoryFormState {
  name: string;
  type: TransactionType;
}

const initialFormState: CategoryFormState = {
  name: "",
  type: "EXPENSE",
};

function buildInitialState(category: Category | null): CategoryFormState {
  if (!category) {
    return initialFormState;
  }

  return {
    name: category.name,
    type: category.type,
  };
}

export function CategoryEditorDialog({
  isSubmitting,
  open,
  category,
  onCancel,
  onSubmit,
}: CategoryEditorDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [formState, setFormState] = useState<CategoryFormState>(
    buildInitialState(category),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormState(buildInitialState(category));
    setErrorMessage(null);
  }, [category, open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await onSubmit(
        {
          name: formState.name.trim(),
          type: formState.type,
        },
        category?.id,
      );
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : "Saving category failed.");
    }
  };

  const handleClose = () => {
    setFormState(initialFormState);
    setErrorMessage(null);
    onCancel();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, md: 1.5 },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {category ? "Edit category" : "Add category"}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {category
              ? "Update the label or type for this category."
              : "Create a new income or expense category for the authenticated user."}
          </Typography>

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
              {category ? "Save changes" : "Add category"}
            </Button>
            <Button variant="text" onClick={handleClose}>
              {category ? "Cancel edit" : "Clear"}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
