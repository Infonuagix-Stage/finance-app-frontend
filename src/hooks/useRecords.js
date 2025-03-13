// hooks/useExpenseService.js
import useAxiosAuth from "../hooks/useAxiosAuth";

const useExpenseService = () => {
  const api = useAxiosAuth();

  const getExpensesForCategory = async (userId, categoryId) => {
    const response = await api.get(
      `/users/${userId}/categories/${categoryId}/expenses`
    );
    return response.data;
  };

  const createExpenseForCategory = async (userId, categoryId, expense) => {
    const response = await api.post(
      `/users/${userId}/categories/${categoryId}/expenses`,
      expense
    );
    return response.data;
  };

  const deleteExpenseForCategory = async (userId, categoryId, expenseId) => {
    const response = await api.delete(
      `/users/${userId}/categories/${categoryId}/expenses/${expenseId}`
    );
    return response.data;
  };

  const updateExpenseForCategory = async (
    userId,
    categoryId,
    expenseId,
    updatedExpense
  ) => {
    const response = await api.put(
      `/users/${userId}/categories/${categoryId}/expenses/${expenseId}`,
      updatedExpense
    );
    return response.data;
  };

  return {
    getExpensesForCategory,
    createExpenseForCategory,
    deleteExpenseForCategory,
    updateExpenseForCategory,
  };
};

export default useExpenseService;
