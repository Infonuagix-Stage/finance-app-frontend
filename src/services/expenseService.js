// // services/expenseService.js
// import axios from "axios";

// // Création d'une instance Axios avec la base URL de votre API
// const api = axios.create({
//   baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });


// // Modification ici pour appeler l'endpoint qui renvoie la liste complète des dépenses
// export const getExpensesForCategory = async (userId, categoryId) => {
//   const response = await api.get(
//     `/users/${userId}/categories/${categoryId}/expenses`
//   );
//   return response.data;
// };

// export const createExpenseForCategory = async (userId, categoryId, expense) => {
//   // L'objet expense doit contenir au minimum la description et le montant (adapter les noms si besoin)
//   console.log("expense:", expense);
//   console.log("expenseData:", expense.description, expense.amount);
//   console.log("userId:", userId);
//   console.log("categoryId:", categoryId);
//   console.log(localStorage.getItem("token"));
//   const response = await api.post(
//     `/users/${userId}/categories/${categoryId}/expenses`,
//     expense
//   );
//   return response.data;
// };

// export const deleteExpenseForCategory = async (
//   userId,
//   categoryId,
//   expenseId
// ) => {
//   const response = await api.delete(
//     `/users/${userId}/categories/${categoryId}/expenses/${expenseId}`
//   );
//   return response.data;
// };

// export const updateExpenseForCategory = async (
//   userId,
//   categoryId,
//   expenseId,
//   updatedExpense
// ) => {
//   console.log("userId:", userId);
//   console.log("categoryId:", categoryId);
//   console.log("expenseId:", expenseId);
//   console.log("updatedExpense:", updatedExpense);
//   const response = await api.put(
//     `/users/${userId}/categories/${categoryId}/expenses/${expenseId}`,
//     updatedExpense
//   );

//   return response.data;
// };
