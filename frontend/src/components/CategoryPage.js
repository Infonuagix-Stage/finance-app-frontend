import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getExpensesForCategory, createExpenseForCategory } from "../services/expenseService";
import { useAuthContext } from "../context/AuthContext";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { user } = useAuthContext();
  const userId = user ? user.id : null;

  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: "", amount: "" });

  useEffect(() => {
    if (!userId || !categoryId) return;
    const fetchExpenses = async () => {
      try {
        console.log("userId:", userId, "categoryId:", categoryId);

        const data = await getExpensesForCategory(userId, categoryId);
        setExpenses(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des dépenses :", error);
      }
    };
    fetchExpenses();
  }, [userId, categoryId]);

  const addExpense = async () => {
    if (newExpense.description && newExpense.amount) {
      try {
        const expenseData = {
          description: newExpense.description,
          montant: newExpense.amount,
          userId: userId,
          categoryId: categoryId,
        };
        const createdExpense = await createExpenseForCategory(userId, categoryId, expenseData);
        setExpenses([...expenses, createdExpense]);
        setNewExpense({ description: "", amount: "" });
      } catch (error) {
        console.error("Erreur lors de la création de la dépense :", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <h1 className="text-3xl font-bold mb-6">Catégorie: {categoryId}</h1>

      {/* Formulaire d'ajout de dépense */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) =>
            setNewExpense({ ...newExpense, description: e.target.value })
          }
          className="w-full p-3 rounded bg-gray-800 text-gray-200 mb-4"
        />
        <input
          type="number"
          placeholder="Montant"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
          className="w-full p-3 rounded bg-gray-800 text-gray-200 mb-4"
        />
        <button
          onClick={addExpense}
          className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
        >
          Ajouter une dépense
        </button>
      </div>

      {/* Affichage des dépenses */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Dépenses</h2>
        {expenses.length > 0 ? (
          <ul className="space-y-2">
            {expenses.map((expense) => (
              <li key={expense.id} className="p-3 bg-gray-800 rounded">
                {expense.description} - ${expense.montant}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune dépense enregistrée.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
