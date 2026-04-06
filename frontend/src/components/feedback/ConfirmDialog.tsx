import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface ConfirmDialogProps {
  confirmLabel?: string;
  description: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
}

export function ConfirmDialog({
  confirmLabel = "Confirm",
  description,
  isSubmitting = false,
  onCancel,
  onConfirm,
  open,
  title,
}: ConfirmDialogProps) {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={isSubmitting ? undefined : onCancel}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, md: 1.5 },
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button disabled={isSubmitting} variant="text" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          color="error"
          disabled={isSubmitting}
          variant="contained"
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
