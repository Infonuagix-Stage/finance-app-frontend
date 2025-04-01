import axios from "axios";

// Define response type for category total
export interface CategoryTotal {
  amount: number;
  total: number;
}

// Axios instance with base URL
const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// Fetch category total (income or expense)
export const getCategoryTotal = async (
  userId: string,
  categoryId: string,
  type: "INCOME" | "EXPENSE"
): Promise<CategoryTotal> => {
  const response = await api.get<CategoryTotal>(
    `/users/${userId}/categories/${categoryId}/total`,
    {
      params: { type },
    }
  );

  return response.data;
};
