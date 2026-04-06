import { ReactNode } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <Paper sx={{ p: 4 }}>
      <Stack spacing={2}>
        {icon ? <Box sx={{ fontSize: 28 }}>{icon}</Box> : null}
        {eyebrow ? (
          <Typography color="secondary.main" variant="overline">
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h5">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
        {actionLabel && onAction ? (
          <Button
            color="secondary"
            sx={{ alignSelf: "flex-start" }}
            variant="contained"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}
