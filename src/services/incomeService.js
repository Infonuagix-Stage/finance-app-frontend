// incomeService.js
import useAxiosAuth from "../hooks/useAxiosAuth";
const useIncomeService = () => {
  const api = useAxiosAuth();

  const getIncomesForCategory = async (userId, categoryId) => {
    const response = await api.get(`/users/${userId}/categories/${categoryId}/incomes`);
    return response.data;
  };

  const createIncomeForCategory = async (userId, categoryId, income) => {
    const response = await api.post(`/users/${userId}/categories/${categoryId}/incomes`, income);
    return response.data;
  };

  const deleteIncomeForCategory = async (userId, categoryId, incomeId) => {
    const response = await api.delete(`/users/${userId}/categories/${categoryId}/incomes/${incomeId}`);
    return response.data;
  };

  const updateIncomeForCategory = async (userId, categoryId, incomeId, updatedIncome) => {
    const response = await api.put(
      `/users/${userId}/categories/${categoryId}/incomes/${incomeId}`,
      updatedIncome
    );
    return response.data;
  };

  return {
    getIncomesForCategory,
    createIncomeForCategory,
    deleteIncomeForCategory,
    updateIncomeForCategory,
  };
};

export default useIncomeService;
