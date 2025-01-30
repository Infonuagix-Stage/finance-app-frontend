import React, { useState } from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
    const { category } = useParams();
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ description: "", amount: "" });

    const addExpense = () => {
        if (newExpense.description && newExpense.amount) {
            setExpenses([...expenses, newExpense]);
            setNewExpense({ description: "", amount: "" });
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
            <h1 className="text-3xl font-bold mb-6">Category: {category}</h1>

            {/* Add Expense */}
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
                    placeholder="Amount"
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
                    Add Expense
                </button>
            </div>

            {/* Display Expenses */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Expenses</h2>
                {expenses.length > 0 ? (
                    <ul className="space-y-2">
                        {expenses.map((expense, index) => (
                            <li key={index} className="p-3 bg-gray-800 rounded">
                                {expense.description} - ${expense.amount}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No expenses added yet.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
