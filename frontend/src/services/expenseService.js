// services/expenseService.js
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

export const getExpensesForCategory = async (userId, categoryId) => {
  const response = await api.get(`/users/${userId}/categories/${categoryId}/expenses`);
  return response.data;
};

export const createExpenseForCategory = async (userId, categoryId, expense) => {
  // L'objet expense doit contenir au minimum la description et le montant (adapter les noms si besoin)
  const response = await api.post(`/users/${userId}/categories/${categoryId}/expenses`, expense);
  return response.data;
};
