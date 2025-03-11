// components/Dashboard/widgets/BudgetWidget.js
import React from "react";
import { useTranslation } from "react-i18next";

const BudgetWidget = ({ remainingBudget }) => {
  const { t } = useTranslation("dashboard");
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-2">{t("balance")}</h3>
      <p className="text-2xl text-green-400">${remainingBudget.toFixed(2)}</p>
    </div>
  );
};

export default BudgetWidget;
