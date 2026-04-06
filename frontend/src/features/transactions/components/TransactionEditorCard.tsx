import { FormEvent, useEffect, useMemo, useState } from "react";
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
import { Category, Transaction, TransactionPayload, TransactionType } from "@/types/api";

interface TransactionEditorCardProps {
  categories: Category[];
  isSubmitting: boolean;
  open: boolean;
  transaction: Transaction | null;
  onCancel: () => void;
  onSubmit: (payload: TransactionPayload, transactionId?: number) => Promise<void>;
}

interface TransactionFormState {
  amount: string;
  type: TransactionType;
  description: string;
  date: string;
  categoryId: number | "";
}

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function buildInitialState(transaction: Transaction | null): TransactionFormState {
  if (!transaction) {
    return {
      amount: "",
      type: "EXPENSE",
      description: "",
      date: getTodayString(),
      categoryId: "",
    };
  }

  return {
    amount: String(transaction.amount),
    type: transaction.type,
    description: transaction.description ?? "",
    date: transaction.date,
    categoryId: transaction.categoryId,
  };
}

export function TransactionEditorCard({
  categories,
  isSubmitting,
  open,
  transaction,
  onCancel,
  onSubmit,
}: TransactionEditorCardProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [formState, setFormState] = useState<TransactionFormState>(
    buildInitialState(transaction),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormState(buildInitialState(transaction));
    setErrorMessage(null);
  }, [transaction]);

  const matchingCategories = useMemo(
    () => categories.filter((category) => category.type === formState.type),
    [categories, formState.type],
  );

  const submitLabel = transaction ? "Save changes" : "Add transaction";

  const handleTypeChange = (type: TransactionType) => {
    setFormState((current) => {
      const nextCategoryId =
        current.categoryId !== "" &&
        categories.some(
          (category) => category.id === current.categoryId && category.type === type,
        )
          ? current.categoryId
          : "";

      return {
        ...current,
        type,
        categoryId: nextCategoryId,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (formState.categoryId === "") {
      setErrorMessage("Select a category.");
      return;
    }

    const amount = Number(formState.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setErrorMessage("Amount must be greater than 0.");
      return;
    }

    try {
      await onSubmit(
        {
          amount,
          type: formState.type,
          description: formState.description.trim(),
          date: formState.date,
          categoryId: formState.categoryId,
        },
        transaction?.id,
      );

      if (!transaction) {
        setFormState(buildInitialState(null));
      }
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "Saving transaction failed.",
      );
    }
  };

  const handleCancel = () => {
    setFormState(buildInitialState(null));
    setErrorMessage(null);
    onCancel();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleCancel}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, md: 1.5 },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {transaction ? "Edit transaction" : "Add transaction"}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <div>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {transaction
                ? "Update amount, category, date, or description for this record."
                : "Create a new income or expense entry for the authenticated user."}
            </Typography>
          </div>

          {errorMessage ? (
            <Typography color="error.main" variant="body2">
              {errorMessage}
            </Typography>
          ) : null}

          <TextField
            required
            label="Amount"
            type="number"
            inputProps={{ min: "0.01", step: "0.01" }}
            value={formState.amount}
            onChange={(event) =>
              setFormState((current) => ({ ...current, amount: event.target.value }))
            }
          />

          <TextField
            select
            required
            label="Type"
            value={formState.type}
            onChange={(event) => handleTypeChange(event.target.value as TransactionType)}
          >
            <MenuItem value="EXPENSE">Expense</MenuItem>
            <MenuItem value="INCOME">Income</MenuItem>
          </TextField>

          <TextField
            select
            required
            label="Category"
            value={formState.categoryId}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                categoryId: Number(event.target.value),
              }))
            }
          >
            {matchingCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            InputLabelProps={{ shrink: true }}
            label="Date"
            type="date"
            value={formState.date}
            onChange={(event) =>
              setFormState((current) => ({ ...current, date: event.target.value }))
            }
          />

          <TextField
            multiline
            minRows={3}
            label="Description"
            value={formState.description}
            onChange={(event) =>
              setFormState((current) => ({ ...current, description: event.target.value }))
            }
          />

          {matchingCategories.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              Create a {formState.type.toLowerCase()} category first before saving this
              transaction.
            </Typography>
          ) : null}

          <Stack direction="row" spacing={1.5}>
            <Button
              type="submit"
              disabled={isSubmitting || matchingCategories.length === 0}
              startIcon={<SaveRounded />}
              variant="contained"
            >
              {submitLabel}
            </Button>
            <Button variant="text" onClick={handleCancel}>
              {transaction ? "Cancel edit" : "Clear"}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
