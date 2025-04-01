import axios from "axios";

// Define Income Type (Adjust based on actual API response)
export interface Income {
  incomeId: string;
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

// Get incomes for a category
export const getIncomesForCategory = async (
  userId: string,
  categoryId: string,
  token: string
): Promise<Income[]> => {
  const response = await api.get<Income[]>(
    `/users/${userId}/categories/${categoryId}/incomes`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Create an income for a category
export const createIncomeForCategory = async (
  userId: string,
  categoryId: string,
  income: Omit<Income, "incomeId">,
  token: string
): Promise<Income> => {
  const response = await api.post<Income>(
    `/users/${userId}/categories/${categoryId}/incomes`,
    income,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Delete an income from a category
export const deleteIncomeForCategory = async (
  userId: string,
  categoryId: string,
  incomeId: string,
  token: string
): Promise<void> => {
  await api.delete(`/users/${userId}/categories/${categoryId}/incomes/${incomeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update an existing income
export const updateIncomeForCategory = async (
  userId: string,
  categoryId: string,
  incomeId: string,
  updatedIncome: Partial<Omit<Income, "incomeId">>,
  token: string
): Promise<Income> => {
  const response = await api.put<Income>(
    `/users/${userId}/categories/${categoryId}/incomes/${incomeId}`,
    updatedIncome,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
