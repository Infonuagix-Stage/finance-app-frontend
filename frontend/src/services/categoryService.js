// categoryService.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
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
  const response = await api.get(`/users/${userId}/categories/${encodeURIComponent(categoryName)}`);
  return response.data;
};


// Vous pouvez également avoir d'autres fonctions, par exemple pour créer une catégorie, etc.

export const getCategoriesForUser = async (userId) => {
  // Retrieve the token from localStorage
  const yourJwtToken = localStorage.getItem("token");
  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  // Make the request with the Authorization header
  const response = await axios.get(`http://localhost:8080/api/v1/users/${userId}/categories`, {
    headers: {
      Authorization: `Bearer ${yourJwtToken}`,
    },
  });

  return response.data; // Return the categories array
};

export const createCategoryForUser = async (userId, categoryData) => {
  const yourJwtToken = localStorage.getItem("token");
  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  const response = await api.post(
    `/users/${userId}/categories`, // utilisation de la route relative
    categoryData, // ici categoryData est un objet { name, description, type }
    {
      headers: {
        Authorization: `Bearer ${yourJwtToken}`,
      },
    }
  );

  return response.data;
};


