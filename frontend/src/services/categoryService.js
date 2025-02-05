// categoryService.js
import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// Ajout de l'intercepteur pour le token si nécessaire
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const getCategoryByName = async (userId, categoryName) => {
  const response = await api.get(
    `/users/${userId}/categories/${encodeURIComponent(categoryName)}`
  );
  return response.data;
};

// Vous pouvez également avoir d'autres fonctions, par exemple pour créer une catégorie, etc.

export const getCategoriesForUser = async (userId) => {
  // Retrieve the token from localStorage
  const yourJwtToken = localStorage.getItem("token");
  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  // Make the request with the Authorization header
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/${userId}/categories`,
    {
      headers: {
        Authorization: `Bearer ${yourJwtToken}`,
      },
    }
  );

  return response.data; // Return the categories array
};

export const createCategoryForUser = async (userId, categoryName) => {
  const yourJwtToken = localStorage.getItem("token");
  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/${userId}/categories`,
    {
      name: categoryName,
      description: `Description for ${categoryName}`,
    },
    {
      headers: {
        Authorization: `Bearer ${yourJwtToken}`,
      },
    }
  );

  return response.data; // Return the newly created category
};
