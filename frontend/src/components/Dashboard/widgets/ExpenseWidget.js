// components/Dashboard/widgets/ExpenseWidget.js
import React from "react";

const ExpenseWidget = ({ totalExpenses }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-2">Dépenses totales</h3>
      <p className="text-2xl text-red-400">${totalExpenses.toFixed(2)}</p>
    </div>
  );
};

export default ExpenseWidget;
