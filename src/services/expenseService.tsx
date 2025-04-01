import axios from "axios";

// Define Expense Type (Adjust based on actual structure)
export interface Expense {
  expenseId: string;
  description: string;
  amount: number;
  date?: string; // Optional date field if applicable
}

// Axios instance with base URL
const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get expenses for a category
export const getExpensesForCategory = async (
  userId: string,
  categoryId: string
): Promise<Expense[]> => {
  const response = await api.get<Expense[]>(
    `/users/${userId}/categories/${categoryId}/expenses`
  );
  return response.data;
};

// Create an expense for a category
export const createExpenseForCategory = async (
  userId: string,
  categoryId: string,
  expense: Omit<Expense, "expenseId">
): Promise<Expense> => {
  const response = await api.post<Expense>(
    `/users/${userId}/categories/${categoryId}/expenses`,
    expense
  );
  return response.data;
};

// Delete an expense from a category
export const deleteExpenseForCategory = async (
  userId: string,
  categoryId: string,
  expenseId: string
): Promise<void> => {
  await api.delete(`/users/${userId}/categories/${categoryId}/expenses/${expenseId}`);
};

// Update an existing expense
export const updateExpenseForCategory = async (
  userId: string,
  categoryId: string,
  expenseId: string,
  updatedExpense: Partial<Omit<Expense, "expenseId">>
): Promise<Expense> => {
  const response = await api.put<Expense>(
    `/users/${userId}/categories/${categoryId}/expenses/${expenseId}`,
    updatedExpense
  );
  return response.data;
};
