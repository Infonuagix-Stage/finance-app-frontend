// services/incomeService.js
import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});


// Modification ici pour appeler l'endpoint qui renvoie la liste complète des entrés
export const getIncomesForCategory = async (userId, categoryId, token) => {
  const response = await api.get(
    `/users/${userId}/categories/${categoryId}/incomes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const createIncomeForCategory = async (userId, categoryId, income, token) => {
  const response = await api.post(
    `/users/${userId}/categories/${categoryId}/incomes`, income,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteIncomeForCategory = async (userId, categoryId, incomeId, token) => {
  const response = await api.delete(
    `/users/${userId}/categories/${categoryId}/incomes/${incomeId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateIncomeForCategory = async (
  userId,
  categoryId,
  incomeId,
  updatedIncome,
  token
) => {
  const response = await api.put(
    `/users/${userId}/categories/${categoryId}/incomes/${incomeId}`,
    updatedIncome,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
