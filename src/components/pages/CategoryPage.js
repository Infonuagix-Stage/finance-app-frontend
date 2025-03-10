import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // Use Auth0 hook
import RecordActions from "../RecordActions";
import useRecords from "../../hooks/useRecords";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth0(); // Destructure the Auth0 hook
  const userId = user ? user.sub : null; // Auth0 user ID is typically stored in 'sub'
  const { categoryId, categoryType } = location.state || {};

  // ✅ Add these state variables for form inputs
  const [newRecord, setNewRecord] = useState({ description: "", amount: "" });
  const [editingRecord, setEditingRecord] = useState(null);

  const {
    records,
    currentTotal,
    addRecord,
    handleDeleteRecord,
    handleEditRecord,
  } = useRecords(userId, categoryId, categoryType);

  if (isLoading) {
    return <div>Loading...</div>; // Optionally show a loading indicator while Auth0 is loading
  }

  if (!isAuthenticated) {
    return <div>Please log in to view this page.</div>; // Optionally show a login prompt if the user is not authenticated
  }

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
          Ajouter{" "}
          {categoryType && categoryType.toUpperCase() === "INCOME"
            ? "Income"
            : "Expense"}
        </h2>
        <input
          type="text"
          placeholder="Description"
          value={newRecord.description}
          onChange={(e) =>
            setNewRecord({ ...newRecord, description: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Montant"
          value={newRecord.amount}
          onChange={(e) =>
            setNewRecord({ ...newRecord, amount: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={() => {
            const dateField =
              categoryType === "INCOME" ? "incomeDate" : "expenseDate";
            const recordData = {
              description: newRecord.description,
              amount: newRecord.amount,
              [dateField]: new Date().toISOString().split("T")[0],
              userId: userId, // Ensure userId is included
              categoryId: categoryId, // Ensure categoryId is included
            };
            addRecord(recordData); // Pass the record data
            setNewRecord({ description: "", amount: "" });
          }}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
        >
          Ajouter
        </button>
      </div>

      {/* List of records */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">
          Liste des{" "}
          {categoryType && categoryType.toUpperCase() === "INCOME"
            ? "Incomes"
            : "Expenses"}
        </h2>
        {records.length > 0 ? (
          <ul className="space-y-4">
            {records.map((rec) => (
              <li
                key={rec.id}
                className="p-4 bg-gray-800 rounded-lg shadow border border-gray-700 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">{rec.description}</p>
                  <p className="text-gray-400">
                    Montant : ${rec.montant || rec.amount}
                  </p>
                </div>
                <RecordActions
                  onEdit={() => setEditingRecord(rec)} // Open the edit form
                  onDelete={() => handleDeleteRecord(rec.id)} // Delete record
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">Aucun enregistrement.</p>
        )}
      </div>

      {/* Formulaire de modification */}
      {editingRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">
              Modifier l'enregistrement
            </h2>
            <input
              type="text"
              placeholder="Description"
              value={editingRecord.description}
              onChange={(e) =>
                setEditingRecord({
                  ...editingRecord,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Montant"
              value={editingRecord.amount || editingRecord.montant}
              onChange={(e) =>
                setEditingRecord({ ...editingRecord, amount: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  const updatedData = {
                    ...editingRecord,
                    categoryId: categoryId, // Ensure categoryId is included
                    userId: userId, // Ensure userId is included
                    expenseDate:
                      editingRecord.expenseDate ||
                      new Date().toISOString().split("T")[0], // Add expenseDate with default value
                  };
                  console.log("Updated Data:", updatedData); // Log for debugging
                  handleEditRecord(editingRecord.id, updatedData);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
