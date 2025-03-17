// categoryService.js
import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

export const getCategoryByName = async (userId, categoryName, token) => {
  const response = await api.get(
    `/users/${userId}/categories/${encodeURIComponent(categoryName)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    
  );
  return response.data;
};


// Vous pouvez également avoir d'autres fonctions, par exemple pour créer une catégorie, etc.

export const getCategoriesForUser = async (userId, token) => {
  // Make the request with the Authorization header
  const response = await api.get(
    `users/${userId}/categories`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data; // Return the categories array
};

export const createCategoryForUser = async (userId, categoryData, token) => {
  const response = await api.post(
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
