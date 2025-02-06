import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { getExpensesForCategory, createExpenseForCategory } from "../services/expenseService";
import { getIncomesForCategory, createIncomeForCategory } from "../services/incomeService";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const { user } = useAuthContext();
  const userId = user ? user.id : null;
  const { categoryId, categoryType } = location.state || {};

  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({ description: "", amount: "" });
  const [currentTotal, setCurrentTotal] = useState(0);

  // Fetch records for the given category
  useEffect(() => {
    if (!userId || !categoryId) return;
    const fetchRecords = async () => {
      try {
        let data;
        if (categoryType && categoryType.toUpperCase() === "INCOME") {
          data = await getIncomesForCategory(userId, categoryId);
        } else {
          data = await getExpensesForCategory(userId, categoryId);
        }
        setRecords(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors de la récupération des records :", error);
      }
    };
    fetchRecords();
  }, [userId, categoryId, categoryType]);

  // Update current total when records change
  useEffect(() => {
    const total = records.reduce((acc, record) => {
      const value = parseFloat(record.amount || record.montant || 0);
      return acc + value;
    }, 0);
    setCurrentTotal(total);
  }, [records]);

  const addRecord = async () => {
    if (!newRecord.description || !newRecord.amount || !categoryId) return;
    try {
      const recordData =
        categoryType && categoryType.toUpperCase() === "INCOME"
          ? {
              description: newRecord.description,
              amount: newRecord.amount,
              incomeDate: newRecord.incomeDate || new Date().toISOString().split("T")[0],
              userId: userId,
              categoryId: categoryId,
            }
          : {
              description: newRecord.description,
              amount: newRecord.amount,
              expenseDate: newRecord.expenseDate || new Date().toISOString().split("T")[0],
              userId: userId,
              categoryId: categoryId,
            };

      let created;
      if (categoryType && categoryType.toUpperCase() === "INCOME") {
        created = await createIncomeForCategory(userId, categoryId, recordData);
      } else {
        created = await createExpenseForCategory(userId, categoryId, recordData);
      }
      setRecords((prev) => (Array.isArray(prev) ? [...prev, created] : [created]));
      setNewRecord({ description: "", amount: "" });
    } catch (error) {
      console.error("Erreur lors de la création du record :", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Catégorie : {categoryName} ({categoryType})
      </h1>

      {/* Card for displaying current total */}
      <div className="max-w-md mx-auto mb-6 bg-gray-800 p-6 rounded-xl shadow border border-gray-700">
        <h2 className="text-2xl font-semibold text-center mb-2">Total</h2>
        <p className="text-center text-xl">${currentTotal.toFixed(2)}</p>
      </div>

      {/* Form to add a record */}
      <div className="max-w-md mx-auto mb-8 bg-gray-800 p-6 rounded-xl shadow border border-gray-700">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Ajouter {categoryType && categoryType.toUpperCase() === "INCOME" ? "Income" : "Expense"}
        </h2>
        <input
          type="text"
          placeholder="Description"
          value={newRecord.description}
          onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Montant"
          value={newRecord.amount}
          onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={addRecord}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
        >
          Ajouter
        </button>
      </div>

      {/* List of records */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Liste des {categoryType && categoryType.toUpperCase() === "INCOME" ? "Incomes" : "Expenses"}</h2>
        {records.length > 0 ? (
          <ul className="space-y-4">
            {records.map((rec) => (
              <li key={rec.id} className="p-4 bg-gray-800 rounded-lg shadow border border-gray-700">
                <p className="text-lg font-semibold">{rec.description}</p>
                <p className="text-gray-400">Montant : ${rec.montant || rec.amount}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">Aucun enregistrement.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
