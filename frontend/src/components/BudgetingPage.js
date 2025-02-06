import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Vous n'utilisez plus createIncomeForCategory ou createExpenseForCategory ici
// import { createIncomeForCategory } from "../services/incomeService";
// import { createExpenseForCategory } from "../services/expenseService";
import { createCategoryForUser, getCategoriesForUser } from "../services/categoryService";

import { useAuthContext } from "../context/AuthContext";

const BudgetingPage = () => {
  const { user, token } = useAuthContext();
  const userId = user ? user.id : null;

  const [categories, setCategories] = useState([]);

  const [newExpenseCategoryName, setNewExpenseCategoryName] = useState("");
  const [newExpenseCategoryDesc, setNewExpenseCategoryDesc] = useState("");

  const [newIncomeCategoryName, setNewIncomeCategoryName] = useState("");
  const [newIncomeCategoryDesc, setNewIncomeCategoryDesc] = useState("");

  useEffect(() => {
    if (!userId) return;
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategoriesForUser(userId);
        console.log("Catégories récupérées :", fetchedCategories);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des catégories :",
          error.response || error.message
        );
      }
    };
    fetchCategories();
  }, [userId, token]);

  const addExpenseCategory = async () => {
    if (newExpenseCategoryName.trim() === "") return;
    if (!userId) {
      console.error("L'ID utilisateur est indéfini. Impossible d'ajouter une catégorie.");
      return;
    }
    try {
      const categoryData = {
        name: newExpenseCategoryName,
        description: newExpenseCategoryDesc,
        type: "EXPENSE",
      };
      const created = await createCategoryForUser(userId, categoryData);
      setCategories([...categories, created]);
      setNewExpenseCategoryName("");
      setNewExpenseCategoryDesc("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie expense :", error);
    }
  };
  
  

  const addIncomeCategory = async () => {
    if (newIncomeCategoryName.trim() === "") return;
    if (!userId) {
      console.error("L'ID utilisateur est indéfini. Impossible d'ajouter une catégorie.");
      return;
    }
    try {
      const categoryData = {
        name: newIncomeCategoryName,
        description: newIncomeCategoryDesc,
        type: "INCOME",
      };
      const created = await createCategoryForUser(userId, categoryData);
      setCategories([...categories, created]);
      setNewIncomeCategoryName("");
      setNewIncomeCategoryDesc("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie income :", error);
    }
  };

  if (!user) {
    return <p>Chargement ou redirection...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <h1 className="text-3xl font-bold mb-6">Budgeting Categories</h1>

      <div className="mb-8 border p-4 rounded bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Ajouter une Catégorie de Dépenses</h2>
        <input
          type="text"
          placeholder="Nom de la catégorie expense"
          value={newExpenseCategoryName}
          onChange={(e) => setNewExpenseCategoryName(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-gray-200 mb-4"
        />
        <textarea
          placeholder="Description de la catégorie expense"
          value={newExpenseCategoryDesc}
          onChange={(e) => setNewExpenseCategoryDesc(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-gray-200 mb-4"
        />
        <button
          onClick={addExpenseCategory}
          className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
        >
          Ajouter Catégorie Expense
        </button>
      </div>

      <div className="mb-8 border p-4 rounded bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Ajouter une Catégorie de Revenus</h2>
        <input
          type="text"
          placeholder="Nom de la catégorie income"
          value={newIncomeCategoryName}
          onChange={(e) => setNewIncomeCategoryName(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-gray-200 mb-4"
        />
        <textarea
          placeholder="Description de la catégorie income"
          value={newIncomeCategoryDesc}
          onChange={(e) => setNewIncomeCategoryDesc(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-gray-200 mb-4"
        />
        <button
          onClick={addIncomeCategory}
          className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700"
        >
          Ajouter Catégorie Income
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Liste des Catégories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${encodeURIComponent(category.name)}`}
              state={{
                categoryName: category.name,
                categoryId: category.id,
                categoryType: category.type, // "EXPENSE" ou "INCOME"
              }}
              className="block p-6 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition"
            >
              <h3 className="text-lg font-semibold text-white">{category.name}</h3>
              <p className="text-gray-400 text-sm">{category.description}</p>
              <p className="text-sm text-gray-300 mt-2">Type : {category.type}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetingPage;
