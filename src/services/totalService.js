// totalService.js
import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});


export const getCategoryTotal = async (userId, categoryId, type, year, month) => {
  const response = await api.get(
    `/users/${userId}/categories/${categoryId}/total`,
    {
      params: { type ,year, month },
    }
  );
  return response.data;
};

