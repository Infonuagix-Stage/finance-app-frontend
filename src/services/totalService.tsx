// totalService.ts
import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

interface GetCategoryTotalParams {
  userId: string;
  categoryId: string;
  type?: string;
  year?: number;
  month?: number;
}


interface CategoryTotalResponse {
  total: number;
}

export const getCategoryTotal = async (
  { userId, categoryId, type, year, month }: GetCategoryTotalParams,
  token: string
): Promise<number> => {
  const response = await api.get<number>(
    `/users/${userId}/categories/${categoryId}/total`,
    {
      params: { type, year, month },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
