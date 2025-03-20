// components/Dashboard/widgets/ExpenseWidget.js
import React from "react";
import { useTranslation } from "react-i18next";

const ExpenseWidget = ({ totalExpenses }) => {
  const { t } = useTranslation("dashboard");
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-2">{t("expense_total")}</h3>
      <p className="text-2xl text-red-400">${totalExpenses.toFixed(2)}</p>
    </div>
  );
};

export default ExpenseWidget;
