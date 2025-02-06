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

  // Récupérer les records en fonction du type de catégorie
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

  // Mettre à jour le total dès que "records" change
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
      <h1 className="text-3xl font-bold mb-6">
        Catégorie : {categoryName} ({categoryType})
      </h1>

      {/* Affichage du total pour cette catégorie */}
      <div className="mb-4">
        <strong>Total :</strong> ${currentTotal.toFixed(2)}
      </div>

      {/* Formulaire d'ajout de record */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Description"
          value={newRecord.description}
          onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
          className="w-full p-3 rounded bg-gray-800 text-gray-200 mb-4"
        />
        <input
          type="number"
          placeholder="Montant"
          value={newRecord.amount}
          onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })}
          className="w-full p-3 rounded bg-gray-800 text-gray-200 mb-4"
        />
        <button
          onClick={addRecord}
          className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
        >
          Ajouter {categoryType && categoryType.toUpperCase() === "INCOME" ? "Income" : "Expense"}
        </button>
      </div>

      {/* Affichage des records */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {categoryType && categoryType.toUpperCase() === "INCOME" ? "Incomes" : "Expenses"}
        </h2>
        {records.length > 0 ? (
          <ul className="space-y-2">
            {records.map((rec) => (
              <li key={rec.id} className="p-3 bg-gray-800 rounded">
                {rec.description} - ${rec.montant || rec.amount}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun enregistrement.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
