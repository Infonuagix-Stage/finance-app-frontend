// components/BudgetingPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  createCategoryForUser,
  getCategoriesForUser,
} from "../services/categoryService";
import { getCategoryTotal } from "../services/totalService";
import { useAuthContext } from "../context/AuthContext";
import { useBudgetContext } from "../context/BudgetContext"; // Importez useBudgetContext

const BudgetingPage = () => {
  const { user } = useAuthContext();
  const { setTotalIncome, setTotalExpense, setGlobalBalance } =
    useBudgetContext(); // Utilisez useBudgetContext
  const userId = user ? user.id : null;

  const [categories, setCategories] = useState([]);
  const [totalsMap, setTotalsMap] = useState({});
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const [newExpenseCategoryName, setNewExpenseCategoryName] = useState("");
  const [newExpenseCategoryDesc, setNewExpenseCategoryDesc] = useState("");
  const [newIncomeCategoryName, setNewIncomeCategoryName] = useState("");
  const [newIncomeCategoryDesc, setNewIncomeCategoryDesc] = useState("");

  useEffect(() => {
    if (!userId) return;
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategoriesForUser(userId);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [userId]);

  useEffect(() => {
    if (categories.length === 0 || !userId) return;
    const fetchTotals = async () => {
      const newTotalsMap = {};
      await Promise.all(
        categories.map(async (cat) => {
          try {
            const total = await getCategoryTotal(userId, cat.id, cat.type);
            newTotalsMap[cat.id] = total;
          } catch {
            newTotalsMap[cat.id] = 0;
          }
        })
      );
      setTotalsMap(newTotalsMap);
    };
    fetchTotals();
  }, [categories, userId]);

  const totalIncome = categories.reduce(
    (acc, cat) =>
      cat.type === "INCOME" ? acc + (totalsMap[cat.id] || 0) : acc,
    0
  );
  const totalExpense = categories.reduce(
    (acc, cat) =>
      cat.type === "EXPENSE" ? acc + (totalsMap[cat.id] || 0) : acc,
    0
  );
  const globalBalance = totalIncome - totalExpense;

  // Mettre à jour le contexte
  setTotalIncome(totalIncome);
  setTotalExpense(totalExpense);
  setGlobalBalance(globalBalance);

  const addCategory = async (type) => {
    const name =
      type === "EXPENSE" ? newExpenseCategoryName : newIncomeCategoryName;
    const desc =
      type === "EXPENSE" ? newExpenseCategoryDesc : newIncomeCategoryDesc;

    if (name.trim() === "") return;

    try {
      const categoryData = { name, description: desc, type };
      const created = await createCategoryForUser(userId, categoryData);
      setCategories([...categories, created]);

      if (type === "EXPENSE") {
        setNewExpenseCategoryName("");
        setNewExpenseCategoryDesc("");
        setIsExpenseModalVisible(false);
      } else {
        setNewIncomeCategoryName("");
        setNewIncomeCategoryDesc("");
        setIsIncomeModalVisible(false);
      }
    } catch (error) {
      console.error(`Error adding ${type} category:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 px-6 py-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto bg-gray-700 bg-opacity-80 rounded-xl shadow-lg p-8 border border-gray-600">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-4">
          Gestion du Budget
        </h1>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">
            <span className="text-green-400">
              Revenus : ${totalIncome.toFixed(2)}
            </span>{" "}
            |{" "}
            <span className="text-red-400">
              Dépenses : ${totalExpense.toFixed(2)}
            </span>
          </p>
          <p
            className={`text-2xl font-bold ${
              globalBalance >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            Balance : ${globalBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-2 gap-12">
        {/* Expenses */}
        <div>
          <h2 className="text-2xl font-bold text-red-400 mb-6">Dépenses</h2>
          <div className="space-y-4">
            {categories
              .filter((cat) => cat.type === "EXPENSE")
              .map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  state={{
                    categoryName: cat.name,
                    categoryId: cat.id,
                    categoryType: cat.type,
                  }}
                  className="block p-4 bg-gray-800 rounded-lg shadow border border-gray-700 hover:bg-gray-700"
                >
                  <h4 className="text-lg font-semibold">{cat.name}</h4>
                  <p className="text-sm text-gray-300 mt-2">
                    Total : ${totalsMap[cat.id] || 0}
                  </p>
                </Link>
              ))}
            <button
              onClick={() => setIsExpenseModalVisible(true)}
              className="w-full flex items-center justify-center py-4 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg shadow-lg border border-gray-500"
            >
              <span className="text-3xl font-bold">+</span>
            </button>
          </div>
        </div>

        {/* Income */}
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-6">Revenus</h2>
          <div className="space-y-4">
            {categories
              .filter((cat) => cat.type === "INCOME")
              .map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  state={{
                    categoryName: cat.name,
                    categoryId: cat.id,
                    categoryType: cat.type,
                  }}
                  className="block p-4 bg-gray-800 rounded-lg shadow border border-gray-700 hover:bg-gray-700"
                >
                  <h4 className="text-lg font-semibold">{cat.name}</h4>
                  <p className="text-sm text-gray-300 mt-2">
                    Total : ${totalsMap[cat.id] || 0}
                  </p>
                </Link>
              ))}
            <button
              onClick={() => setIsIncomeModalVisible(true)}
              className="w-full flex items-center justify-center py-4 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg shadow-lg border border-gray-500"
            >
              <span className="text-3xl font-bold">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isExpenseModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-96 border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Ajouter une Dépense</h3>
            <input
              type="text"
              placeholder="Nom"
              value={newExpenseCategoryName}
              onChange={(e) => setNewExpenseCategoryName(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100"
            />
            <textarea
              placeholder="Description"
              value={newExpenseCategoryDesc}
              onChange={(e) => setNewExpenseCategoryDesc(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsExpenseModalVisible(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => addCategory("EXPENSE")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {isIncomeModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-96 border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Ajouter un Revenu</h3>
            <input
              type="text"
              placeholder="Nom"
              value={newIncomeCategoryName}
              onChange={(e) => setNewIncomeCategoryName(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100"
            />
            <textarea
              placeholder="Description"
              value={newIncomeCategoryDesc}
              onChange={(e) => setNewIncomeCategoryDesc(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsIncomeModalVisible(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => addCategory("INCOME")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetingPage;
