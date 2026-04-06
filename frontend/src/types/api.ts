export type TransactionType = "INCOME" | "EXPENSE";

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  displayName: string;
}

export interface AppUser {
  id: number;
  email: string;
  displayName: string;
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  userId: number;
  createdAt: string;
}

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string;
  userId: number;
  categoryId: number;
  categoryName: string;
  createdAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CategorySummary {
  categoryId: number;
  categoryName: string;
  type: TransactionType;
  totalAmount: number;
  transactionCount: number;
}

export interface DashboardSummary {
  userId: number;
  fromDate: string;
  toDate: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  categorySummaries: CategorySummary[];
}

export interface CategoryPayload {
  name: string;
  type: TransactionType;
}

export interface TransactionFilters {
  page?: number;
  size?: number;
  sort?: string;
  fromDate?: string;
  toDate?: string;
  type?: TransactionType | "";
  categoryId?: number | "";
}

export interface ApiProblem {
  title?: string;
  detail?: string;
  status?: number;
}
