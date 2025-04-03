import React, { useState, ChangeEvent } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import RecordActions from "../RecordActions";
import useRecords from "../../hooks/useRecords";
import "./CategoryPage.css";

interface TransactionRecord {
  expenseId?: string;
  incomeId?: string;
  description: string;
  amount: number;
  expenseDate?: string;
  incomeDate?: string;
}

interface CategoryPageLocationState {
  categoryId?: string;
  categoryType?: "INCOME" | "EXPENSE";
  year?: number;
  month?: number;
}

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const location = useLocation();
  const state = location.state as CategoryPageLocationState | undefined;
  const { user, isAuthenticated, isLoading } = useAuth0();

  const userId: string = user?.sub ?? "";

  const { categoryId, year: initialYear, month: initialMonth } = state || {};
  const categoryType: "INCOME" | "EXPENSE" = state?.categoryType ?? "EXPENSE";

  const initialDate = initialYear && initialMonth ? new Date(initialYear, initialMonth - 1) : new Date();
  const [currentDate] = useState<Date>(initialDate);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const {
    records,
    currentTotal,
    addRecord,
    handleDeleteRecord,
    handleEditRecord,
  } = useRecords({ userId, categoryId: categoryId ?? "", categoryType, year: currentYear, month: currentMonth });

  const filteredRecords = records.filter((rec) => {
    const dateStr = rec.expenseDate || rec.incomeDate;
    if (!dateStr) return false;
    const [year, month] = dateStr.split("-").map(Number);
    return year === currentYear && month === currentMonth;
  });

  const [newRecord, setNewRecord] = useState<{ description: string; amount: string }>({
    description: "",
    amount: "",
  });

  const [editingRecord, setEditingRecord] = useState<TransactionRecord | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in to view this page.</div>;

  const toLocalISODate = (date: Date): string => {
    const tzoffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzoffset).toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Category: {categoryName} ({categoryType})
      </h1>

      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="text-2xl font-semibold capitalize">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </div>
      </div>

      <div className="max-w-md mx-auto mb-6 bg-gray-800 p-6 rounded-xl shadow border border-gray-700">
        <h2 className="text-2xl font-semibold text-center mb-2">Total</h2>
        <p className="text-center text-xl">${(currentTotal ?? 0).toFixed(2)}</p>
      </div>

      <div className="max-w-md mx-auto mb-8 bg-gray-800 p-6 rounded-xl shadow border border-gray-700">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Add {categoryType === "INCOME" ? "Income" : "Expense"}
        </h2>
        <input
          type="text"
          placeholder="Description"
          value={newRecord.description}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewRecord({ ...newRecord, description: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 mb-4"
        />
        <input
          type="number"
          placeholder="Amount"
          value={newRecord.amount}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewRecord({ ...newRecord, amount: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 mb-4"
        />
        <button
          onClick={() => {
            const dateField = categoryType === "INCOME" ? "incomeDate" : "expenseDate";
            const recordData = {
              description: newRecord.description,
              amount: parseFloat(newRecord.amount),
              userId,
              categoryId,
              incomeDate: categoryType === "INCOME" ? toLocalISODate(currentDate) : undefined,
              expenseDate: categoryType === "EXPENSE" ? toLocalISODate(currentDate) : undefined,
            };
            addRecord(recordData);
            setNewRecord({ description: "", amount: "" });
          }}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
        >
          Add
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">
          {categoryType === "INCOME" ? "Income" : "Expense"} List
        </h2>
        {filteredRecords.length > 0 ? (
          <ul className="space-y-4">
            {filteredRecords.map((rec) => (
              <li
                key={rec.expenseId || rec.incomeId}
                className="p-4 bg-gray-800 rounded-lg shadow border border-gray-700 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">{rec.description ?? "No description"}</p>
                  <p className="text-gray-400">Amount: ${rec.amount}</p>
                </div>
                <RecordActions
                  onEdit={() => setEditingRecord({ ...rec })}
                  onDelete={() =>
                    handleDeleteRecord(categoryType === "INCOME" ? rec.incomeId! : rec.expenseId!)
                  }
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">No records found.</p>
        )}
      </div>

      {editingRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Edit Record</h2>
            <input
              type="text"
              value={editingRecord.description}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditingRecord({ ...editingRecord, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 mb-4"
            />
            <input
              type="number"
              value={editingRecord.amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditingRecord({ ...editingRecord, amount: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button onClick={() => setEditingRecord(null)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
                Cancel
              </button>
              <button
                onClick={() => {
                  handleEditRecord(editingRecord.expenseId ?? editingRecord.incomeId ?? "", editingRecord);
                  setEditingRecord(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
