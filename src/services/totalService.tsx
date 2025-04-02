import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// Define types for request parameters
interface GetCategoryTotalParams {
  userId: string;
  categoryId: string;
  type?: string;
  year?: number;
  month?: number;
}

// Define type for the response (modify based on actual API response)
interface CategoryTotalResponse {
  total: number;  // Example: Assuming API returns a total amount
}

// Function to get category total
export const getCategoryTotal = async ({
  userId,
  categoryId,
  type,
  year,
  month,
}: GetCategoryTotalParams): Promise<CategoryTotalResponse> => {
  const response = await api.get<CategoryTotalResponse>(
    `/users/${userId}/categories/${categoryId}/total`,
    {
      params: { type, year, month },
    }
  );
  return response.data;
};
