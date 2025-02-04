// CategoryPage.js
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getExpensesForCategory, createExpenseForCategory } from "../services/expenseService";
import { useAuthContext } from "../context/AuthContext";

const CategoryPage = () => {
  // Récupération du paramètre "categoryName" dans l'URL
  const { categoryName } = useParams();
  const location = useLocation();
  const { user } = useAuthContext();
  const userId = user ? user.id : null;

  // On récupère éventuellement l'ID de la catégorie passé dans le state (si vous l'avez transmis depuis BudgetingPage)
  const categoryIdFromState = location.state?.categoryId;
  
  // On utilise le nom passé via l'URL
  const [displayedCategoryName, setDisplayedCategoryName] = useState(categoryName);
  
  // Utilisez cet ID (si présent) pour vos appels API
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: "", amount: "" });

  const expensesArray = Array.isArray(expenses) ? expenses : [];
  const totalForCategory = expensesArray.reduce(
    (acc, expense) => acc + Number(expense.montant),
    0
  );

  // Récupération des dépenses, en utilisant l'ID transmis (si disponible)
  useEffect(() => {
    if (!userId || !categoryIdFromState) return;
    const fetchExpenses = async () => {
      try {
        const data = await getExpensesForCategory(userId, categoryIdFromState);
        console.log("API response:", data);
        setExpenses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors de la récupération des dépenses :", error);
      }
    };
    fetchExpenses();
  }, [userId, categoryIdFromState]);

  const addExpense = async () => {
    if (newExpense.description && newExpense.amount && categoryIdFromState) {
      try {
        const expenseData = {
          description: newExpense.description,
          montant: newExpense.amount,
          userId,
          categoryId: categoryIdFromState,
        };
        const createdExpense = await createExpenseForCategory(userId, categoryIdFromState, expenseData);
        console.log("Created expense:", createdExpense);
        setExpenses(prevExpenses =>
          Array.isArray(prevExpenses) ? [...prevExpenses, createdExpense] : [createdExpense]
        );
        setNewExpense({ description: "", amount: "" });
      } catch (error) {
        console.error("Erreur lors de la création de la dépense :", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <h1 className="text-3xl font-bold mb-6">Catégorie : {displayedCategoryName}</h1>
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
        {expensesArray.length > 0 ? (
          <ul className="space-y-2">
            {expensesArray.map((expense) => (
              <li key={expense.id} className="p-3 bg-gray-800 rounded">
                {expense.description} - ${expense.montant}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune dépense enregistrée.</p>
        )}
      </div>

      <div className="mb-4">
        <p className="text-xl font-bold">Total de la catégorie : ${totalForCategory.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CategoryPage;
