// components/Dashboard/widgets/BudgetWidget.js
import React from "react";

const BudgetWidget = ({ remainingBudget }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-2">Budget restant</h3>
      <p className="text-2xl text-green-400">${remainingBudget.toFixed(2)}</p>
    </div>
  );
};

export default BudgetWidget;
