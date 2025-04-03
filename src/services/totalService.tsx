// totalService.ts
import axios from "axios";

// 1) Crée une instance axios de base
const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types pour les paramètres
interface GetCategoryTotalParams {
  userId: string;
  categoryId: string;
  type?: string;
  year?: number;
  month?: number;
}

// Type de la réponse de l’API (adapte selon ton backend)
interface CategoryTotalResponse {
  total: number;
}

// totalService.ts
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
  // Ici, response.data est un number brut
  return response.data;
};
