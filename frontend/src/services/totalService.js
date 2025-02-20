// totalService.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://finance-app-frontend-8bmb.onrender.com/api/v1",
  headers: { "Content-Type": "application/json" },
});

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

export const getCategoryTotal = async (userId, categoryId, type) => {
  const response = await api.get(`/users/${userId}/categories/${categoryId}/total`, {
    params: { type },
  });
  return response.data;
};
