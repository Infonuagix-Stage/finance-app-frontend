// services/incomeService.js
import axios from "axios";

// Création d'une instance Axios avec la base URL de votre API
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajout d'un intercepteur pour inclure le token dans l'en-tête
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

// Modification ici pour appeler l'endpoint qui renvoie la liste complète des entrés
export const getIncomesForCategory = async (userId, categoryId) => {
  const response = await api.get(`/users/${userId}/categories/${categoryId}/incomes`);
  return response.data;
};

export const createIncomeForCategory = async (userId, categoryId, income) => {
  const response = await api.post(
    `/users/${userId}/categories/${categoryId}/incomes`,
    income,
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  return response.data;
};
