import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createCategoryForUser, getCategoriesForUser } from "../services/categoryService";
import { getCategoryTotal } from "../services/totalService";
import { useAuthContext } from "../context/AuthContext";

const BudgetingPage = () => {
  const { user } = useAuthContext();
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
    (acc, cat) => (cat.type === "INCOME" ? acc + (totalsMap[cat.id] || 0) : acc),
    0
  );
  const totalExpense = categories.reduce(
    (acc, cat) => (cat.type === "EXPENSE" ? acc + (totalsMap[cat.id] || 0) : acc),
    0
  );
  const globalBalance = totalIncome - totalExpense;

  const addCategory = async (type) => {
    const name = type === "EXPENSE" ? newExpenseCategoryName : newIncomeCategoryName;
    const desc = type === "EXPENSE" ? newExpenseCategoryDesc : newIncomeCategoryDesc;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-6 py-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-6">
          Gestion du Budget
        </h1>
        <div className="text-center space-y-3">
          <p className="text-xl font-medium">
            <span className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
              Revenus : ${totalIncome.toFixed(2)}
            </span>{" "}
            |{" "}
            <span className="bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
              Dépenses : ${totalExpense.toFixed(2)}
            </span>
          </p>
          <p
            className={`text-3xl font-bold ${
              globalBalance >= 0
                ? "bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent"
            }`}
          >
            Balance : ${globalBalance.toFixed(2)}
          </p>
        </div>
      </div>
  
      {/* Categories */}
      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Expenses */}
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent mb-8">
            Dépenses
          </h2>
          <div className="space-y-6">
            {categories
              .filter((cat) => cat.type === "EXPENSE")
              .map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  state={{ categoryName: cat.name, categoryId: cat.id, categoryType: cat.type }}
                  className="block p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-lg border border-gray-700/50 hover:border-red-400/50 transition-all duration-300 hover:scale-105"
                >
                  <h4 className="text-xl font-semibold">{cat.name}</h4>
                  <p className="text-sm text-gray-300 mt-2">Total : ${totalsMap[cat.id] || 0}</p>
                </Link>
              ))}
            <button
              onClick={() => setIsExpenseModalVisible(true)}
              className="w-full flex items-center justify-center py-6 bg-gradient-to-br from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-gray-100 rounded-2xl shadow-lg border border-gray-600/50 transition-all duration-300 hover:scale-105"
            >
              <span className="text-4xl font-bold">+</span>
            </button>
          </div>
        </div>
  
        {/* Income */}
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent mb-8">
            Revenus
          </h2>
          <div className="space-y-6">
            {categories
              .filter((cat) => cat.type === "INCOME")
              .map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  state={{ categoryName: cat.name, categoryId: cat.id, categoryType: cat.type }}
                  className="block p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-lg border border-gray-700/50 hover:border-green-400/50 transition-all duration-300 hover:scale-105"
                >
                  <h4 className="text-xl font-semibold">{cat.name}</h4>
                  <p className="text-sm text-gray-300 mt-2">Total : ${totalsMap[cat.id] || 0}</p>
                </Link>
              ))}
            <button
              onClick={() => setIsIncomeModalVisible(true)}
              className="w-full flex items-center justify-center py-6 bg-gradient-to-br from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-gray-100 rounded-2xl shadow-lg border border-gray-600/50 transition-all duration-300 hover:scale-105"
            >
              <span className="text-4xl font-bold">+</span>
            </button>
          </div>
        </div>
      </div>
  
      {/* Modals */}
      {isExpenseModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 w-96 border border-gray-700/50">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent mb-6">
              Ajouter une Dépense
            </h3>
            <input
              type="text"
              placeholder="Nom"
              value={newExpenseCategoryName}
              onChange={(e) => setNewExpenseCategoryName(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-400/50"
            />
            <textarea
              placeholder="Description"
              value={newExpenseCategoryDesc}
              onChange={(e) => setNewExpenseCategoryDesc(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-400/50"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsExpenseModalVisible(false)}
                className="px-6 py-2 bg-gray-600/50 hover:bg-gray-500/50 text-white rounded-lg transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={() => addCategory("EXPENSE")}
                className="px-6 py-2 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white rounded-lg transition-all duration-200"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
  
      {isIncomeModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 w-96 border border-gray-700/50">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent mb-6">
              Ajouter un Revenu
            </h3>
            <input
              type="text"
              placeholder="Nom"
              value={newIncomeCategoryName}
              onChange={(e) => setNewIncomeCategoryName(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400/50"
            />
            <textarea
              placeholder="Description"
              value={newIncomeCategoryDesc}
              onChange={(e) => setNewIncomeCategoryDesc(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400/50"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsIncomeModalVisible(false)}
                className="px-6 py-2 bg-gray-600/50 hover:bg-gray-500/50 text-white rounded-lg transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={() => addCategory("INCOME")}
                className="px-6 py-2 bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white rounded-lg transition-all duration-200"
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
