import FilterAltRounded from "@mui/icons-material/FilterAltRounded";
import RestartAltRounded from "@mui/icons-material/RestartAltRounded";
import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { Category, TransactionFilters as TransactionFiltersType } from "@/types/api";

interface TransactionFiltersProps {
  categories: Category[];
  filters: TransactionFiltersType;
  onChange: (filters: TransactionFiltersType) => void;
  onReset: () => void;
}

export function TransactionFilters({
  categories,
  filters,
  onChange,
  onReset,
}: TransactionFiltersProps) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <FilterAltRounded color="secondary" />
              <strong>Filters</strong>
            </Stack>
            <Button startIcon={<RestartAltRounded />} variant="text" onClick={onReset}>
              Reset
            </Button>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Type"
                value={filters.type ?? ""}
                onChange={(event) =>
                  onChange({ ...filters, page: 0, type: event.target.value as "INCOME" | "EXPENSE" | "" })
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="INCOME">Income</MenuItem>
                <MenuItem value="EXPENSE">Expense</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Category"
                value={filters.categoryId ?? ""}
                onChange={(event) =>
                  onChange({
                    ...filters,
                    page: 0,
                    categoryId: event.target.value === "" ? "" : Number(event.target.value),
                  })
                }
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="From"
                type="date"
                value={filters.fromDate ?? ""}
                onChange={(event) =>
                  onChange({ ...filters, page: 0, fromDate: event.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="To"
                type="date"
                value={filters.toDate ?? ""}
                onChange={(event) =>
                  onChange({ ...filters, page: 0, toDate: event.target.value })
                }
              />
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}
