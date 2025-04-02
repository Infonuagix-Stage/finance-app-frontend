import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// Define Category Type (Adjust based on actual structure)
export interface Category {
  categoryId: string;
  name: string;
  description?: string;
  type: "EXPENSE" | "INCOME";
}

// Function to get a category by name
export const getCategoryByName = async (
  userId: string,
  categoryName: string,
  token: string
): Promise<Category> => {
  const response = await api.get<Category>(
    `/users/${userId}/categories/${encodeURIComponent(categoryName)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Fetch all categories for a user
export const getCategoriesForUser = async (
  userId: string,
  token: string
): Promise<Category[]> => {
  const response = await api.get<Category[]>(`/users/${userId}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Create a new category
export const createCategoryForUser = async (
  userId: string,
  categoryData: Partial<Category>,
  token: string
): Promise<Category> => {
  const response = await api.post<Category>(
    `/users/${userId}/categories`,
    categoryData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
