// components/Dashboard/widgets/SavingsWidget.js
import React from "react";

const SavingsWidget = ({ savingsProgress }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-2">Épargne</h3>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-500 h-2.5 rounded-full"
          style={{ width: `${savingsProgress}%` }}
        ></div>
      </div>
      <p className="text-gray-300 mt-2">
        {savingsProgress}% de l'objectif atteint
      </p>
    </div>
  );
};

export default SavingsWidget;
