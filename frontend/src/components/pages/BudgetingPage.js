// components/BudgetingPage.js
import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useBudgetContext } from "../../context/BudgetContext";
import useCategories from "../../hooks/useCategories"; // Custom hook

const BudgetingPage = () => {
  const { user } = useAuthContext();
  const { setTotalIncome, setTotalExpense, setGlobalBalance } =
    useBudgetContext();
  const userId = user ? user.id : null;

  const {
    categories,
    totalsMap,
    newExpenseCategoryName,
    setNewExpenseCategoryName,
    newExpenseCategoryDesc,
    setNewExpenseCategoryDesc,
    newIncomeCategoryName,
    setNewIncomeCategoryName,
    newIncomeCategoryDesc,
    setNewIncomeCategoryDesc,
    addCategory,
    isExpenseModalVisible,
    setIsExpenseModalVisible,
    isIncomeModalVisible,
    setIsIncomeModalVisible,
  } = useCategories(userId);

  // Calculate totals
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

  useEffect(() => {
    setTotalIncome(totalIncome);
    setTotalExpense(totalExpense);
    setGlobalBalance(globalBalance);
  }, [totalIncome, totalExpense, globalBalance]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-6 py-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto bg-gray-700 bg-opacity-80 rounded-xl shadow-lg p-8 border border-gray-600">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-4">
          Gestion du Budget
        </h1>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">
            <span className="text-green-400">
              Dépenses : ${Number(totalExpense || 0).toFixed(2)}
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
